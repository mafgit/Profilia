import React from 'react'
import { Link } from 'react-router-dom'

const Error404 = () => {
  return (
    <div className="error-404" style={{ flexDirection: 'column' }}>
      <h1>404, you're lost</h1>
      <Link
        to="/"
        style={{
          marginTop: 20,
          backgroundColor: '#1c1c1c',
          padding: 15,
          fontSize: 20,
        }}
      >
        Go to Home
      </Link>
    </div>
  )
}

export default Error404
