import { useEffect, useState } from "react"
import BookList from "./BookList"
import { BOOK_ADDED, FIND_BOOKS, ALL_BOOKS } from "../graphql/queries/bookQueries"
import { useQuery, useSubscription } from "@apollo/client"
import { updateCache } from "../App"

const Books = ({ books }) => {
  const [filteredBooks, setfilteredBooks] = useState(books)
  const [selectedGenre, setSelectedGenre] = useState('')

  let genres = [] 
  books.forEach(book => {
    genres = genres.concat(book.genres)
  })

  const uniqueGenres = [ ...new Set(genres)]

  const onClick = (genre) => {
    setSelectedGenre(genre)
  }

  const result_filteredBooks = useQuery(FIND_BOOKS, {
    variables: { genreToSearch: selectedGenre }
  }, [selectedGenre])
  
  useEffect(() => {  
    if (result_filteredBooks.data) {  
      setfilteredBooks(result_filteredBooks.data.allBooks) 
    }  
  }, [result_filteredBooks.data]) 

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
      window.alert(`${addedBook.title} added`)
      client.cache.updateQuery(
        {query: ALL_BOOKS}, ({allBooks}) => {
          return {
            allBooks: allBooks.concat(addedBook)
          }
        }
      )
    }
  })
  

  return (
    <div>
      <h2>Books</h2>
      <p>in <b>{selectedGenre ? selectedGenre : 'all' }</b> genre</p>
      {uniqueGenres.map(genre => {
        return <button onClick={() => onClick(genre)} key={genre} >{genre}</button>
      })} 
      <BookList books={filteredBooks} />
    </div>
  )
}

export default Books