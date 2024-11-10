const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
const SALT_ROUNDS = process.env.SALT_ROUNDS
const JWT_SECRET = process.env.JWT_SECRET

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, {
  dbName: 'libraryApp'
})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    author: Author!
    published: String!
    genres: [String!]!
    id: String!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
      password: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author) {
        if (!args.genre) {
          // no author or genre parameter
          return Book.find({})
        }
        // only genre parameter
        return Book.find({ genres: { $exists: args.genre === 'YES' } })
      }

      const authorId = await Author.findOne({ name: args.author })


      if (!args.genre && authorId) {
        // only author parameter
        return Book.find({author: authorId._id})
      }
      
      // both parameters
      return Book.find({ author: { $exists: authorId === 'YES' }, genres: { $exists: args.genre === 'YES' }})
    },
    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args) => { 
      let author = await Author.findOne({ name: args.author })
      if (!author) {  
        author = new Author({ name: args.author });  
        await author.save();  
      }

      const book = new Book({ 
        title: args.title,  
        author: author.id, // assuming `author` is the Author document  
        published: args.published,  
        genres: args.genres
      })
      // const currentUser = context.currentUser

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return book
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
  Author: {
    bookCount: async (author) => await Book.collection.countDocuments({ author: author._id })
  },
  Book: {  
    author: async (book) => {  
      return await Author.findById(book.author) 
    }  
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})


startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {    
    const auth = req ? req.headers.authorization : null    
    if (auth && auth.startsWith('Bearer ')) {      
      const decodedToken = jwt.verify(        
        auth.substring(7), process.env.JWT_SECRET      
      )      
      const currentUser = await User        
        .findById(decodedToken.id)   
      return { currentUser }    
    }  
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})