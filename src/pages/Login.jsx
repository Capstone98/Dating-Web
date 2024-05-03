import React, { useState, useEffect } from 'react';
import './css/Login.css'
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged, getAuth } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';


export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e, setState) => {
    setState(e.target.value);
    setError(''); // Clear any previous error message when input changes
  };

  const handleInputBlur = (state, setState) => {
    if (state === '') {
      setState('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const signIn = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      // Check if the user is an admin
      const userDocRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDocRef);
      const userData = userSnapshot.data();
      if (userData && userData.isAdmin === true) {
        // Redirect to admin panel with isAdmin query parameter
        navigate('/admin?isAdmin=true');
      } else {
        // Redirect to home page for regular users
        navigate('/add-data');
      }
    } catch (err) {
      console.error(err.code, err.message);
      setError('Incorrect email or password.'); // Set error message for incorrect password
    }
  }
  


  return (
    <div className="login-wrapper">
      <div className="login-container">
        <img src="img/person.jpg" alt="icon" className="person-logo" />
        <form onSubmit={signIn}>
          <h2>Login</h2>
          <div className="input-container">
            <input
              type="text"
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}
              onBlur={() => handleInputBlur(email, setEmail)}
            />
            <label className={email ? 'active' : ''}>Email</label>
          </div>
          <div className="input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handleInputChange(e, setPassword)}
              onBlur={() => handleInputBlur(password, setPassword)}
            />
            <label className={password ? 'active' : ''}>Password</label>
            <span
              className={`password-toggle ${showPassword ? 'show' : ''}`}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>
          {error && <div className="error">{error}</div>} {/* Display error message */}
          <div className="button-container">
            <button className="button">Login</button>
          </div>
          <div className="forgot-password-container">
            <Link to='/change-pass'>Forgot Password?</Link>
          </div>
          <div className="register-container">
            <p>Don't have an account? <Link to="/signup">Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};
