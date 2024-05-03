import React from 'react'
import "../pages/css/About.css"
import cris from "../img/cristian.jpg";
import gen from "../img/g.gif"
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div>
      <h1 className='h1-text'>All You Need To Know</h1>
      <div className='envelope-con'>
          <img src="img/polygon.png" alt="polygon" className='polygon' />
          <div className='about-text-con'>
            <p className='about-text'>Hi Dearest users, this website is built for the single San Carlosenos whom who wants to find their significant others. This website enables user to fibd and chat anyone they like</p>
            <br />
            <br />
          </div>
      </div>
      <div className='h3-dev'>
        <h3>Developers Portfolio</h3>
      <div className='dev-port'>
        <div className='dev-row'>
          <img src={cris} alt="photo" className='per-pic' />
          <Link to="https://www.facebook.com/cristianjay.benigay.3/"><p className='per-pic-p'>Cristian Jay Benigay</p></Link>
          <p>Programmer</p>
        </div>
        <div className='dev-row'>
          <img src="img/arbs.jpg" alt="photo" className='per-pic' />
          <p className='per-pic-p'>Arabela Barbon</p>
          <p>Analyst</p>
        </div>
        <div className='dev-row'>
          <img src={gen} alt="photo" className='per-pic' />
          <Link to="https://www.facebook.com/generose.salumag"><p className='per-pic-p'>Jennie Rose Salumag</p></Link>
          <p>Designer</p>
        </div>
          </div>
      </div>
    </div>
  )
}
