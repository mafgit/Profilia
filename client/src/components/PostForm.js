import React, { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'
const PostForm = ({ modal, setModal }) => {
  const [body, setBody] = useState('')

  const containerVariants = {
    closed: { opacity: 0, pointerEvents: 'none', display: 'none' },
    opened: { opacity: 1, pointerEvents: 'all', display: 'flex' },
  }

  const childVariants = {
    closed: { y: '-50vh' },
    opened: { y: 0 },
  }
  function checkModal(e) {
    if (e.target.className === 'modal-wrap') {
      setModal(false)
    }
  }
  return (
    <motion.div
      className="modal-wrap"
      variants={containerVariants}
      initial={{ display: 'none' }}
      animate={modal ? 'opened' : 'closed'}
      // style={modal ? { display: 'flex' } : { display: 'none' }}
      onClick={(e) => checkModal(e)}
    >
      <motion.form
        className="postform form"
        variants={childVariants}
        animate={modal ? 'opened' : 'closed'}
        onSubmit={(e) => {
          e.preventDefault()
          if (body) {
            axios(
              {
                url: '/create_post',
                method: 'POST',
                data: { body: body.trim() },
              },
              { withCredentials: true }
            ).then((res) => {
              toast.success('Post Created')
              setModal(false)
              setBody('')
            })
          } else {
            toast.warn(`Post can't be empty`)
          }
        }}
      >
        <h3 style={{ fontSize: 23, textAlign: 'center', marginBottom: 20 }}>
          Write something ...
        </h3>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
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
            </label>
            <input
              type="file"
              id="add-image-btn"
              onChange={(e) => {
                console.log(e.target.files)
              }}
            /> */}
          <button className="create-post-btn green-btn">+</button>
        </div>
      </motion.form>
    </motion.div>
  )
}

export default PostForm
