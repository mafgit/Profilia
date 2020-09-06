import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../App.js'
import Posts from './Posts'
import Navbar from './Navbar'
import axios from 'axios'
import Cookies from 'universal-cookie'
import Followers from './Followers.js'
import Following from './Following.js'
const Profile = ({ match }) => {
	const cookies = new Cookies()
	const { state, dispatch } = useContext(AuthContext)
	const [profileInfo, setProfileInfo] = useState({})
	const [tab, setTab] = useState('Posts')
	useEffect(() => {
		axios({
			method: 'POST',
			url: '/profile',
			data: { id: match.params.id },
			headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
		}).then((res) => {
			const { user } = res.data
			const {
				_id,
				bio,
				fullName,
				country,
				followers,
				following,
				image,
				email,
			} = user
			setProfileInfo({
				_id,
				bio,
				fullName,
				country,
				followers,
				following,
				image,
				email,
			})
		})
	}, [match.params.id])
	const changeFollow = (type) => {
		axios({
			method: 'GET',
			url: `/${type}/${profileInfo._id}`,
			headers: { authorization: `Bearer ${cookies.get('jwt')}` },
		}).then((res) => {
			console.log(res.data.followers)
			setProfileInfo({
				...profileInfo,
				followers: res.data.followers,
			})
		})
	}
	const changeTab = (clickedTab) => {
		document.querySelector('.active').classList.remove('active')
		clickedTab.className = 'active'
		setTab(clickedTab.innerText)
	}

	return (
		<>
			<Navbar />
			{profileInfo._id ? (
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
								{profileInfo._id !== state.user._id &&
								!profileInfo.followers.includes(state.user._id) ? (
									<button
										className="follow-profile-btn"
										onClick={() => changeFollow('follow')}
									>
										<i className="fa fa-heart"></i> Follow
									</button>
								) : (
									''
								)}
								{profileInfo._id !== state.user._id &&
								profileInfo.followers.includes(state.user._id) ? (
									<button
										className="unfollow-profile-btn"
										onClick={() => changeFollow('unfollow')}
									>
										<i className="fa fa-heart"></i> Following
									</button>
								) : (
									''
								)}
								{state.user._id === profileInfo._id ? (
									<button className="edit-profile-btn">
										<i className="fa fa-edit"></i> Edit Profile
									</button>
								) : (
									''
								)}
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
						<Posts user={profileInfo.email} />
					) : tab === 'Followers' ? (
						<Followers profileId={profileInfo._id} />
					) : tab === 'Following' ? (
						<Following
							profileId={profileInfo._id}
							profileInfo={profileInfo}
							setProfileInfo={setProfileInfo}
						/>
					) : (
						<Posts />
					)}
				</div>
			) : (
				<h3 className="loading-profile">Loading...</h3>
			)}
		</>
	)
}

export default Profile
