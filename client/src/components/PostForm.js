import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
const cookies = new Cookies()

const PostForm = ({ modal, setModal }) => {
	const [body, setBody] = useState('')
	function checkModal(e) {
		if (e.target.className === 'modal-wrap') {
			setModal(false)
		}
	}
	return (
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
							setModal(false)
							setBody('')
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
						className="red-btn"
						onClick={() => {
							setModal(false)
						}}
					>
						&times;
					</button>
					<label className="image-label" htmlFor="add-image-btn">
						<i className="fa fa-image"></i>
					</label>
					<input type="file" id="add-image-btn" />
					<button className="create-post-btn green-btn">+</button>
				</div>
			</form>
		</div>
	)
}

export default PostForm
