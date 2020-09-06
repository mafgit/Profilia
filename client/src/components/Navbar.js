import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import PostForm from './PostForm'
import { AuthContext } from '../App'

const Navbar = () => {
	const [modal, setModal] = useState(false)
	const [search, setSearch] = useState('')
	const history = useHistory()
	const { state } = useContext(AuthContext)
	const toSearchPage = () => {
		if (search.trim().length) {
			history.push({ pathname: '/search', state: { search } })
		}
	}
	return (
		<div className="navbar">
			<div>
				<h1 className="profilia-logo">Profilia</h1>
			</div>
			<nav>
				<ul>
					<div className="navbar-search">
						<input
							type="text"
							onKeyUp={(e) => {
								if (e.which === 13) return toSearchPage()
							}}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<button
							className="search-btn fa fa-search"
							onClick={toSearchPage}
						></button>
					</div>
					<Link to="#" onClick={() => setModal(true)}>
						<i className="fa fa-plus"></i>
					</Link>
					<Link to="/">
						<i className="fa fa-home"></i>
					</Link>
					<Link to={'/profile/' + state.user._id}>
						<img className="navbar-pic" src={state.user.image} />
					</Link>
				</ul>
			</nav>
			<PostForm modal={modal} setModal={setModal} />
		</div>
	)
}

export default Navbar
