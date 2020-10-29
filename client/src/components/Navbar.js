import React, { useState, useContext, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import PostForm from './PostForm'
import { AuthContext } from '../AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const Navbar = ({ history }) => {
  const [modal, setModal] = useState(false)

  const [search, setSearch] = useState('')
  const [navbarModal, setNavbarModal] = useState(false)
  const { state, dispatch } = useContext(AuthContext)

  const toSearchPage = () => {
    if (search.trim().length) {
      history.push(`/search?q=${search.trim()}`)
    }
  }

  return (
    <motion.div className="navbar" initial={{ y: '-80px' }} animate={{ y: 0 }}>
      <div>
        <h1 className="profilia-logo">Profilia</h1>
        <h1 className="profilia-logo mobile-logo">P</h1>
      </div>
      <nav>
        <ul>
          <div className="navbar-search">
            <input
              type="text"
              onKeyUp={(e) => {
                if (e.key === 'Enter') return toSearchPage()
              }}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              style={{ marginLeft: 0 }}
              className="search-btn1 fa fa-search ul-a"
              onClick={toSearchPage}
            ></button>
          </div>

          <Link className="search-btn2 ul-a" to="/search">
            <i className="fa fa-search"></i>
          </Link>
          <Link className="ul-a" to="#" onClick={() => setModal(true)}>
            <i className="fa fa-plus"></i>
          </Link>
          <Link className="ul-a" to="/">
            <i className="fa fa-home"></i>
          </Link>
          <button
            className="pic ul-a"
            onClick={() => setNavbarModal(!navbarModal)}
          >
            <img className="navbar-pic" src={state.user.image} />
          </button>

          <div
            onClick={() => {
              setNavbarModal(false)
            }}
            className="navbar-modal"
            style={navbarModal ? { display: 'flex' } : { display: 'none' }}
          >
            <Link to={'/profile/' + state.user._id}>Profile</Link>
            <Link to="/editprofile">Settings</Link>
            <button
              onClick={() => {
                axios.get('/logout').then(() => {
                  dispatch({ type: 'LOGOUT' })
                  history.push('/login')
                  toast.success('Logged out', { className: 'custom-toast' })
                })
              }}
            >
              Logout
            </button>
          </div>
        </ul>
      </nav>
      <PostForm modal={modal} setModal={setModal} />
    </motion.div>
  )
}

export default withRouter(Navbar)
