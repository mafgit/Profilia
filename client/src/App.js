import React, { useState, createContext, useReducer } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './components/Home'
import Profile from './components/Profile'
import Login from './components/Login'
import Signup from './components/Signup'

import './App.css'

export const authContext = createContext()
const initState = {
	authenticated: false,
	user: null,
}
const authReducer = (state, action) => {
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

function App() {
	const [state, dispatch] = useReducer(authReducer, initState)
	return (
		<Router>
			<authContext.Provider value={{ state, dispatch }}>
				<Route exact path="/" component={Home} />
				<Route exact path="/profile" component={Profile} />
				<Route exact path="/signup" component={Signup} />
				<Route exact path="/login" component={Login} />
			</authContext.Provider>
		</Router>
	)
}

export default App
