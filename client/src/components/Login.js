import React, { useState, useContext } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'

import { AuthContext } from '../AuthContext'
import { toast } from 'react-toastify'

const Login = () => {
  const { dispatch } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password && email) {
      axios({
        url: '/login',
        method: 'POST',
        data: { email, password },
      })
        .then((res) => {
          if (res.data.user) {
            dispatch({ type: 'LOGIN', payload: res.data.user })
            toast.success(`Logged in as ${res.data.user.email}`)
            history.push('/')
          } else {
            toast.warn(`Invalid Credentials`)
          }
        })
        .catch((err) => {
          toast.warn(`An error occurred`)
          console.log(err)
        })
    } else {
      toast.warn('Please fill all the fields')
    }
  }
  return (
    <div className="login">
      <h1>Profilia | Login</h1>
      <form className="login-form form" onSubmit={(e) => handleSubmit(e)}>
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
          <button type="submit">Login</button>
        </div>
        <div className="btn-div">
          <Link to="/signup">Don't have an account?</Link>
        </div>
      </form>
    </div>
  )
}

export default Login
