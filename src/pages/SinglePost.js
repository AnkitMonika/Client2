import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Card, Icon, Grid, Label, Form, Image, Button } from 'semantic-ui-react';
import moment from 'moment'
import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton';


function SignlePost(props) {
    const postId = props.match.params.postId;
    const { user } = useContext(AuthContext);
    const commentInputRef = useRef(null);

    const [comment, setComment] = useState('');

    const {
        data 
    } = useQuery(FETCH_POST, {
        variables: {
            postId
        }
    });

    const [submitComment] = useMutation(CREATE_COMMENT, {
        update() {
            setComment('');
            window.location.reload(false);
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    });

    function deletePostCallback() {
        props.history.push('/');
    }

    let postMarkup;
    if (!data) {
        postMarkup = <p>Loading post...</p>
    }
    else {
        console.log("after submit", data.post)
        const { id, body, createdAt, username, comments, likes } = data.post;
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            size="small"
                            float="right" />

                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likes, likeCount: likes.length }} />
                                <Button as="div"
                                    labelPosition="right"
                                    onClick={() => console.log("comment on post")}>
                                    <Button basic color="blue">
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {comments.length}
                                    </Label>
                                </Button>
                                {user && user.username === username && <DeleteButton postId={id} commentId={comment.id} callback={deletePostCallback} />}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comment.."
                                                name="comment"
                                                value={comment}
                                                onChange={event => setComment(event.target.value)} />
                                            <button type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ''}
                                                onClick={submitComment}
                                            >
                                                Submit
                                         </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
        //return <p>hello</p>
    }

    return postMarkup;
}

const FETCH_POST = gql`
    query($postId:ID!){
        post(id:$postId)
        {
            id body createdAt username 
            likes{
                username
            }
            comments{
                id
                body
                createdAt
                username
            }
        }
    }
`

const CREATE_COMMENT = gql`
    mutation creatComment($postId:String!,$body:String!){
        creatComment(postId:$postId,body:$body){
            id
            comments{
                id
                body
                createdAt
                username
            }
        }
    }
`

export default SignlePost;