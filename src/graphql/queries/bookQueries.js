import { gql } from '@apollo/client'

export const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
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
`

export const FIND_BOOKS = gql`
  query findBooksByAuthorAndGenre($authorToSearch: String, $genreToSearch: String) {
    allBooks(author: $authorToSearch, genre: $genreToSearch) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const ALL_BOOKS = gql`
  query allBooks {
    allBooks {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const BOOK_ADDED = gql`  
  subscription {    
    bookAdded {      
      ...BookDetails    
    }  
  }  
  ${BOOK_DETAILS}
`