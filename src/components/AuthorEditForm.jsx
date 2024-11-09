import React, { useState } from 'react'
import { EDIT_AUTHOR } from '../graphql/mutations/authorMutations'
import { ALL_AUTHORS } from '../graphql/queries/authorQueries'
import { useMutation } from '@apollo/client'

const EDIT_AUTHOR_DATA = EDIT_AUTHOR

const AuthorEdit = ({ authors, setError }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR_DATA, {
    refetchQueries: [ 
      { query: ALL_AUTHORS }
    ],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    }
  })

  const submit = async (event) => {
    event.preventDefault()

    editAuthor({ variables: { name, setBornTo: Number(born) } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <select 
          onChange={({ target }) => setName(target.value)}
          required={true}
          defaultValue={'a'}
        >
          {authors.map((author) =>
            <option value={author.name}>{author.name}</option>
          )}
        </select>
        <div>
          born <input value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>add!</button>
      </form>
    </div>
  )
}

export default AuthorEdit