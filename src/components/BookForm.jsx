import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS } from '../graphql/queries/authorQueries'
import { CREATE_BOOK } from '../graphql/mutations/bookMutations'
import { FIND_BOOKS } from '../graphql/queries/bookQueries'

const CREATE_BOOK_DATA = CREATE_BOOK

const BookForm = ({ setError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(CREATE_BOOK_DATA, {
    refetchQueries: [ 
      { query: ALL_AUTHORS }, 
      { query: FIND_BOOKS } 
    ],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    }
  })

  const submit = async (event) => {
    event.preventDefault()
    createBook({ variables: { title, author, published: Number(published), genres} })

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenre('')
    setGenres([])
  }

  const addGenre = (event) => {
    event.preventDefault()
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>Add Book</h2>
      <form onSubmit={submit}>
        <div>
          title <input value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author <input value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published <input value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          genres <input value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre}>add genre</button>
        </div>
        {genres.map(genre => 
          <div key={genre} >genres: {genre}</div>
        )}
        <button type='submit'>add!</button>
      </form>
    </div>
  )
}

export default BookForm