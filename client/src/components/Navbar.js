import React, { useState, useContext, useEffect } from 'react'
import { Link, useHistory, withRouter } from 'react-router-dom'
import PostForm from './PostForm'
import { AuthContext } from '../AuthContext'
import cookies from 'js-cookie'
import { AlertContext } from '../App'

const Navbar = (props) => {
  const [modal, setModal] = useState(false)

  const [search, setSearch] = useState('')
  const [opened, setOpened] = useState(false)
  const [navbarModal, setNavbarModal] = useState(false)
  const history = useHistory()
  const { state, dispatch } = useContext(AuthContext)
  const { alertDispatch } = useContext(AlertContext)
  const toSearchPage = () => {
    if (search.trim().length) {
      history.push({ pathname: `/search/${search.trim().replace(/ /gi, '+')}` })
    }
  }
  return (
    <div className="navbar">
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
            className="navbar-modal"
            style={navbarModal ? { display: 'flex' } : { display: 'none' }}
          >
            <Link to={'/profile/' + state.user._id}>Profile</Link>
            <button
              onClick={() => {
                dispatch({ type: 'LOGOUT' })
                cookies.remove('jwt')
                props.history.push('/login')
                alertDispatch({ type: 'success', payload: 'Logged out' })
              }}
            >
              Logout
            </button>
          </div>
        </ul>
      </nav>
      <PostForm modal={modal} setModal={setModal} />
    </div>
  )
}

export default withRouter(Navbar)
