import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'

const Followers = ({ profileId }) => {
  const [loading, setLoading] = useState(true)
  const cookies = new Cookies()
  const [followers, setFollowers] = useState([])
  useEffect(() => {
    let mounted = true
    setLoading(true)
    axios({
      url: `/get_follow/followers/${profileId}`,
      headers: { authorization: `Bearer ${cookies.get('jwt')}` },
      method: 'GET',
    }).then((res) => {
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
            <h1>{follower.fullName}</h1>
            <h3>{follower.country}</h3>
          </div>
        </Link>
      ))}
    </div>
  ) : !loading && !followers[0] ? (
    <h3 className="loading-h3">No followers</h3>
  ) : (
    <h3 className="loading-h3">Loading...</h3>
  )
}

export default Followers
