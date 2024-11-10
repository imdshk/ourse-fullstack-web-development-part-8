import { useQuery } from '@apollo/client'
import BookList from './BookList'
import { useEffect, useState } from 'react'
import { FIND_BOOKS } from '../graphql/queries/bookQueries'

const Recommendations = ({ books, currentUserDetails }) => {
  const [filteredBooks, setfilteredBooks] = useState([])

  const result_filteredBooks = useQuery(FIND_BOOKS, {
    variables: { genreToSearch: currentUserDetails.favoriteGenre }
  })
  
  useEffect(() => {  
    if (result_filteredBooks.data) {  
      setfilteredBooks(result_filteredBooks.data.allBooks)  
    }  
  }, [result_filteredBooks.data]) 

  return (
    <div>
      <h2>Books</h2>
      <p> in your favorite genre <b>{currentUserDetails.favoriteGenre}</b> </p>
      <BookList books={filteredBooks} />
    </div>
  )
}

export default Recommendations