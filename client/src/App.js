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
import Error404 from './components/Error404'
import EditProfile from './components/EditProfile'

import './App.css'
import axios from 'axios'
import Cookies from 'universal-cookie'

import { AuthReducer, initState, AuthContext } from './AuthContext'
import Alert from './components/Alert'

const alertInitState = []
export const AlertContext = createContext()
const alertReducer = (state, action) => {
  return [...state, { type: action.type, payload: action.payload }]
}

function App(props) {
  const cookies = new Cookies()
  const [alertState, alertDispatch] = useReducer(alertReducer, alertInitState)
  const [state, dispatch] = useReducer(AuthReducer, initState)
  useEffect(() => {
    if (cookies.get('jwt')) {
      axios({
        url: '/check_auth',
        method: 'GET',
        headers: { authorization: `Bearer ${cookies.get('jwt')}` },
      }).then((res) => {
        if (res.data.error) {
          dispatch({ type: 'LOGOUT', payload: {} })
          console.log('yeah')
          cookies.remove('jwt')
          props.history.push('/login')
        } else {
          alertDispatch({
            type: 'success',
            payload: 'Logged in as ' + res.data.user.email,
          })
          dispatch({ type: 'LOGIN', payload: res.data.user })
        }
      })
    } else {
      dispatch({ type: 'LOGOUT', payload: {} })
      props.history.push('/login')
    }
  }, [])
  return (
    <>
      <Router>
        <AuthContext.Provider value={{ state, dispatch }}>
          <AlertContext.Provider value={{ alertState, alertDispatch }}>
            <Alert alerts={alertState} />
            <Switch>
              <ProtectedRoute
                exact
                path="/search/:query"
                component={SearchResults}
              />
              <ProtectedRoute exact path="/search" component={SearchResults} />
              <ProtectedRoute exact path="/profile/:id" component={Profile} />
              <ProtectedRoute
                exact
                path="/editprofile"
                component={EditProfile}
              />
              <ProtectedRoute exact path="/" component={Home} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/login" component={Login} />
              <ProtectedRoute path="*" component={Error404} />
            </Switch>
          </AlertContext.Provider>
        </AuthContext.Provider>
      </Router>
    </>
  )
}

export default withRouter(App)
