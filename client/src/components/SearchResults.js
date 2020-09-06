import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

const SearchResults = ({ history }) => {
	const [users, setUsers] = useState([])
	// const openProfile = (id) => {
	// 	const userId = id.slice(1, id.length)
	// 	console.log(userId)
	// 	history.push({ pathname: '/profile/' + userId })
	// }
	useEffect(() => {
		axios({
			url: '/search_users',
			data: {
				search: history.location.state.search,
			},
			headers: { authorization: `Bearer ${cookies.get('jwt')}` },
			method: 'POST',
		}).then((res) => {
			setUsers(res.data.users)
		})
	}, [history.location.state.search])
	return (
		<>
			<Navbar />
			<div className="search-results">
				{users ? (
					users.map((user) => (
						<Link
							key={user._id}
							id={'u' + user._id}
							to={'/profile/' + user._id}
							className="search-result"
						>
							<img src={user.image} />
							<div className="result-details">
								<h1>{user.fullName}</h1>
								<h2>Lives in {user.country}</h2>
							</div>
						</Link>
					))
				) : (
					<h1>No Results</h1>
				)}
			</div>
		</>
	)
}

export default SearchResults
