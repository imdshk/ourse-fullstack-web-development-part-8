import { gql } from '@apollo/client'

export const CREATE_USER = gql`
mutation createNewUser(
  $username: String!,
  $favoriteGenre: String!,
  $password: String!) {
  createUser(
    username: $username,
    favoriteGenre: $favoriteGenre,
    password: $password
  ) {
    username
    id
    favoriteGenre
  }
}
`

export const LOGIN_USER = gql`
mutation loginUser(
  $username: String!,
  $password: String!) {
  login(
    username: $username, 
    password: $password
  ) {
    value  
  }
}
`