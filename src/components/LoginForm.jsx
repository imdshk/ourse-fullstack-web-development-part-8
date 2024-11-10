import { useEffect, useState } from 'react'
import { LOGIN_USER } from '../graphql/mutations/userMutations'
import { useMutation } from '@apollo/client'
import SignUpForm from './SignUpForm'
const LOGIN_USER_DATA = LOGIN_USER

const LoginForm = ({ setToken, setError }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [signUp, setSignUp] = useState(false)
  
  const [ loginUser, result ] = useMutation(LOGIN_USER_DATA, {
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-apps-user-token', token)
    }
  }, [result.data])

  const submit = (event) => {
    event.preventDefault()

    loginUser({ variables: { username, password } })
    
    setUsername('')
    setPassword('')

  }

  const toggleSignUp = () => {
    setSignUp(!signUp)
  }

  return (
    <div>
      {signUp ? <></> : 
        <div>
          <h2>Login</h2>
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
            <button type='submit'>login!</button>
          </form>
          <button onClick={toggleSignUp}>SignUp</button>
        </div>
      }
      {signUp ? 
        <div>
          <SignUpForm setError={setError} /> 
          <button onClick={toggleSignUp}>login</button>
        </div> : <></>}
    </div>
  )
}

export default LoginForm