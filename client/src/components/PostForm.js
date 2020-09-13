import React, { useState, useContext } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { AlertContext } from '../App'

const PostForm = ({ modal, setModal }) => {
  const cookies = new Cookies()
  const { alertDispatch } = useContext(AlertContext)
  const [body, setBody] = useState('')
  function checkModal(e) {
    if (e.target.className === 'modal-wrap') {
      setModal(false)
    }
  }
  return (
    <>
      <div
        className="modal-wrap"
        style={modal ? { display: 'flex' } : { display: 'none' }}
        onClick={(e) => checkModal(e)}
      >
        <form
          className="postform form"
          onSubmit={(e) => {
            e.preventDefault()
            if (body) {
              axios({
                url: '/create_post',
                method: 'POST',
                data: { body },
                headers: {
                  authorization: `Bearer ${cookies.get('jwt')}`,
                },
              }).then((res) => {
                alertDispatch({
                  type: 'success',
                  payload: 'Post Created',
                })
                setModal(false)
                setBody('')
              })
            } else {
              alertDispatch({
                type: 'error',
                payload: "Post can't be empty",
              })
            }
          }}
        >
          <h3 style={{ fontSize: 23, textAlign: 'center', marginBottom: 20 }}>
            Write something ...
          </h3>
          <textarea onChange={(e) => setBody(e.target.value)}></textarea>
          <div className="btns">
            <button
              type="button"
              className="red-btn"
              onClick={(e) => {
                setModal(false)
              }}
            >
              &times;
            </button>
            {/* <label className="image-label" htmlFor="add-image-btn">
						<i className="fa fa-image"></i>
					</label> */}
            {/* <input type="file" id="add-image-btn" /> */}
            <button className="create-post-btn green-btn">+</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default PostForm
