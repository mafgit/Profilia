import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
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
			<form className="signup-form">
				<div>
					<label>Name</label>
					<input type="text" />
				</div>
				<div>
					<label>Email</label>
					<input type="text" />
				</div>
				<div>
					<label>Country</label>
					<input type="text" />
				</div>
				<div>
					<label>Password</label>
					<input type="password" />
				</div>
				<div>
					<label>Confirm Password</label>
					<input type="password" />
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
