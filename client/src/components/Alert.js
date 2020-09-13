import React, { useEffect } from 'react'

const Alert = ({ alerts }) => {
  useEffect(() => {
    setTimeout(() => {
      document.querySelector('.alerts').innerHTML = ''
      clearTimeout()
    }, 4000)
  }, [alerts])
  return (
    <div className="alerts">
      {alerts
        ? alerts.map((alert, i) => (
            <div key={i} className={alert.type}>
              {alert.payload}
            </div>
          ))
        : ''}
    </div>
  )
}

export default Alert
