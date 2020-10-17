import React, { useState, useContext } from 'react'

import axios from 'axios'
import { toast } from 'react-toastify'
const PostForm = ({ modal, setModal }) => {
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
							axios(
								{
									url: '/create_post',
									method: 'POST',
									data: { body },
								},
								{ withCredentials: true }
							).then((res) => {
								toast.success('Post Created', { className: 'custom-toast' })
								setModal(false)
								setBody('')
							})
						} else {
							toast.warn(`Post can't be empty`, { className: 'custom-toast' })
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
				</form>
			</div>
		</>
	)
}

export default PostForm
