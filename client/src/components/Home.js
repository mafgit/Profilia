import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios'

import Post from './Post'

const Home = () => {
  const [posts, setPosts] = useState([{}])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    axios(
      {
        url: '/get_home',
        method: 'GET',
      },
      { withCredentials: true }
    ).then((res) => {
      setPosts(res.data.posts)
      setLoading(false)
    })
  }, [])
  return (
    <>
      <Navbar />
      <div className="home">
        {!loading && posts[0] ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : !loading && !posts[0] ? (
          <>
            <h1 className="welcome">Welcome :)</h1>
            <h2 className="welcome">
              Follow people to see what they are posting.
            </h2>
          </>
        ) : (
          <i className="loading-i"></i>
        )}
      </div>
    </>
  )
}

export default Home
