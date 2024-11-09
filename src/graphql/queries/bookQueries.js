import { gql } from '@apollo/client'

export const FIND_BOOKS = gql`
query findBooksByAuthorAndGenre($authorToSearch: String, $genreToSearch: String) {
  allBooks(author: $authorToSearch, genre: $genreToSearch) {
    title
    author {
      name
      born
      bookCount
      id
    }
    published
    genres
    id
  }
}
`