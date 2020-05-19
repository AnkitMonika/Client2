
import gql from 'graphql-tag'

export const  FETCH_POSTS_QUERY = gql`
{
 posts{
     id body createdAt username 
     likes{
         username
     }
     comments{
         id username createdAt body
     }
 }
}
`