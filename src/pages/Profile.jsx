import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db, storage } from "../config/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import "../pages/css/Profile.css";

export const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            setUserData(userDocSnapshot.data());
            setUploadedImages(userDocSnapshot.data().images || []);
          } else {
            console.log("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    getUserData();
  }, [currentUser]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    try {
      const storageRef = ref(storage, `${currentUser.uid}/${file.name}`);
      await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, { images: arrayUnion(downloadURL) });
      
      setUploadedImages((prevImages) => [...prevImages, downloadURL]);
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDelete = async (imageUrl) => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, { images: arrayRemove(imageUrl) });

      setUploadedImages((prevImages) => prevImages.filter((url) => url !== imageUrl));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-info">
        <div className="profile-picture-container">
          <img src={userData?.photoURL || "default-profile-picture.jpg"} alt="Profile" className="profile-picture" />
        </div>
        <div className="profile-details">
          <h1 className="profile-name">{userData?.displayName}</h1>
          <p className="profile-username">Username: {userData?.username}</p>
          <p className="profile-bio">"{userData?.bio}"</p>
        </div>
      </div>
      <div className="profile-upload">
        <label htmlFor="file-input">
          <img src="img/addAvatar.png" alt="Choose File" className="choose-file-icon" />
        </label>
        <label>Upload Image</label>
        <input id="file-input" type="file" onChange={handleFileChange} className="profile-file" />
        <button onClick={handleUpload} className="profile-btn">Upload</button>
      </div>
      <div className="uploaded-images">
        {uploadedImages.map((imageUrl, index) => (
          <div key={index} className="uploaded-image-container">
            <img src={imageUrl} alt={`Uploaded ${index + 1}`} className="uploaded-image" />
            <button onClick={() => handleDelete(imageUrl)} className="delete-btn">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
