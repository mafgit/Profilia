import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import { Link } from 'react-router-dom'

const SearchResults = ({ history, location }) => {
	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(false)
	const [query, setQuery] = useState('')

	function toSearchPage() {
		if (query.trim().length) {
			history.push(`/search?q=${query.trim()}`)
		}
	}

	useEffect(() => {
		setLoading(true)
		console.log(location.search)
		axios(
			{
				url: '/search_users' + location.search,
				method: 'GET',
			},
			{ withCredentials: true }
		).then((res) => {
			setUsers(res.data.users)
			setLoading(false)
		})
	}, [location.search])
	return (
		<>
			<Navbar />
			<div className="search-search-div">
				<input
					className="search-search"
					placeholder="Type a name ..."
					onKeyUp={(e) => {
						if (e.key === 'Enter') return toSearchPage()
					}}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<button
					onClick={toSearchPage}
					className="search-btn1"
					style={{ backgroundColor: '#1c1c1c' }}
				>
					<i className="fa fa-search"></i>
				</button>
			</div>
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
								<h1>{user.fullName.slice(0, 10)}</h1>
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
