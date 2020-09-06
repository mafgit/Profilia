import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import Cookies from 'universal-cookie'
import Post from './Post'

const Home = () => {
	const cookies = new Cookies()
	const [posts, setPosts] = useState([{}])
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		axios({
			url: '/get_home',
			method: 'GET',
			headers: { authorization: `Bearer ${cookies.get('jwt')}` },
		}).then((res) => {
			setPosts(res.data.posts)
			setLoading(false)
		})
	}, [])
	return (
		<>
			<Navbar />
			<div className="home">
				{!loading && posts[0] ? (
					posts.map((post) => <Post key={post._id} post={post} />)
				) : !loading && !posts[0] ? (
					<>
						<h1 className="welcome">Welcome :)</h1>
						<h2 className="welcome">
							Follow people to see what they are posting.
						</h2>
					</>
				) : (
					<h3 className="loading-profile">Loading...</h3>
				)}
			</div>
		</>
	)
}

export default Home
