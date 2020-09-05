import React, { useState, createContext, useReducer, useEffect } from 'react'
import {
	BrowserRouter as Router,
	Route,
	useHistory,
	withRouter,
} from 'react-router-dom'

import Home from './components/Home'
import Profile from './components/Profile'
import Login from './components/Login'
import Signup from './components/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import SearchResults from './components/SearchResults'

import './App.css'
import axios from 'axios'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export const AuthContext = createContext()
const initState = {
	authenticated: false,
	user: null,
}
const AuthReducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN':
			return {
				authenticated: true,
				user: action.payload,
			}
		case 'LOGOUT':
			return {
				authenticated: false,
				user: null,
			}
		default:
			return state
	}
}

function App(props) {
	const [state, dispatch] = useReducer(AuthReducer, initState)
	useEffect(() => {
		axios({
			url: '/check_auth',
			method: 'GET',
			headers: { authorization: `Bearer ${cookies.get('jwt')}` },
		}).then((res) => {
			if (res.data.userEmail) {
				dispatch({ type: 'LOGIN', payload: res.data.userEmail })
				props.history.push('/home')
			} else {
				dispatch({ type: 'LOGOUT', payload: null })
				props.history.push('/login')
			}
		})
	}, [])
	return (
		<Router>
			<AuthContext.Provider value={{ state, dispatch }}>
				<ProtectedRoute exact path="/home" component={Home} />
				<ProtectedRoute exact path="/profile" component={Profile} />
				<ProtectedRoute exact path="/search" component={SearchResults} />
				{/* <ProtectedRoute exact path="/profile/:id" component={Profile} /> */}
				<Route exact path="/signup" component={Signup} />
				<Route exact path="/login" component={Login} />
			</AuthContext.Provider>
		</Router>
	)
}

export default withRouter(App)
