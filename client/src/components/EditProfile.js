import React, { useState, useEffect, useContext } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import { AuthContext } from '../AuthContext'
import cookies from 'js-cookie'
import { AlertContext } from '../App'

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

  const { alertDispatch } = useContext(AlertContext)

  const changeTab = (clickedTab) => {
    document.querySelector('.active').classList.remove('active')
    clickedTab.className = 'active'
    setTab(clickedTab.innerText)
  }

  const updateDetails = () => {
    if (!fullName) {
      return alertDispatch({
        type: 'error',
        payload: 'Fullname must not be empty',
      })
    }
    if (!country) {
      return alertDispatch({
        type: 'error',
        payload: 'Please select a country',
      })
    }
    axios({
      url: '/update_details',
      data: { fullName, bio, country },
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${cookies.get('jwt')}`,
      },
    }).then(() => {
      alertDispatch({ type: 'success', payload: 'Details Updated' })
    })
  }

  const updatePw = () => {
    if (password2 !== password) {
      return alertDispatch({ type: 'error', payload: 'Passwords must match' })
    }
    if (
      oldPassword.length < 6 ||
      password2.length < 6 ||
      password2.length < 6
    ) {
      return alertDispatch({
        type: 'error',
        payload: 'Passwords must be at least 6 characters long',
      })
    }
    if (!oldPassword || !password2 || !password2) {
      return alertDispatch({
        type: 'error',
        payload: 'You must fill all three fields',
      })
    }
    axios({
      url: 'update_pw',
      data: { oldPassword, password, password2 },
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${cookies.get('jwt')}`,
      },
    }).then((res) => {
      if (res.data.error) {
        return alertDispatch({ type: 'error', payload: res.data.error })
      }
      return alertDispatch({ type: 'success', payload: 'Password Updated' })
    })
  }
  useEffect(() => {
    axios({
      method: 'POST',
      url: `/get_profile`,
      data: {
        id: state.user._id,
      },
      headers: {
        authorization: `Bearer ${cookies.get('jwt')}`,
      },
    }).then((res) => {
      setProfileInfo(res.data.user)
      setLoading(false)
    })
  }, [state])
  useEffect(() => {
    if (profileInfo) {
      setFullName(profileInfo.fullName)
      setBio(profileInfo.bio)
      setCountry(profileInfo.country)
    }
  }, [profileInfo])
  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then((res) => {
      setCountries(res.data.map((country) => country.name))
    })
  }, [])
  return (
    <>
      <Navbar />
      {!loading && profileInfo ? (
        <div className="edit-profile">
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
                defaultValue={profileInfo.fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <label>Country</label>
              <select
                defaultValue={profileInfo.country}
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
                defaultValue={profileInfo.bio}
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
        </div>
      ) : (
        <h3 className="loading-profile">Loading...</h3>
      )}
    </>
  )
}

export default EditProfile
