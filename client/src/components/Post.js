import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { AuthContext } from '../AuthContext'
import { Link } from 'react-router-dom'
import Comments from './Comments'
import { toast } from 'react-toastify'
import moment from 'moment'

const Post = ({ post }) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [edited, setEdited] = useState('')
  const [editModal, setEditModal] = useState(false)
  const [comments, setComments] = useState(false)
  const [details, setDetails] = useState({})
  const { state } = useContext(AuthContext)

  const containerVariants = {
    closed: { opacity: 0, pointerEvents: 'none' },
    opened: { opacity: 1, pointerEvents: 'all', display: 'flex' },
  }
  const childVariants = {
    closed: { y: '-50vh' },
    opened: { y: 0 },
  }

  function checkModal(e) {
    if (e.target.className === 'modal-wrap') {
      setEditModal(false)
      setDeleteModal(false)
    }
  }

  const handleLike = (e) => {
    let btn = e.target
    const postId = btn.parentElement.parentElement.id
    let type = ''
    if (btn.classList.contains('liked')) {
      btn.classList.remove('liked')
      type = 'unlike'
    } else {
      btn.classList.add('liked')
      type = 'like'
    }
    axios(
      {
        method: 'POST',
        url: '/change_post_like',
        data: {
          postId: postId.slice(1, postId.length),
          type,
        },
      },
      { withCredentials: true }
    ).then((res) => {
      setDetails(res.data.post)
    })
  }
  useEffect(() => {
    setDetails(post)
  }, [post])
  return details._id ? (
    <div className="post" id={'p' + details._id}>
      <div className="post-upper">
        <Link
          to={'/profile/' + details.author._id}
          className="post-author-details"
        >
          <img className="post-profile-pic" alt="" src={details.author.image} />
          <h2>{details.author.fullName.split(' ')[0].slice(0, 9)}</h2>
        </Link>
        <div className="post-options">
          {details.createdAt && (
            <h4 className="post-created-at">
              <span>{moment(details.createdAt).format('hh:mma')}</span>
              <span>{moment(details.createdAt).format('DD/MM/YY')}</span>
            </h4>
          )}
          {state.user._id === details.author._id ? (
            <div>
              <button
                onClick={() => {
                  setEditModal(true)
                }}
              >
                <i className="fa fa-edit"></i>
              </button>
              <button
                onClick={(e) => {
                  setDeleteModal(true)
                }}
              >
                <i className="fa fa-trash"></i>
              </button>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <p className="body">{details.body}</p>
      <div className="post-likes-comments">
        <div
          className={
            details.likes.includes(state.user.email)
              ? 'post-like liked'
              : 'post-like'
          }
          onClick={(e) => handleLike(e)}
        >
          <i className="fa fa-heart"></i>
          <span className="likes-span">{details.likes.length}</span> Likes
        </div>
        <div className="post-comments" onClick={() => setComments(!comments)}>
          <i className="fa fa-comments"></i>
          Comments
        </div>
      </div>
      <motion.div
        className="modal-wrap"
        variants={containerVariants}
        initial={{ display: 'none' }}
        animate={deleteModal || editModal ? 'opened' : 'closed'}
        onClick={(e) => checkModal(e)}
      >
        <motion.div
          variants={childVariants}
          animate={deleteModal ? 'opened' : 'closed'}
          className="delete-modal"
          style={deleteModal ? { display: 'flex' } : { display: 'none' }}
        >
          <h3>Do you really wanna delete this post?</h3>
          <div>
            <button
              style={{ backgroundColor: '#0084ff' }}
              onClick={() => {
                setDeleteModal(false)
              }}
            >
              No
            </button>
            <button
              style={{ backgroundColor: '#ff3c3c' }}
              onClick={(e) => {
                axios(
                  {
                    data: { id: details._id },
                    method: 'DELETE',
                    url: '/delete_post',
                  },
                  { withCredentials: true }
                ).then(() => {
                  setDetails({})
                  toast.success('Post Deleted')
                  setDeleteModal(false)
                })
              }}
            >
              Yes
            </button>
          </div>
        </motion.div>
        <motion.div
          variants={childVariants}
          animate={editModal ? 'opened' : 'closed'}
          className="postform form"
          style={editModal ? { display: 'flex' } : { display: 'none' }}
        >
          <textarea
            onChange={(e) => setEdited(e.target.value)}
            defaultValue={details.body}
          ></textarea>
          <div className="btns">
            <button
              className="red-btn"
              onClick={() => {
                setEditModal(false)
              }}
            >
              &times;
            </button>
            <button
              className="create-post-btn green-btn"
              onClick={(e) => {
                if (edited && edited !== details.body) {
                  axios(
                    {
                      data: { postId: details._id, body: edited },
                      method: 'PATCH',
                      url: '/update_post',
                    },
                    { withCredentials: true }
                  ).then((res) => {
                    toast.success('Post updated')
                    setDetails(res.data.post)
                    setEditModal(false)
                  })
                }
              }}
            >
              <i className="fa fa-save"></i>
            </button>
          </div>
        </motion.div>
      </motion.div>
      <div
        className="comments"
        style={comments ? { display: 'flex' } : { display: 'none' }}
      >
        <Comments postId={details._id} />
      </div>
    </div>
  ) : (
    ''
  )
}

export default Post
