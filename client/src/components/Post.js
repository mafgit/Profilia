import React, { useContext, useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { AuthContext } from '../App'
import { Link } from 'react-router-dom'
import Comments from './Comments'
const cookies = new Cookies()
const Post = ({ post }) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [edited, setEdited] = useState('')
  const [editModal, setEditModal] = useState(false)
  const [comments, setComments] = useState(false)
  const [details, setDetails] = useState({})
  const { state } = useContext(AuthContext)

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
    axios({
      method: 'POST',
      url: '/change_post_like',
      data: {
        postId: postId.slice(1, postId.length),
        type,
      },
      headers: {
        authorization: `Bearer ${cookies.get('jwt')}`,
      },
    }).then((res) => {
      console.log(res.data.post)
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
          <img className="post-profile-pic" src={details.author.image} />
          <h2>{details.author.fullName}</h2>
        </Link>
        <div className="post-options">
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
      <p>{details.body}</p>
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
      <div
        className="modal-wrap"
        style={
          deleteModal || editModal ? { display: 'flex' } : { display: 'none' }
        }
        onClick={(e) => checkModal(e)}
      >
        <div
          className="delete-modal"
          style={deleteModal ? { display: 'flex' } : { display: 'none' }}
        >
          <h3>Do you really wanna delete this post?</h3>
          <div>
            <button
              style={{ backgroundColor: '#0084ff' }}
              onClick={() => {
                setDeleteModal(false)
                console.log('x')
              }}
            >
              No
            </button>
            <button
              style={{ backgroundColor: '#ff3c3c' }}
              onClick={(e) => {
                axios({
                  data: { id: details._id },
                  method: 'DELETE',
                  url: '/delete_post',
                  headers: { authorization: `Bearer ${cookies.get('jwt')}` },
                }).then((res) => {
                  setDetails({})
                  setDeleteModal(false)
                })
              }}
            >
              Yes
            </button>
          </div>
        </div>
        <div
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
                  axios({
                    data: { postId: details._id, body: edited },
                    method: 'PATCH',
                    url: '/update_post',
                    headers: { authorization: `Bearer ${cookies.get('jwt')}` },
                  }).then((res) => {
                    setDetails(res.data.post)
                    setEditModal(false)
                  })
                }
              }}
            >
              <i className="fa fa-save"></i>
            </button>
          </div>
        </div>
      </div>
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
