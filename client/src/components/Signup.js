import React, { useState, useContext, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

import { AuthContext } from '../AuthContext'
import { toast } from 'react-toastify'
const Signup = (props) => {
	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
	const [countries, setCountries] = useState([])
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [password2, setPassword2] = useState('')
	const [country, setCountry] = useState('Afghanistan')

	const { state, dispatch } = useContext(AuthContext)

	useEffect(() => {
		axios.get('https://restcountries.eu/rest/v2/all').then((res) => {
			setCountries(res.data.map((country) => country.name))
		})
	}, [])
	return (
		<div className="signup">
			{state.user._id ? <Redirect to={{ pathname: '/' }} /> : ''}
			<div className="signup-intro">
				<h1
					className="profilia-logo"
					style={{
						fontSize: 80,
						textAlign: 'center',
					}}
				>
					Profilia
				</h1>
				<h2>Some words you might wanna read:</h2>
				<h4>
					- This is a simple social media, made just to practice my skills.
				</h4>
				<h4>
					{' '}
					- Follow people, see their posts, like them, comment on them, etc
				</h4>
				<h4>
					{' '}
					- I am currently learning image hosting etc, i'll see later about
					implementing the profile picture and upload images feature later.
				</h4>
			</div>
			<form
				className="signup-form form"
				onSubmit={(e) => {
					e.preventDefault()
					if (password && password2 && email && country && fullName) {
						if (password.length >= 6) {
							if (password === password2) {
								if (email.match(emailRegex)) {
									axios({
										url: '/signup',
										method: 'POST',
										data: {
											password,
											password2,
											email,
											country,
											fullName,
										},
										withCredentials: true,
									})
										.then((res) => {
											if (res.data.error) {
												toast.warn(res.data.error, {
													className: 'custom-toast',
												})
											}
											if (res.data.user._id) {
												dispatch({
													type: 'LOGIN',
													payload: res.data.user,
												})
												toast.success('Signed up and logged in', {
													className: 'custom-toast',
												})

												props.history.push('/')
											}
										})
										.catch((err) => {
											toast.warn('An Error Occurred', {
												className: 'custom-toast',
											})
											console.log(err)
										})
								} else {
									toast.warn('Please enter a valid email', {
										className: 'custom-toast',
									})
								}
							} else {
								toast.warn('Both passwords must match', {
									className: 'custom-toast',
								})
							}
						} else {
							toast.warn('Password must contain at least 6 characters', {
								className: 'custom-toast',
							})
						}
					} else {
						toast.warn('Please fill all the fields', {
							className: 'custom-toast',
						})
					}
				}}
			>
				<h1
					className="profilia-signup"
					style={{
						fontSize: 25,
						width: '100%',
						marginBottom: 10,
						textAlign: 'center',
					}}
				>
					PROFILIA | SIGNUP
				</h1>
				<div>
					<label>Fullname</label>
					<input onChange={(e) => setFullName(e.target.value)} type="text" />
				</div>
				<div>
					<label>Email</label>
					<input onChange={(e) => setEmail(e.target.value)} type="text" />
				</div>
				<div>
					<label>Country</label>
					{/* <input onChange={(e) => setCountry(e.target.value)} type="text" /> */}
					<select onChange={(e) => setCountry(e.target.value)}>
						{countries[0]
							? countries.map((c) => {
									return (
										<option key={c} value={c}>
											{c}
										</option>
									)
							  })
							: ''}
					</select>
				</div>
				<div>
					<label>Password</label>
					<input
						onChange={(e) => setPassword(e.target.value)}
						type="password"
					/>
				</div>
				<div>
					<label>Confirm Password</label>
					<input
						onChange={(e) => setPassword2(e.target.value)}
						type="password"
					/>
				</div>
				<div className="btn-div">
					<button>Signup</button>
				</div>
				<div className="btn-div">
					<Link to="/login">Already have an account?</Link>
				</div>
			</form>
		</div>
	)
}

export default Signup
