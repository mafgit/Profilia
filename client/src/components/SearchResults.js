import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import { motion } from 'framer-motion'

const SearchResults = ({ history, location }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  function toSearchPage() {
    if (query.trim().length) {
      history.push(`/search?q=${query.trim()}`)
    }
  }

  useEffect(() => {
    setLoading(true)
    console.log(location.search)
    axios(
      {
        url: '/search_users' + location.search,
        method: 'GET',
      },
      { withCredentials: true }
    ).then((res) => {
      setUsers(res.data.users)
      setLoading(false)
    })
  }, [location.search])
  return (
    <>
      <Navbar />
      <motion.div
        className="search-search-div"
        animate={{ y: '0' }}
        initial={{ y: '-50vh' }}
      >
        <input
          className="search-search"
          placeholder="Type a name ..."
          onKeyUp={(e) => {
            if (e.key === 'Enter') return toSearchPage()
          }}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={toSearchPage}
          className="search-btn1"
          style={{ backgroundColor: '#1c1c1c' }}
        >
          <i className="fa fa-search"></i>
        </button>
      </motion.div>
      <div className="search-results">
        {users[0] ? (
          users.map((user) => (
            <motion.div
              animate={{ x: '0' }}
              initial={{ x: '-50vw' }}
              onClick={() => history.push('/profile/' + user._id)}
              key={user._id}
              id={'u' + user._id}
              className="search-result"
            >
              <img src={user.image} />
              <div className="result-details">
                <h1>{user.fullName.slice(0, 10)}</h1>
                <h2>Lives in {user.country}</h2>
              </div>
            </motion.div>
          ))
        ) : loading ? (
          <h2 className="loading-profile"></h2>
        ) : (
          <div className="no-data-msg-div">
            <h3 className="no-data-msg">No Results</h3>
          </div>
        )}
      </div>
    </>
  )
}

export default SearchResults
