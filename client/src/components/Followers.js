import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Followers = ({ profileId }) => {
  const [loading, setLoading] = useState(true)

  const [followers, setFollowers] = useState([])
  useEffect(() => {
    let mounted = true
    setLoading(true)
    axios(
      {
        url: `/get_follow/followers/${profileId}`,
        method: 'GET',
      },
      { withCredentials: true }
    ).then((res) => {
      if (mounted) {
        setFollowers(res.data.result)
        setLoading(false)
      }
    })
    return () => (mounted = false)
  }, [profileId])

  return !loading && followers[0] ? (
    <div className="followers">
      {followers.map((follower) => (
        <Link
          to={'/profile/' + follower._id}
          className="follower"
          id={'u' + follower._id}
          key={follower._id}
        >
          <img src={follower.image} />
          <div className="follower-details">
            <h1>
              {follower.fullName.slice(0, 10)}
              {follower.fullName.length > 10 ? '...' : ''}
            </h1>
            <h3>{follower.country}</h3>
          </div>
        </Link>
      ))}
    </div>
  ) : !loading && !followers[0] ? (
    <div className="no-data-msg-div">
      <h3 className="no-data-msg">No followers</h3>
    </div>
  ) : (
    <h3 className="loading-h3"></h3>
  )
}

export default Followers
