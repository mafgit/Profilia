import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import PostForm from './PostForm'

const Navbar = () => {
	const [modal, setModal] = useState(false)
	const [search, setSearch] = useState('')
	const history = useHistory()
	return (
		<div className="navbar">
			<div>
				<h1 className="profilia-logo">Profilia</h1>
			</div>
			<nav>
				<ul>
					<div className="navbar-search">
						<input type="text" onChange={(e) => setSearch(e.target.value)} />
						<button
							className="search-btn fa fa-search"
							onClick={() => {
								if (search) {
									history.push({ pathname: '/search', state: { search } })
								}
							}}
						></button>
					</div>
					<Link to="#" onClick={() => setModal(true)}>
						<i className="fa fa-plus"></i>
					</Link>
					<Link to="/home">
						<i className="fa fa-home"></i>
					</Link>
					<Link to="/profile">
						<img
							className="navbar-pic"
							src="https://images.unsplash.com/photo-1598405151786-c7a7824b81cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1402&q=80"
						/>
					</Link>
				</ul>
			</nav>
			<PostForm modal={modal} setModal={setModal} />
		</div>
	)
}

export default Navbar
