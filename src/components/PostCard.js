
import React, { useContext } from 'react';
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import moment from 'moment'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'
import MyPopup from '../util/MyPopup'

function PostCard({ post: { body, createdAt, id, username, comments, likes } }) {

    const { user } = useContext(AuthContext);

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra >
                <LikeButton user={user} post={{ id, likes, likeCount: likes.length }} />
                <MyPopup content="Comment on post">
                    <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                        <Button color='blue' basic>
                            <Icon name='comments' />

                        </Button>
                        <Label basic color='blue' pointing='left'>
                            {comments.length}
                        </Label>
                    </Button>
                </MyPopup>
                {user && user.username === username && <DeleteButton postId={id} />}
            </Card.Content>
        </Card>
    )
}

export default PostCard;