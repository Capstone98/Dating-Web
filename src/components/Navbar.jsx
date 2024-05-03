import React, { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { auth, db } from "../config/firebase";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            // Check if userData contains isAdmin field
            if (userData && userData.isAdmin !== undefined) {
              setIsAdmin(userData.isAdmin);
            } else {
              setIsAdmin(false); // Default to false if isAdmin field is not found
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAdmin(false); // Default to false if there's an error
        }
      } else {
        setIsAdmin(false); // Set isAdmin to false when user is not logged in
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <h1>@CLICKY</h1>
      <nav>
        <ul>
          <li>
            <NavLink to="/" className="nav-link" activeclassname="active">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="nav-link" activeclassname="active">
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/find" className="nav-link" activeclassname="active">
              Find
            </NavLink>
          </li>
          <li>
            <NavLink to="/chat" className="nav-link" activeclassname="active">
              Chat
            </NavLink>
          </li>
          <li className="dropdown" id="accountDropdown">
            Account <span className="arrow">&#9660;</span>
            <div className="dropdown-content" id="dropdownContent">
              {user ? (
                <>
                  <NavLink to="/profile" className="nav-link" activeclassname="active">
                    Profile
                  </NavLink>
                  <NavLink to="/profile-edit" className="nav-link" activeclassname="active">
                    Edit Profile
                  </NavLink>
                  <NavLink to="/change-pass" className="nav-link" activeclassname="active">
                    Change Password
                  </NavLink>
                  {isAdmin && ( // Check if user is admin
                    <NavLink to="/admin" className="nav-link" activeclassname="active">
                      Admin Panel
                    </NavLink>
                  )}
                  <NavLink to="/login" className="nav-link" onClick={logout}>
                    Sign Out
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="nav-link" activeclassname="active">
                    Log in
                  </NavLink>
                  <NavLink to="/signup" className="nav-link" activeclassname="active">
                    Sign up
                  </NavLink>
                </>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
