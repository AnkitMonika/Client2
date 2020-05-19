import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { Button, Confirm, Icon } from 'semantic-ui-react'
import { FETCH_POSTS_QUERY } from '../util/graphql'

function DeleteButton({ postId, commentId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false)
    const mutation = commentId ? DELETE_COMMENT : DELETE_POST
    const [deletePostOrMutation] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false);
            if (!commentId) {
                const data = {
                    ...proxy.readQuery({
                        query: FETCH_POSTS_QUERY

                    })
                };
                data.posts = data.posts.filter(p => p.id !== postId);
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
            }
            if (callback) callback();
        },
        variables: {
            postId,
            commentId
        }
    })
    return (
        <>
            <Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
                <Icon name="trash" style={{ margin: 0 }} />
            </Button>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrMutation} />
        </>
    )
}
const DELETE_POST = gql`
    mutation deletePost($postId:ID!){
        deletePost(id:$postId)
    }

`

const DELETE_COMMENT = gql`
    mutation deleteComment($postId:ID!,$commentId:ID!){
        deleteComment(postId:$postId,commentId:$commentId){
            id,
            comments{
                id username createdAt body
            }            
        }
    }
`
export default DeleteButton;