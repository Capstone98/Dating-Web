import React, { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { auth, db, storage } from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../pages/css/Add-Data.css";

const AdditionalData = () => {
  const [err, setErr] = useState(false);
  const [emailMismatchError, setEmailMismatchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in when the component mounts
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // User is not logged in, redirect to login page
        navigate("/login");
        return;
      }

      // Check if the user has already filled out the form
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // User has already filled out the form, redirect to home page
        navigate("/");
      }
    });

    return () => unsubscribe(); // Unsubscribe from the auth state listener when the component unmounts
  }, [navigate]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const username = e.target[1].value;
    const bio = e.target[2].value;
    const email = e.target[3].value;
    const file = e.target[4].files[0];

    // Check if the input email matches the current user's email
    if (email !== auth.currentUser.email) {
      setEmailMismatchError(true);
      setLoading(false);
      return;
    }

    try {
      // Assuming you have some other way of authenticating users and obtaining a user object
      const user = auth.currentUser;

      // Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            // Update profile
            await updateProfile(user, {
              displayName,
              photoURL: downloadURL,
            });
            // Create user on firestore
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              displayName,
              username, // Add username field
              email, // Add email field
              bio, // Add bio field
              photoURL: downloadURL,
            });

            // Create empty user chats on firestore
            await setDoc(doc(db, "userChats", user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="add-data-container">
      <h2 className="add-heading">User Profile Form</h2>
      <form onSubmit={handleSubmit}>
        <label className="add-label">Name:</label>
        <input required type="text" placeholder="Name" className="add-input" />
        <label className="add-label">Username:</label>
        <input required type="text" placeholder="Username..." className="add-input" />
        <label className="add-label">Bio:</label>
        <input required type="text" placeholder="Bio..." className="add-input" />
        <label className="add-label">Email:</label>
        <input required type="email" placeholder="Email..." className="add-input" />
        <label className="add-label">Profile Picture:</label>
        <input required style={{ display: "none" }} type="file" id="file" />
        <label className="add-label add-picture-label" htmlFor="file">
          <img src="img/addAvatar.png" alt="" />
          <span>Add a Picture</span>
        </label>
        <button className="add-button" disabled={loading}>
          Sign up
        </button>
        {loading && "Uploading and compressing the image please wait..."}
        {err && <span>Something went wrong</span>}
        {emailMismatchError && (
          <span>Email does not match your current email</span>
        )}
      </form>
    </div>
  );
};

export default AdditionalData;
