import React, { useContext, useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { AuthContext } from '../App'
import { Link } from 'react-router-dom'
const cookies = new Cookies()
const Post = ({ post }) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [edited, setEdited] = useState('')
  const [editModal, setEditModal] = useState(false)
  const [details, setDetails] = useState({
    _id: '',
    body: '',
    author: '',
    authorName: '',
    authorImage: '',
    likes: [],
    comments: [],
  })
  function checkModal(e) {
    if (e.target.className === 'modal-wrap') {
      setEditModal(false)
      setDeleteModal(false)
    }
  }
  const { state } = useContext(AuthContext)
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
      setDetails(res.data.post)
    })
  }
  useEffect(() => {
    setDetails(post)
  }, [post])
  return (
    <div className="post" id={'p' + details._id}>
      <div className="post-upper">
        <Link to={'/profile/' + details.author} className="post-author-details">
          <img className="post-profile-pic" src={details.authorImage} />
          <h2>{details.authorName}</h2>
        </Link>
        {state.user._id === details.author ? (
          <div className="post-options">
            <p>9:39 PM</p>
            <button
              onClick={(e) => {
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
        <div className="post-comments">
          <i className="fa fa-comments"></i>
          <span className="comments-span">{details.comments.length}</span>{' '}
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
                let postId =
                  e.target.parentElement.parentElement.parentElement
                    .parentElement.id
                postId = postId.slice(1, postId.length)
                axios({
                  data: { id: postId },
                  method: 'DELETE',
                  url: '/delete_post',
                  headers: { authorization: `Bearer ${cookies.get('jwt')}` },
                }).then((res) => {
                  console.log(res)
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
              onClick={() => {
                setEditModal(false)
              }}
            >
              Cancel
            </button>
            <button className="create-post-btn">Update Post</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
