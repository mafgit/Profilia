import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'

const Following = () => {
	const cookies = new Cookies()
	const [loading, setLoading] = useState(true)
	const [following, setFollowing] = useState([
		{
			_id: null,
			fullName: '',
			country: '',
			image: '',
		},
	])
	const unfollow = (parent) => {
		let id = parent.id.replace('following-', '')
		axios({
			method: 'POST',
			url: '/unfollow',
			data: {
				id,
			},
			headers: { authorization: `Bearer ${cookies.get('jwt')}` },
		}).then((res) => {
			console.log(res.data)
		})
	}
	useEffect(() => {
		setLoading(true)
		axios({
			url: '/get_following',
			headers: { authorization: `Bearer ${cookies.get('jwt')}` },
			method: 'GET',
		}).then((res) => {
			setFollowing(res.data.following)
			setLoading(false)
		})
	}, [])

	return (
		<div className="followers">
			{!loading && following[0]._id ? (
				following.map((following) => (
					<div className="follower" id={'following-' + following._id}>
						<Link to={'/profile/' + following._id} key={following._id}>
							<img src={following.image} />
							<div className="follower-details">
								<h1>{following.fullName}</h1>
								<h3>{following.country}</h3>
							</div>
						</Link>
						<button
							className="unfollow-btn"
							onClick={(e) => unfollow(e.target.parentElement)}
						>
							&times;
						</button>
					</div>
				))
			) : loading && !following[0]._id ? (
				<h3 className="loading-h3">You are not following anyone.</h3>
			) : (
				<h3 className="loading-h3">Loading...</h3>
			)}
		</div>
	)
}

export default Following
