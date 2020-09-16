import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie'
const cookies = new Cookies()
const ProtectedRoute = ({ component: Component, ...rest }) => {
  return cookies.get('jwt', { doNotParse: true }) ? (
    <Route {...rest} component={Component} />
  ) : (
    <Redirect to={{ pathname: '/login' }} />
  )
}

export default ProtectedRoute
