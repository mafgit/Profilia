import React, { useEffect, useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../App'
import Cookies from 'universal-cookie'
const cookies = new Cookies()
const ProtectedRoute = ({ component: Component, ...rest }) => {
	const { state, dispatch } = useContext(AuthContext)
	return cookies.get('jwt') && state.authenticated === true ? (
		<Route {...rest} component={Component} />
	) : (
		<Redirect to={{ pathname: '/login' }} />
	)
}

export default ProtectedRoute
