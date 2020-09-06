import React, { useState, useEffect } from 'react'
import Post from './Post'
import axios from 'axios'
import Cookies from 'universal-cookie'

const Posts = ({ user }) => {
	const [loading, setLoading] = useState(true)
	const cookies = new Cookies()
	const [posts, setPosts] = useState([{}])
	useEffect(() => {
		axios({
			url: '/get_posts',
			method: 'POST',
			data: {
				email: user,
			},
			headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
		}).then((res) => {
			setPosts(res.data.posts)
			setLoading(false)
		})
	}, [user])
	return (
		<div className="profile-posts">
			{!loading && posts[0] ? (
				posts.map((post) => <Post key={post._id} post={post} />)
			) : !loading && !posts[0] ? (
				<h3 className="loading-h3">No posts</h3>
			) : (
				<h3 className="loading-h3">Loading...</h3>
			)}
		</div>
	)
}

export default Posts
