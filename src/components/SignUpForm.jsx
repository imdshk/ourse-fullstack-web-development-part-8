import { useState } from 'react'
import { CREATE_USER } from '../graphql/mutations/userMutations'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS } from '../graphql/queries/authorQueries'

const CREATE_USER_DATA = CREATE_USER

const SignUpForm = ({ setError }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [favoriteGenre, setFavoriteGenre] = useState('')
  
  const [ createUser ] = useMutation(CREATE_USER_DATA, {
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    },
    update: (cache, response) => {      
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allPersons }) => {        
        return {          
          allPersons: allPersons.concat(response.data.addPerson),        
        }      
      })    
    },
  })

  const submit = (event) => {
    event.preventDefault()

    createUser({ variables: { username, password, favoriteGenre }})
    
    setUsername('')
    setPassword('')
    setFavoriteGenre('')

  }

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <div>
          username <input value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        </div>
        <div>
            password <input value={password}
            onChange={({ target }) => setPassword(target.value)}
            type='password'
          />
        </div>
        <div>
            favoriteGenre <input value={favoriteGenre}
            onChange={({ target }) => setFavoriteGenre(target.value)}
          />
        </div>
        <button type='submit'>signup!</button>
      </form>
    </div>
  )
}

export default SignUpForm