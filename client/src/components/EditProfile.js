import React, { useState, useEffect, useContext } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import { AuthContext } from '../App'
import Cookies from 'universal-cookie'

const EditProfile = () => {
	const cookies = new Cookies()
	const { state, dispatch } = useContext(AuthContext)
	const [profileInfo, setProfileInfo] = useState({})
	const [loading, setLoading] = useState(true)
	const [tab, setTab] = useState('Details')

	const [fullName, setFullName] = useState('')
	const [oldPassword, setOldPassword] = useState('')
	const [password, setPassword] = useState('')
	const [password2, setPassword2] = useState('')
	const [bio, setBio] = useState('')
	const [country, setCountry] = useState('')

	const changeTab = (clickedTab) => {
		document.querySelector('.active').classList.remove('active')
		clickedTab.className = 'active'
		setTab(clickedTab.innerText)
	}
	useEffect(() => {
		axios({
			method: 'POST',
			url: `/get_profile`,
			data: {
				id: state.user._id,
			},
			headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
		}).then((res) => {
			setProfileInfo(res.data.user)
			setLoading(false)
		})
	}, [state])
	return (
		<>
			<Navbar />
			{!loading && profileInfo ? (
				<div className="edit-profile">
					<ul className="profile-nav edit-nav">
						<li onClick={(e) => changeTab(e.target)} className="active">
							Details
						</li>
						<li onClick={(e) => changeTab(e.target)}>Security</li>
					</ul>
					<form>
						{tab === 'Details' ? (
							<>
								<label>Fullname</label>
								<input
									type="text"
									value={profileInfo.fullName}
									onChange={(e) => setFullName(e.target.value)}
								/>
								<label>Bio</label>
								<textarea onChange={(e) => setCountry(e.target.value)}>
									{profileInfo.bio}
								</textarea>
								<label>Country</label>
								<input
									type="text"
									value={profileInfo.country}
									onChange={(e) => setCountry(e.target.value)}
								/>
							</>
						) : (
							<>
								<label>Old Password</label>
								<input
									type="password"
									value={oldPassword}
									onChange={(e) => setOldPassword(e.target.value)}
								/>
								<label>New Password</label>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<label>Confirm New Password</label>
								<input
									type="password"
									value={password2}
									onChange={(e) => setPassword2(e.target.value)}
								/>
							</>
						)}
						<div className="btns">
							<button className="discard-btn">Discard Changes</button>
							<button className="save-btn">Save Changes</button>
						</div>
					</form>
				</div>
			) : (
				<h3 className="loading-profile">Loading...</h3>
			)}
		</>
	)
}

export default EditProfile
