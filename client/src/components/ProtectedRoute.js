import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import cookies from 'js-cookie'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return cookies.get('jwt') ? (
    <Route {...rest} component={Component} />
  ) : (
    <Redirect to={{ pathname: '/login' }} />
  )
}

export default ProtectedRoute
