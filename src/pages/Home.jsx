import React from 'react'
import "./css/Home.css"
import { Link } from 'react-router-dom'

export const Home = () => {
  return (
    <div className='body-home'>
      <div className="hand">
        <div className="box">
          <div>
            <div className="text">
              <h2>Find Your</h2>
              <h1>LOML</h1>
              <h2>Now!</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="container-home">
        <button className="btn"><Link to='/find' className='home-link'>Find</Link></button>
      </div>
    </div>
  )
}
