import { useEffect, useState, useContext } from 'react'

import NotificationContext from '../../store/notification-context'
import CommentList from './comment-list'
import NewComment from './new-comment'
import classes from './comments.module.css'

function Comments(props) {
  const { eventId } = props

  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const notificationCtx = useContext(NotificationContext)

  useEffect(() => {
    if (showComments) {
      fetch('/api/comments/' + eventId)
        .then(response => response.json())
        .then(data => {
          setComments(data.comments)
        })
    }
  }, [showComments])

  function toggleCommentsHandler() {
    setShowComments(prevStatus => !prevStatus)
    if (showComments) {
    }
  }

  function addCommentHandler(commentData) {
    notificationCtx.showNotification({
      title: 'Sending Comments...',
      message: 'Your comment is being stored comment',
      status: 'pending'
    })

    fetch('/api/comments/' + eventId, {
      method: 'POST',
      body: JSON.stringify(commentData),
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        response.json().then(data => {
          console.log('ERROR:::', data)
          throw new Error(data.message || '!something went wrong')
        })
      })
      .then(data => {
        notificationCtx.showNotification({
          title: 'Success!',
          message: 'Successgully comment stored',
          status: 'success'
        })
      })
      .catch(error => {
        notificationCtx.showNotification({
          title: 'Error!',
          message: error.message,
          status: 'error'
        })
      })
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>{showComments ? 'Hide' : 'Show'} Comments</button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && <CommentList items={comments} />}
    </section>
  )
}

export default Comments
