import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import cookies from 'js-cookie'

const Following = ({ profileId, profileInfo, setProfileInfo, myId }) => {
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState([])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    axios({
      url: `/get_follow/following/${profileId}`,
      headers: {
        authorization: `Bearer ${cookies.get('jwt')}`,
      },
      method: 'GET',
    }).then((res) => {
      if (mounted) {
        setFollowing(res.data.result)
        setLoading(false)
      }
    })
    return () => (mounted = false)
  }, [profileId])
  return !loading && following[0] ? (
    <div className="followers">
      {following.map((following) => (
        <div className="follower" id={'u' + following._id} key={following._id}>
          <Link to={'/profile/' + following._id}>
            <img src={following.image} />
            <div className="follower-details">
              <h1>
                {following.fullName.slice(0, 10)}
                {following.fullName.length > 10 ? '...' : ''}
              </h1>
              <h3>{following.country}</h3>
            </div>
          </Link>
          {myId === profileId ? (
            <button
              className="unfollow-btn"
              onClick={(e) => {
                e.target.parentElement.remove()
                const unfollowId = following._id
                axios({
                  method: 'GET',
                  url: `/unfollow/${unfollowId}`,
                  headers: {
                    authorization: `Bearer ${cookies.get('jwt')}`,
                  },
                }).then((res) => {
                  // ...
                })
              }}
            >
              &times;
            </button>
          ) : (
            ''
          )}
        </div>
      ))}
    </div>
  ) : !loading && !following[0] ? (
    <h3 className="loading-h3">Not following anyone.</h3>
  ) : (
    <h3 className="loading-h3">Loading...</h3>
  )
}

export default Following
