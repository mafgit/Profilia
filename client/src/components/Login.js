import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { AuthContext } from '../App'
const Login = () => {
  const { state, dispatch } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()
  useEffect(() => {
    if (state.authenticated) {
      history.push('/')
    }
  }, [state])
  const handleSubmit = (e) => {
    e.preventDefault()
    // Some validation ............
    axios({
      url: 'http://localhost:5000/login',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify({ email, password }),
    })
      .then((res) => {
        const cookies = new Cookies()
        if (res.data.token) {
          cookies.set('jwt', res.data.token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 3,
          })
          dispatch({ type: 'LOGIN', payload: res.data.user })
          history.push('/')
        }
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className="login">
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
