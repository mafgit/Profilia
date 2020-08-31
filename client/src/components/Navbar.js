import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
	return (
		<div className="navbar">
			<div>
				<h1 className="profilia-logo">Profilia</h1>
			</div>
			<nav>
				<ul>
					<li>
						<Link to="#">
							<i className="fa fa-home"></i>
						</Link>
					</li>
					<li>
						<Link to="#">
							<i className="fa fa-cog"></i>
						</Link>
					</li>
					<Link to="/profile">
						<img
							className="navbar-pic"
							src="https://images.unsplash.com/photo-1598405151786-c7a7824b81cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1402&q=80"
						/>
					</Link>
				</ul>
			</nav>
		</div>
	)
}

export default Navbar
