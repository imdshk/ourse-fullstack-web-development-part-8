const Books = ({ books }) => {
  return (
    <div>
      <h2>Books</h2>
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
                    <td>{book.author}</td>  
                    <td>{book.published}</td>  
                    <td>{book.genres.join(', ')}</td>  
                </tr>  
            ))}  
        </tbody>  
      </table> 
    </div>
  )
}

export default Books