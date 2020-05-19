
import React,{useState} from 'react'
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { useForm } from '../util/hooks'
import {FETCH_POSTS_QUERY} from '../util/graphql'

function PostForm(props) {
    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    })
    const [errors, setErrors] = useState({});
    const [createPost] = useMutation(CREATE_POST, {
        variables: values,
        update(proxy, result) {
            const data={...proxy.readQuery({
                query:FETCH_POSTS_QUERY
                
            })};
            data.posts=[result.data.createPost,...data.posts];
            console.log(data.posts)
            proxy.writeQuery({query:FETCH_POSTS_QUERY,
                variables:{limit:5,offset:0},
                data})
           
            values.body = ''
        },
        onError(err) {
            console.log(err.graphQLErrors[0].extensions.errors)
            setErrors(err.graphQLErrors[0].extensions.errors);
        }

    })
    function createPostCallback() {
        createPost()
    }
    return (
        <Form onSubmit={onSubmit}>
            <h2>Create a post:</h2>
            <Form.Field>
                <Form.Input
                    placeholder="Hi World"
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={errors.body ? true : false}
                />
                <Button type="submit" color="teal">
                    Submit
               </Button>
            </Form.Field>
        </Form>
    )

}
const CREATE_POST = gql`
mutation createPost($body:String!){			
  		createPost(
            body:$body
            
        )
        {
            id
            body
            createdAt
            username
            likes{
                id
                username
                createdAt
            }
            comments{
                id
                body
                username
                createdAt
            }
       
        }
}
`
export default PostForm;