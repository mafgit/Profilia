import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../App.js'
import Posts from './Posts'
import Navbar from './Navbar'
import axios from 'axios'
import Cookies from 'universal-cookie'
import Followers from './Followers.js'
import Following from './Following.js'
const Profile = () => {
	const cookies = new Cookies()
	const { state, dispatch } = useContext(AuthContext)
	const [profileInfo, setProfileInfo] = useState({
		id: null,
		fullName: '',
		country: '',
		bio: '',
		image: '',
		followers: [],
		following: [],
	})
	const [tab, setTab] = useState('Posts')
	useEffect(() => {
		axios({
			method: 'GET',
			url: '/profile',
			headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
		}).then((res) => {
			const { user } = res.data
			const {
				bio,
				fullName,
				country,
				followers,
				following,
				image,
				email,
			} = user
			setProfileInfo({
				bio,
				fullName,
				country,
				followers,
				following,
				image,
				email,
			})
		})
	}, [])
	const changeTab = (clickedTab) => {
		document.querySelector('.active').classList.remove('active')
		clickedTab.className = 'active'
		setTab(clickedTab.innerText)
	}

	return (
		<>
			<Navbar />

			<div className="profile">
				<div className="top-section">
					<img className="profile-pic" src={profileInfo.image} />

					<div className="top-details">
						<h1>{profileInfo.fullName}</h1>
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
					<li onClick={(e) => changeTab(e.target)} className="active">
						Posts
					</li>
					<li onClick={(e) => changeTab(e.target)}>Followers</li>
					<li onClick={(e) => changeTab(e.target)}>Following</li>
				</ul>
				{tab === 'Posts' ? (
					<Posts />
				) : tab === 'Followers' ? (
					<Followers />
				) : tab === 'Following' ? (
					<Following />
				) : (
					<Posts />
				)}
			</div>
		</>
	)
}

export default Profile
