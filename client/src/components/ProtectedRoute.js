import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const ProtectedRoute = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				return JSON.parse(localStorage.getItem('authenticated')) === true ? (
					<Component {...props} />
				) : (
					<Redirect to={{ pathname: '/login' }} />
				)
			}}
		/>
	)
}

export default ProtectedRoute
