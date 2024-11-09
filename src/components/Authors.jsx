import AuthorEditForm from './AuthorEditForm'

const Authors = ({ authors, setError }) => {
  return (
    <div>
        <h2>Authors</h2>
        <table>  
          <thead>  
              <tr>  
                  <th>Author</th>  
                  <th>Born</th>  
                  <th>Book Count</th>  
              </tr>  
          </thead>  
          <tbody>  
              {authors.map(author => (  
                  <tr key={author.id}>  
                      <td>{author.name}</td>  
                      <td>{author.born}</td>  
                      <td>{author.bookCount}</td>  
                  </tr>  
              ))}  
          </tbody>  
      </table>
    <h2>Set Birthyear</h2>
    <AuthorEditForm authors={authors} setError={setError} />
    </div>
  )
}

export default Authors