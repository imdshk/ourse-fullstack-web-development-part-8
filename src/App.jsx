import { useQuery } from '@apollo/client'
import Notify from './components/Notify'
import Authors from './components/Authors'
import Books from './components/Books'
import BookForm from './components/BookForm'
import { ALL_AUTHORS } from './graphql/queries/authorQueries'
import { FIND_BOOKS } from './graphql/queries/bookQueries'
import { useState } from 'react'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

const ALL_AUTHORS_DATA = ALL_AUTHORS
const ALL_BOOKS_DATA = FIND_BOOKS

const App = () => {
  const padding = {
    padding: 5
  }

  const result_authors = useQuery(ALL_AUTHORS_DATA)
  const result_books = useQuery(ALL_BOOKS_DATA)
  
  const [errorMessage, setErrorMessage] = useState(null)

  if (result_authors.loading || result_books.loading ) {
    return <div>loading...</div>
  }

  const notify = (message) => {    
    setErrorMessage(message)    
    setTimeout(() => {      
      setErrorMessage(null)    
    }, 10000)  
  }

  return (
    <Router>
      <Notify errorMessage={errorMessage} />
      <div>
        <Link style={padding} to="/">Authors</Link>
        <Link style={padding} to="/books">Books</Link>
        <Link style={padding} to="/books/book">Add Book</Link>
      </div>

      <Routes>
        <Route path="/" element={<Authors authors={result_authors.data.allAuthors} setError={notify} />} />
        <Route path="/books" element={<Books books={result_books.data.allBooks} /> } />
        <Route path="/books/book" element={<BookForm setError={notify} /> } />
      </Routes>
    </Router>
  )
}

export default App