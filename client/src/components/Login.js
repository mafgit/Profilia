import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { AuthContext } from '../AuthContext'
import { AlertContext } from '../App'

const Login = (props) => {
  const { state, dispatch } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { alertDispatch } = useContext(AlertContext)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (password && email) {
      axios({
        url: '/login',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        data: { email, password },
      })
        .then((res) => {
          const cookies = new Cookies()
          if (res.data.token) {
            cookies.set('jwt', res.data.token, {
              path: '/',
              maxAge: 60 * 60 * 24 * 3,
            })
            dispatch({ type: 'LOGIN', payload: res.data.user })
            props.history.push('/')
            alertDispatch({
              type: 'success',
              payload: 'Logged in as ' + state.user.email,
            })
          } else {
            alertDispatch({ type: 'error', payload: 'Invalid Credentials' })
          }
        })
        .catch((err) => console.log(err))
    } else {
      alertDispatch({ type: 'error', payload: 'Please fill all the fields' })
    }
  }
  return (
    <div className="login">
      {state.user._id ? <Redirect to={{ pathname: '/' }} /> : ''}
      <h1>Profilia | Login</h1>
      <form className="login-form form" onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="btn-div">
          <button>Login</button>
        </div>
        <div className="btn-div">
          <Link to="/signup">Don't have an account?</Link>
        </div>
      </form>
    </div>
  )
}

export default Login
