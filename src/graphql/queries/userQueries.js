import { gql } from '@apollo/client'

export const CURRENT_USER_DETAILS = gql`
query getCurretnUserDetails {
  me {
    username
    id
    favoriteGenre
  }
}
`