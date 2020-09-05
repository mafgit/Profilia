import React, { useState, useContext, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { AuthContext } from '../App'
const Signup = () => {
	const history = useHistory()
	const cookies = new Cookies()
	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [password2, setPassword2] = useState('')
	const [country, setCountry] = useState('')

	const { state, dispatch } = useContext(AuthContext)
	useEffect(() => {
		if (state.authenticated) {
			history.push('/home')
		}
	}, [state])
	return (
		<div className="signup">
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
				<h2>Signup after reading these terms.</h2>
				<h4>- We won't upload any of your data unless you choose to.</h4>
				<h4> - Of course you can delete any of your data that you want.</h4>
				<h4> - If there's a problem, contact us at blahblah@blah.com</h4>
				<h4>
					- If you don't follow the community guidelines, it might result in a
					permanent ban.
				</h4>
			</div>
			<form
				className="signup-form"
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
									})
										.then((res) => {
											console.log(res.data)
											const cookies = new Cookies()
											if (res.data.token) {
												cookies.set('jwt', res.data.token, {
													path: '/',
													maxAge: 60 * 60 * 24 * 3,
												})
												dispatch({
													type: 'LOGIN',
													payload: res.data.user.email,
												})
												history.push('/home')
											}
										})
										.catch((err) => {
											console.log(err)
										})
								} else {
									console.log('Please enter a valid email')
								}
							} else {
								console.log('Both passwords must match')
							}
						} else {
							console.log('Password must at least contain 6 characters')
						}
					} else {
						console.log('Please enter all the fields')
					}
				}}
			>
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
					<input onChange={(e) => setCountry(e.target.value)} type="text" />
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
