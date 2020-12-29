import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'

import { Link } from 'react-router-dom'

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([])
  const [body, setBody] = useState('')
  const { state } = useContext(AuthContext)

  useEffect(() => {
    axios(
      {
        url: '/load_comments',
        data: { postId },
        method: 'POST',
      },
      { withCredentials: true }
    ).then((res) => {
      setComments(res.data.comments)
    })
  }, [postId])
  return (
    <>
      <div className="comment-input-div">
        <textarea
          className="comment-input"
          placeholder="You can write a comment here"
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <button
          className="comment-btn"
          onClick={() => {
            if (body) {
              axios(
                {
                  method: 'POST',
                  url: '/add_comment',
                  data: {
                    postId,
                    body,
                    author: state.user._id,
                  },
                },
                { withCredentials: true }
              ).then((res) => {
                setComments([...comments, res.data.comment])
                setBody('')
                toast.success('Comment Added')
              })
            }
          }}
        >
          +
        </button>
      </div>
      {comments[0]
        ? comments.map((comment) => (
            <div className="comment" key={comment._id} id={comment._id}>
              <div className="comment-author-details">
                <Link
                  style={{ display: 'flex', alignItems: 'center' }}
                  to={'/profile/' + comment.author._id}
                >
                  <img src={comment.author.image} alt="" />
                  <h3>{comment.author.fullName}</h3>
                </Link>
                {comment.author._id === state.user._id ? (
                  <button
                    className="delete-comment-btn"
                    onClick={(e) => {
                      e.target.parentElement.parentElement.remove()
                      axios(
                        {
                          method: 'DELETE',
                          url: '/delete_comment',
                          data: {
                            commentId: comment._id,
                            authorId: comment.author._id,
                            postId,
                          },
                        },
                        { withCredentials: true }
                      ).then((res) => {
                        toast.success('Comment Deleted')
                      })
                    }}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                ) : (
                  ''
                )}
              </div>
              <div>
                <p>{comment.body}</p>
              </div>
            </div>
          ))
        : ''}
    </>
  )
}

export default Comments
