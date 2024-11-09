import { gql } from '@apollo/client'

export const EDIT_AUTHOR = gql`
mutation EditAuthor(
  $name: String!, 
  $setBornTo: Int!) {
  editAuthor(
    name: $name, 
    setBornTo: $setBornTo
  ) {
    name
    born
  }
}
`