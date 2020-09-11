import React, { useState, useEffect, useContext } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import { AuthContext } from '../App'
import Cookies from 'universal-cookie'

const EditProfile = (props) => {
  const cookies = new Cookies()
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
    const errors = []
    if (!fullName) {
      errors.push('Fullname must not be empty')
    }
    if (!country) {
      errors.push('Please select a country')
    }
    if (errors[0]) {
      // notify
      console.log(errors)
      return errors
    } else {
      axios({
        url: '/update_details',
        data: { fullName, bio, country },
        method: 'PATCH',
        headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
      }).then((res) => {
        console.log(res.data)
      })
    }
  }

  const updatePw = () => {
    const errors = []
    if (password2 !== password) {
      errors.push('Passwords must match')
    }
    if (
      oldPassword.length < 6 ||
      password2.length < 6 ||
      password2.length < 6
    ) {
      errors.push('Passwords must be at least 6 characters long')
    }
    if (!oldPassword || !password2 || !password2) {
      errors.push('You must fill all three fields')
    }
    if (errors[0]) {
      // notify
      console.log(errors)
      return errors
    } else {
      axios({
        url: 'update_pw',
        data: { oldPassword, password, password2 },
        method: 'PATCH',
        headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
      }).then((res) => {
        console.log(res.data)
      })
    }
  }
  useEffect(() => {
    axios({
      method: 'POST',
      url: `/get_profile`,
      data: {
        id: state.user._id,
      },
      headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
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
  const validate = (e) => {}
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
