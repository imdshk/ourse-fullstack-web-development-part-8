import { gql } from '@apollo/client'

export const CREATE_BOOK = gql`
mutation createNewBook(
  $title: String!, 
  $genres: [String!]!, 
  $author: String!, 
  $published: Int!) {
  addBook(
    title: $title, 
    genres: $genres, 
    author: $author, 
    published: $published
  ) {
    title
    author
    published
    genres
    id
  }
}
`