const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Author = require('../../models/author')
const Book = require('../../models/book')
const User = require('../../models/user')
require('dotenv').config()
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const SALT_ROUNDS = process.env.SALT_ROUNDS
const JWT_SECRET = process.env.JWT_SECRET

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      console.log('Book.find')
      if (!args.author) {
        if (!args.genre) {
          // no author or genre parameter
          return Book.find({}).populate('author')
        }
        // only genre parameter
        const filteredBooks = await Book.find({ genres: { $in: args.genre } }).populate('author')
        return filteredBooks
      }

      const authorId = await Author.findOne({ name: args.author })


      if (!args.genre && authorId) {
        // only author parameter
        return Book.find({author: authorId._id}).populate('author')
      }
      
      // both parameters
      return Book.find({ author: { $in: authorId }, genres: { $in: args.genre }}).populate('author')
    },
    allAuthors: async () => await Author.find({}).populate('books'),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args) => { 
      let author = await Author.findOne({ name: args.author })
      if (!author) {  
        author = new Author({ name: args.author, bookCount: 0 });  
        await author.save()
      }

      const book = new Book({ 
        title: args.title,  
        author: author.id, 
        published: args.published,  
        genres: args.genres
      })

      try {
        await book.save()
        author.books.push(book)
        author.bookCount = author.bookCount + 1
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book.populate('author') })

      return await book.populate('author')
    },  
    editAuthor: async (root, args, context) => {
      const author = await Author.findOne({ name: args.name })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      author.born = args.setBornTo
      
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Editing number failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const passwordHash = await bcrypt.hash(args.password, Number(SALT_ROUNDS))
      const user = new User({ 
        username: args.username,
        passwordHash: passwordHash,
        favoriteGenre: args.favoriteGenre
      })
      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }

      return user
    },
    login: async (root, args) => {
      // check if exists
      const user = await User.findOne({ username: args.username })
      if ( !user ) {
        throw new GraphQLError('user does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }

      // check if password matches
      const validPassword = await bcrypt.compare(args.password, user.passwordHash)
      if ( !validPassword ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {    
    bookAdded: {      
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')    
    },  
  }
}

module.exports = resolvers