import React from 'react'
import './Footer.css'
import facebook from "../img/facebook.png"
import gmail from "../img/gmail.jpg"
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <div>
    <footer>
        <div className="footer-content">
            <p>Follow us on social media:</p>
            <div className="social-icons">
              <img src={facebook} alt="icon" />
              <Link to="https://www.facebook.com/generose.salumag" className='social-icons-link'>Facebook</Link>
              <img src={gmail} alt="icons" />
              <Link to="mailto:capstonec90@gmail.com" className='social-icons-link'>gmail</Link>
            </div>
        </div>
    </footer>
    </div>
  )
}
