import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import Post from './Post'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let mounted = true

    if (mounted) {
      setLoading(true)
      axios(
        {
          url: '/get_home',
          method: 'GET',
        },
        { withCredentials: true }
      ).then((res) => {
        setPosts(res.data.posts || [])
        setLoading(false)
      })
    }

    return () => (mounted = false)
  }, [])
  return (
    <>
      <Navbar />
      <div className="home">
        {loading ? (
          <i className="loading-i"></i>
        ) : posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          posts.length === 0 && (
            <>
              <br />
              <h1 className="welcome">Welcome :)</h1>
              <h2 className="welcome">
                Follow people to see what they are posting.
              </h2>
            </>
          )
        )}
      </div>
    </>
  )
}

export default Home
