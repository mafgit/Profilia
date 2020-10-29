import React, { useState, useEffect } from 'react'
import Post from './Post'
import axios from 'axios'

const Posts = ({ user }) => {
  const [loading, setLoading] = useState(true)

  const [posts, setPosts] = useState([{}])
  useEffect(() => {
    let mounted = true
    axios(
      {
        url: '/get_posts',
        method: 'POST',
        data: {
          id: user,
        },
      },
      { withCredentials: true }
    ).then((res) => {
      if (mounted) {
        setPosts(res.data.posts)
        setLoading(false)
      }
    })
    return () => (mounted = false)
  }, [user])
  return (
    <div className="profile-posts">
      {!loading && posts[0] ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : !loading && !posts[0] ? (
        <div className="no-data-msg-div">
          <h3 className="no-data-msg">No Posts</h3>
        </div>
      ) : (
        <h3 className="loading-h3"></h3>
      )}
    </div>
  )
}

export default Posts
