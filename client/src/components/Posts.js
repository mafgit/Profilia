import React, { useState, useEffect } from 'react'
import Post from './Post'
import axios from 'axios'
import Cookies from 'universal-cookie'

const Posts = () => {
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(true)
	const cookies = new Cookies()
	const [posts, setPosts] = useState([
		{
			// _id: null,
			// body: '',
			// author: '',
			// likes: [],
			// comments: [],
		},
	])
	useEffect(() => {
		setError('')
		axios({
			url: '/get_posts',
			method: 'GET',
			headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
		}).then((res) => {
			if (res.data.error === 'no posts') {
				setError('no posts')
			} else {
				setPosts(res.data.posts)
			}
			setLoading(false)
		})
	}, [])
	return (
		<div className="profile-posts">
			{!loading && !error ? (
				posts.map((post) => <Post key={post._id} post={post} />)
			) : !loading && error ? (
				<h3 className="loading-h3">You don't have any posts</h3>
			) : (
				<h3 className="loading-h3">Loading...</h3>
			)}
		</div>
	)
}

export default Posts
