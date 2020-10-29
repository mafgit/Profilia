import React, { useState, useEffect, useContext } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import { AuthContext } from '../AuthContext'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

const EditProfile = (props) => {
  const [countries, setCountries] = useState([])
  const { state } = useContext(AuthContext)
  const [profileInfo, setProfileInfo] = useState({})
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('Details')

  const [fullName, setFullName] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [bio, setBio] = useState('')
  const [country, setCountry] = useState('')

  const changeTab = (clickedTab) => {
    document.querySelector('.active').classList.remove('active')
    clickedTab.className = 'active'
    setTab(clickedTab.innerText)
  }

  const updateDetails = () => {
    if (!fullName) {
      return toast.warn('Fullname must not be empty', {
        className: 'custom-toast',
      })
    }
    if (!country) {
      return toast.warn('Please select a country', {
        className: 'custom-toast',
      })
    }
    axios(
      {
        url: '/update_details',
        data: { fullName, bio, country },
        method: 'PATCH',
      },
      { withCredentials: true }
    ).then(() =>
      toast.success('Details Updated', { className: 'custom-toast' })
    )
  }

  const updatePw = () => {
    if (password2 !== password) {
      return toast.warn('Passwords must match')
    }
    if (
      oldPassword.length < 6 ||
      password2.length < 6 ||
      password2.length < 6
    ) {
      return toast.warn('Passwords must be at least 6 characters long')
    }
    if (!oldPassword || !password2 || !password2) {
      return toast.warn('You must fill all three fields', {
        className: 'custom-toast',
      })
    }
    axios(
      {
        url: 'update_pw',
        data: { oldPassword, password, password2 },
        method: 'PATCH',
      },
      { withCredentials: true }
    ).then((res) => {
      if (res.data.error) {
        return toast.warn(res.data.error, { className: 'custom-toast' })
      }
      return toast.success('Password Updated', { className: 'custom-toast' })
    })
  }
  useEffect(() => {
    axios(
      {
        method: 'POST',
        url: `/get_profile`,
        data: {
          id: state.user._id,
        },
      },
      { withCredentials: true }
    ).then((res) => {
      if (res.data.user) {
        const { user } = res.data
        setProfileInfo(user)
        setFullName(user.fullName)
        setBio(user.bio)
        setCountry(user.country)
        setLoading(false)
      }
    })
  }, [state])

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then((res) => {
      setCountries(res.data.map((country) => country.name))
    })
  }, [])
  return (
    <>
      <Navbar />
      {!loading && profileInfo ? (
        <motion.div
          className="edit-profile"
          initial={{ x: '-50vw' }}
          animate={{ x: '0' }}
        >
          <ul className="profile-nav edit-nav">
            <li onClick={(e) => changeTab(e.target)} className="active">
              Details
            </li>
            <li onClick={(e) => changeTab(e.target)}>Security</li>
          </ul>
          <div className="form">
            <div
              style={
                tab === 'Security' ? { display: 'none' } : { display: 'flex' }
              }
            >
              <label>Fullname</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <label>Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {countries[0]
                  ? countries.map((c) => {
                      return (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      )
                    })
                  : ''}
              </select>

              <label>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>
            <div
              style={
                tab === 'Details' ? { display: 'none' } : { display: 'flex' }
              }
            >
              <label>Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Confirm New Password</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>

            <div className="btns">
              <button
                className="discard-btn"
                onClick={() => {
                  props.history.push(`/profile/${state.user._id}`)
                }}
              >
                &times;
              </button>
              {tab === 'Details' ? (
                <button
                  className="save-btn green-btn"
                  onClick={(e) => updateDetails(e)}
                >
                  <i className="fa fa-save"></i>
                </button>
              ) : (
                <button
                  className="save-btn green-btn"
                  onClick={(e) => updatePw(e)}
                >
                  <i className="fa fa-save"></i>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <h3 className="loading-profile"></h3>
      )}
    </>
  )
}

export default EditProfile
