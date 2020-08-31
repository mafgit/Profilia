import React, { useState, useContext, useEffect } from 'react'
import { authContext } from '../App.js'
import Posts from './Posts'
import Navbar from './Navbar'
import axios from 'axios'
import Cookies from 'universal-cookie'
const Profile = () => {
	const cookies = new Cookies()
	const { state, dispatch } = useContext(authContext)
	const [profileInfo, setProfileInfo] = useState({
		id: null,
		firstName: '',
		lastName: '',
		country: '',
		bio: '',
		image: '',
		followers: [],
		following: [],
	})
	useEffect(() => {
		axios({
			method: 'GET',
			url: '/profile',
			headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
		}).then((res) => {
			const { user } = res.data
			const {
				bio,
				firstName,
				lastName,
				country,
				followers,
				following,
				image,
				email,
			} = user
			setProfileInfo({
				bio,
				firstName,
				lastName,
				country,
				followers,
				following,
				image,
				email,
			})
		})
	}, [])
	return (
		<div className="profile">
			<Navbar />
			<div className="top-section">
				<img
					className="profile-pic"
					src="https://images.unsplash.com/photo-1598405151786-c7a7824b81cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1402&q=80"
				/>

				<div className="top-details">
					<h1>
						{profileInfo.firstName} {profileInfo.lastName}
					</h1>
					<h3>Lives in {profileInfo.country}</h3>
					<q>{profileInfo.bio}</q>
					<div className="top-follow-details">
						<div className="top-followers">
							<i className="fa fa-users"></i>
							<span> {profileInfo.followers.length} </span> Followers
						</div>
						<div className="top-following">
							<i className="fa fa-user"></i>
							<span> {profileInfo.following.length} </span> Following
						</div>
						<button className="follow-profile-btn">
							<i className="fa fa-heart"></i> Follow
						</button>
						<button className="unfollow-profile-btn">
							<i className="fa fa-heart"></i> Following
						</button>
						<button className="edit-profile-btn">
							<i className="fa fa-edit"></i> Edit Profile
						</button>
					</div>
				</div>
			</div>
			<ul className="profile-nav">
				<li className="active">Posts</li>
				<li>Followers</li>
				<li>Following</li>
			</ul>
			<Posts />
		</div>
	)
}

export default Profile
