import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../AuthContext'
import Posts from './Posts'
import Navbar from './Navbar'
import axios from 'axios'
import { toast } from 'react-toastify'
import Followers from './Followers.js'
import Following from './Following.js'
import { motion } from 'framer-motion'

const Profile = ({ match, history }) => {
  const { state } = useContext(AuthContext)
  const [profileInfo, setProfileInfo] = useState({})
  const [flag, setFlag] = useState('')
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('Posts')
  useEffect(() => {
    setLoading(true)
    setTab('Posts')
    axios(
      {
        method: 'POST',
        url: '/get_profile',
        data: { id: match.params.id },
      },
      { withCredentials: true }
    ).then((res) => {
      if (!res.data.error) {
        setLoading(false)
        const { user } = res.data
        const {
          _id,
          bio,
          fullName,
          country,
          followers,
          following,
          image,
          email,
        } = user

        axios
          .get(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`)
          .then((res) => {
            setFlag(res.data[0].flag)
          })
        setProfileInfo({
          _id,
          bio,
          fullName,
          country,
          followers,
          following,
          image,
          email,
        })
      } else {
        history.push('/404')
      }
    })
  }, [match.params.id])
  const changeFollow = (type) => {
    axios(
      {
        method: 'GET',
        url: `/change_follow/${type}/${profileInfo._id}`,
      },
      { withCredentials: true }
    ).then((res) => {
      if (res.data.followers) {
        toast.success(type === 'follow' ? 'Followed' : 'Unfollowed', {
          className: 'custom-toast',
        })
        setProfileInfo({
          ...profileInfo,
          followers: res.data.followers,
        })
      }
    })
  }
  const changeTab = (clickedTab) => {
    document.querySelector('.active').classList.remove('active')
    clickedTab.className = 'active'
    setTab(clickedTab.innerText)
  }

  return (
    <>
      <Navbar />
      {profileInfo._id && !loading ? (
        <div
          className="profile"
          animate={{
            transition: {
              delayChildren: 0.5,
              staggerDirection: -1,
            },
          }}
        >
          <div className="top-section">
            <motion.img
              initial={{ x: '-50vw' }}
              animate={{ x: '0' }}
              className="profile-pic"
              src={profileInfo.image}
            />

            <div className="top-details">
              <motion.h1
                initial={{ x: '-50vw' }}
                animate={{ x: '0' }}
                className="fullName"
              >
                {profileInfo.fullName}
              </motion.h1>
              <motion.h3
                initial={{ x: '-50vw' }}
                animate={{ x: '0' }}
                className="country-div"
              >
                {flag ? <img className="flag" src={flag} /> : ''}
                {profileInfo.country}
              </motion.h3>
              <motion.q initial={{ x: '-50vw' }} animate={{ x: '0' }}>
                {profileInfo.bio}
              </motion.q>
              <motion.div
                className="top-follow-details"
                initial={{ x: '-50vw' }}
                animate={{ x: '0' }}
              >
                <div className="top-followers">
                  <i className="fa fa-users"></i>
                  <span> {profileInfo.followers.length} </span> Followers
                </div>
                <motion.div className="top-following">
                  <i className="fa fa-user"></i>
                  <span> {profileInfo.following.length} </span> Following
                </motion.div>
                {profileInfo._id !== state.user._id &&
                !profileInfo.followers.includes(state.user._id) ? (
                  <motion.button
                    initial={{ x: '-50vw' }}
                    animate={{ x: '0' }}
                    className="follow-profile-btn"
                    onClick={() => changeFollow('follow')}
                  >
                    <i className="fa fa-heart"></i> Follow
                  </motion.button>
                ) : (
                  ''
                )}
                {profileInfo._id !== state.user._id &&
                profileInfo.followers.includes(state.user._id) ? (
                  <motion.button
                    initial={{ x: '-50vw' }}
                    animate={{ x: '0' }}
                    className="unfollow-profile-btn"
                    onClick={() => changeFollow('unfollow')}
                  >
                    <i className="fa fa-heart"></i> Following
                  </motion.button>
                ) : (
                  ''
                )}
                {state.user._id === profileInfo._id ? (
                  <motion.button
                    initial={{ x: '-50vw' }}
                    animate={{ x: '0' }}
                    onClick={() => history.push('/editprofile')}
                    className="edit-profile-btn"
                  >
                    <i className="fa fa-edit"></i> Edit Profile
                  </motion.button>
                ) : (
                  ''
                )}
              </motion.div>
            </div>
          </div>
          <ul className="profile-nav">
            <li onClick={(e) => changeTab(e.target)} className="active">
              Posts
            </li>
            <li onClick={(e) => changeTab(e.target)}>Followers</li>
            <li onClick={(e) => changeTab(e.target)}>Following</li>
          </ul>
          {tab === 'Posts' ? (
            <Posts user={profileInfo._id} />
          ) : tab === 'Followers' ? (
            <Followers profileId={profileInfo._id} />
          ) : tab === 'Following' ? (
            <Following
              profileId={profileInfo._id}
              profileInfo={profileInfo}
              setProfileInfo={setProfileInfo}
              myId={state.user._id}
            />
          ) : (
            <Posts user={profileInfo._id} />
          )}
        </div>
      ) : (
        <h2 className="loading-profile"></h2>
      )}
    </>
  )
}

export default Profile
