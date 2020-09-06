import React, { useContext, useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { AuthContext } from '../App'
const cookies = new Cookies()
const Post = ({ post }) => {
	const [details, setDetails] = useState({
		_id: '',
		body: '',
		author: '',
		likes: [],
		comments: [],
	})
	const { state, dispatch } = useContext(AuthContext)
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
			// let oldBtn = document.querySelector(`#${postId} span`)
			// let oldLikes = parseInt(oldBtn.innerText)
			// oldBtn.innerText = res.data.likes.length
			setDetails(res.data.post)
		})
	}
	useEffect(() => {
		setDetails(post)
	}, [post])
	useEffect(() => {
		console.log(state)
	}, [state])
	return (
		<div className="post" id={'p' + details._id}>
			<div className="post-author-details">
				<img
					className="post-profile-pic"
					src="https://images.unsplash.com/photo-1598405151786-c7a7824b81cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1402&q=80"
				/>
				<h2>{details.authorName}</h2>
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
					<i className="fa fa-heart"></i>{' '}
					<span className="likes-span">{details.likes.length}</span> Likes
				</div>
				<div className="post-comments">
					<i className="fa fa-comments"></i>{' '}
					<span className="comments-span">{details.comments.length}</span>{' '}
					Comments
				</div>
			</div>
		</div>
	)
}

export default Post
