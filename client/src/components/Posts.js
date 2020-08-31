import React, { useState, useEffect } from 'react'
import Post from './Post'
import axios from 'axios'
import Cookies from 'universal-cookie'

const Posts = () => {
	const cookies = new Cookies()
	const [posts, setPosts] = useState([
		{
			id: null,
			body: '',
			author: '',
			likes: [],
			comments: [],
		},
	])
	useEffect(() => {
		axios({
			url: '/get_posts',
			method: 'GET',
			headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
		}).then((res) => {
			console.log(res)
			setPosts(res.data.posts)
		})
	}, [])
	return (
		<div>
			{posts.map((post) => (
				<Post key={post.id} post={post} />
			))}
		</div>
	)
}

export default Posts
