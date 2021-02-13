import React, { useReducer, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom'

import Home from './components/Home'
import Profile from './components/Profile'
import Login from './components/Login'
import Signup from './components/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import SearchResults from './components/SearchResults'
import Error404 from './components/Error404'
import EditProfile from './components/EditProfile'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import './App.css'

import axios from 'axios'

import { AuthReducer, initState, AuthContext } from './AuthContext'

function App() {
  const [state, dispatch] = useReducer(AuthReducer, initState)
  const history = useHistory()

  useEffect(() => {
    axios(
      {
        url: '/check_auth',
        method: 'GET',
      },
      { withCredentials: true }
    )
      .then((res) => {
        if (res.data.user)
          return dispatch({ type: 'LOGIN', payload: res.data.user })
      })
      .catch((err) => {
        if (err) {
          dispatch({ type: 'LOGOUT' })
          return history.push('/login')
        }
      })
  }, [])
  return (
    <>
      <Router>
        <AuthContext.Provider value={{ state, dispatch }}>
          <ToastContainer
            closeButton={false}
            position="top-center"
            hideProgressBar={true}
          />
          <Switch>
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <ProtectedRoute path="/profile/:id" component={Profile} />
            <ProtectedRoute exact path="/editprofile" component={EditProfile} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute path="/search" component={SearchResults} />
            <ProtectedRoute path="/*" component={Error404} />
          </Switch>
        </AuthContext.Provider>
      </Router>
    </>
  )
}

export default App
