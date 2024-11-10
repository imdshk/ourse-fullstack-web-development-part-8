const BookList = ({ books }) => {
  return (
    <table>  
      <thead>  
        <tr>  
          <th>Title</th>  
          <th>Author</th>  
          <th>Published</th>  
          <th>Genres</th>  
        </tr>  
      </thead>  
      <tbody>  
        {books.map(book => (  
          <tr key={book.id}>  
            <td>{book.title}</td>  
            <td>{book.author.name}</td>  
            <td>{book.published}</td>  
            <td>{book.genres.join(', ')}</td>  
          </tr>  
        ))}  
      </tbody>  
    </table>
  )
}

export default BookList