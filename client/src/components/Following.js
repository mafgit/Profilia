import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'

const Following = ({ profileId, profileInfo, setProfileInfo }) => {
	const cookies = new Cookies()
	const [loading, setLoading] = useState(true)
	const [following, setFollowing] = useState([])

	useEffect(() => {
		setLoading(true)
		axios({
			url: `/get_follow/following/${profileId}`,
			headers: { authorization: `Bearer ${cookies.get('jwt')}` },
			method: 'GET',
		}).then((res) => {
			setFollowing(res.data.result)
			setLoading(false)
		})
	}, [profileId])

	return (
		<div className="followers">
			{!loading && following[0] ? (
				following.map((following) => (
					<div
						className="follower"
						id={'u' + following._id}
						key={following._id}
					>
						<Link to={'/profile/' + following._id}>
							<img src={following.image} />
							<div className="follower-details">
								<h1>{following.fullName}</h1>
								<h3>{following.country}</h3>
							</div>
						</Link>
						<button
							className="unfollow-btn"
							onClick={() => {
								const unfollowId = following._id
								axios({
									method: 'GET',
									url: `/unfollow/${unfollowId}`,
									headers: { authorization: `Bearer ${cookies.get('jwt')}` },
								}).then((res) => {
									setFollowing(res.data.following)
									setProfileInfo({
										...profileInfo,
										following: res.data.following,
									})
								})
							}}
						>
							&times;
						</button>
					</div>
				))
			) : !loading && !following[0] ? (
				<h3 className="loading-h3">Not following anyone.</h3>
			) : (
				<h3 className="loading-h3">Loading...</h3>
			)}
		</div>
	)
}

export default Following
