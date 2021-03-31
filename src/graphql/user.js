import { gql } from '8base-react-sdk';


//Query
export const GET_USER = gql`
  query GetUsers {
    usersList {
      items {
        email
        id
      }
    }
  }
`; 