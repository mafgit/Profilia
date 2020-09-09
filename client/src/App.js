import React, { createContext, useReducer, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  withRouter,
  Switch,
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
import EditProfile from './components/EditProfile'

const cookies = new Cookies()

export const AuthContext = createContext()
const initState = {
  authenticated: false,
  user: {},
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
        user: {},
      }
    default:
      return state
  }
}

function App(props) {
  const [state, dispatch] = useReducer(AuthReducer, initState)
  useEffect(() => {
    if (cookies.get('jwt')) {
      axios({
        url: '/check_auth',
        method: 'GET',
        headers: { authorization: `Bearer ${cookies.get('jwt')}` },
      }).then((res) => {
        if (!res.data.user) {
          dispatch({ type: 'LOGOUT', payload: {} })
        } else {
          dispatch({ type: 'LOGIN', payload: res.data.user })
        }
      })
    } else {
      dispatch({ type: 'LOGOUT', payload: {} })
    }
  }, [])
  return (
    <Router>
      <AuthContext.Provider value={{ state, dispatch }}>
        <Switch>
          <ProtectedRoute
            exact
            path="/search/:query"
            component={SearchResults}
          />
          <ProtectedRoute exact path="/profile/:id" component={Profile} />
          <ProtectedRoute exact path="/editprofile" component={EditProfile} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
        </Switch>
      </AuthContext.Provider>
    </Router>
  )
}

export default withRouter(App)
