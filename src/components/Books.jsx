import { useEffect, useState } from "react"
import BookList from "./BookList"
import { FIND_BOOKS } from "../graphql/queries/bookQueries"
import { useQuery } from "@apollo/client"

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