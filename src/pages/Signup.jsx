import React, { useState } from 'react';
import './css/Signup.css'; // Import the CSS file
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Link } from 'react-router-dom';


export const Signup = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Sign up Function
  const signUp = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
  
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setError('Please verify your email. Once verified, you can log in. refesh the page before clicking login button');
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Error signing up. Please try again.');
    }
  };


  return (
    <div className="container-signup">
        <img src="img/person.jpg" alt="person" className='person-logo-signup' />
        <h2 className="heading">Register</h2>
        <div className="form-group">
          <label className="label">Email:</label>
          <input className="input-signup" placeholder='Enter Email...' type="email" name="email" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Password:</label>
          <input className="input-signup" placeholder='Enter Password...' type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Confirm Password:</label>
          <input className="input-signup" placeholder='Enter Confirm Password...' type="password" name="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="button" type="submit" onClick={signUp}>Register</button>
        <button className="button"><Link to='/login' className='link-signup'>Log In</Link></button>
    </div>
  );
};

export default Signup;
