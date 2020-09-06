import React, { useEffect } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import Cookies from 'universal-cookie'

const Home = () => {
	const cookies = new Cookies()
	useEffect(() => {
		axios({
			url: '/get_home',
			method: 'GET',
			headers: { authorization: `Bearer ${cookies.get('jwt')}` },
		}).then((res) => {
			console.log(res)
		})
	}, [])
	return (
		<div className="home">
			<Navbar />
		</div>
	)
}

export default Home
