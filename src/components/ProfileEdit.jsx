import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db, storage } from "../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "../pages/css/ProfileEdit.css";

const ProfileEdit = () => {
  const { currentUser } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState(currentUser.displayName || "");
  const [username, setUsername] = useState(currentUser.username || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [photo, setPhoto] = useState(null);

  const handleProfileUpdate = async () => {
    try {
      // Update text fields
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        displayName: displayName,
        username: username,
        bio: bio
      });
  
      // Upload new profile picture if a file is selected
      if (photo) {
        const storageRef = ref(storage, `${currentUser.uid}/${photo.name}`);
        await uploadBytesResumable(storageRef, photo);
        const downloadURL = await getDownloadURL(storageRef);
  
        await updateDoc(userDocRef, { photoURL: downloadURL });
      }
  
      console.log("Profile updated successfully!");
      alert("Profile updated successfully!"); // Add an alert here
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <div className="profile-edit-container">
      <h1>Edit Profile</h1>
      <div className="profile-edit-form">
        <label>Display Name:</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Bio:</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
        <label>Upload New Profile Picture:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button onClick={handleProfileUpdate} className="profile-update-btn">Update Profile</button>
      </div>
    </div>
  );
};

export default ProfileEdit;
