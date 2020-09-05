import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'

const Followers = () => {
	const [loading, setLoading] = useState(true)
	const cookies = new Cookies()
	const [followers, setFollowers] = useState([
		{
			_id: null,
			fullName: '',
			country: '',
			image: '',
		},
	])
	useEffect(() => {
		setLoading(true)
		axios({
			url: '/get_followers',
			headers: { authorization: `Bearer ${cookies.get('jwt')}` },
			method: 'GET',
		}).then((res) => {
			setFollowers(res.data.followers)
			setLoading(false)
		})
	}, [])
	return (
		<div className="followers">
			{!loading && followers[0]._id ? (
				followers.map((follower) => (
					<div className="follower">
						<Link to={'/profile/' + follower._id} key={follower._id}>
							<img src={follower.image} />
							<div className="follower-details">
								<h1>{follower.fullName}</h1>
								<h3>{follower.country}</h3>
							</div>
						</Link>
					</div>
				))
			) : loading && !followers[0]._id ? (
				<h3 className="loading-h3">You don't have any followers.</h3>
			) : (
				<h3 className="loading-h3">Loading...</h3>
			)}
		</div>
	)
}

export default Followers
