import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

const SearchResults = (props) => {
	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		setLoading(true)
		axios({
			url: '/search_users/' + props.match.params.query.replace(' ', '+'),
			headers: { authorization: `Bearer ${cookies.get('jwt')}` },
			method: 'GET',
		}).then((res) => {
			setUsers(res.data.users)
			setLoading(false)
		})
	}, [props.match.params.query])
	return (
		<>
			<Navbar />
			<div className="search-results">
				{users[0] ? (
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
				) : loading ? (
					<h2 className="loading-profile">Loading...</h2>
				) : (
					<h1 className="loading-profile">No Results</h1>
				)}
			</div>
		</>
	)
}

export default SearchResults
