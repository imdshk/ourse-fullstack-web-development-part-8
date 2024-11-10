import { useQuery } from '@apollo/client'
import Notify from './components/Notify'
import Authors from './components/Authors'
import Books from './components/Books'
import BookForm from './components/BookForm'
import { ALL_AUTHORS } from './graphql/queries/authorQueries'
import { FIND_BOOKS } from './graphql/queries/bookQueries'
import { useState } from 'react'
import { useApolloClient  } from '@apollo/client'

import {
  BrowserRouter as Router,
  Routes, Route, Link,
  Navigate
} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { CURRENT_USER_DETAILS } from './graphql/queries/userQueries'

const ALL_AUTHORS_DATA = ALL_AUTHORS
const ALL_BOOKS_DATA = FIND_BOOKS

const App = () => {
  const padding = {
    padding: 5
  }

  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('library-apps-user-token'))

  const result_authors = useQuery(ALL_AUTHORS_DATA)
  const result_books = useQuery(ALL_BOOKS_DATA)
  const result_currentUsersDetails = useQuery(CURRENT_USER_DETAILS)

  const client = useApolloClient()
  
  if (result_authors.loading || result_books.loading ) {
    return <div>loading...</div>
  }

  const logout = () => {    
    setToken(null)    
    localStorage.clear()    
    client.resetStore()  
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
      {token ? <button onClick={logout}>logout</button> : <></>}
      <div>
        <Link style={padding} to="/">Authors</Link>
        <Link style={padding} to="/books">Books</Link>
        {token ? 
          <>
            <Link style={padding} to="/books/book">Add Book</Link> 
            <Link style={padding} to="/me/recommended-books">Recommended</Link> 
          </>
          :
          <Link style={padding} to="/login">Login</Link>
        }
      </div>

      <Routes>
        <Route path="/" element={<Authors authors={result_authors.data.allAuthors} setError={notify} />} />
        <Route path="/books" element={<Books books={result_books.data.allBooks} /> } />
        <Route path="/books/book" element={
          token ? 
          <BookForm setError={notify} /> :
          <Navigate replace to={"/login"} /> } 
        />          
        <Route path="/me/recommended-books" element={
          token ? 
          <Recommendations books={result_books.data.allBooks} currentUserDetails={result_currentUsersDetails.data.me} /> :
          <Navigate replace to={"/login"} /> } 
        />          
        <Route path="/login" element={
          token ?
          <Navigate replace to={"/"} /> :
          <LoginForm setToken={setToken} setError={notify} /> } />
      </Routes>
    </Router>
  )
}

export default App