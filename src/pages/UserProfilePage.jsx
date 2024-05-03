import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; 
import { db } from "../config/firebase";
import { collection, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext"; 

const UserProfilePage = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const { currentUser } = useContext(AuthContext); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userDocRef = doc(usersCollection, userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserProfile(userData);
        } else {
          console.log("User profile not found");
          // Handle case where user does not exist
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Handle error
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleSelect = async () => {
    // Check if a conversation exists between the current user and the selected user
    const combinedId =
      currentUser.uid > userProfile.uid
        ? currentUser.uid + userProfile.uid
        : userProfile.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        // If no conversation exists, create one
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // Update user chats for current user
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: userProfile.uid,
            displayName: userProfile.displayName,
            photoURL: userProfile.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        // Update user chats for selected user
        await updateDoc(doc(db, "userChats", userProfile.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      
      // Redirect to the chat page using the navigate function
      navigate(`/chat/${combinedId}`);
    } catch (error) {
      console.error("Error creating or checking conversation:", error);
    }
  };

  if (!userProfile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-info">
        <div className="profile-picture-container">
          <img src={userProfile?.photoURL || "default-profile-picture.jpg"} alt="Profile" className="profile-picture" />
        </div>
        <div className="profile-details">
          <h1 className="profile-name">{userProfile?.displayName}</h1>
          <p className="profile-username">Username: {userProfile?.username}</p>
          <p className="profile-bio">"{userProfile?.bio}"</p>
          {/* Render other profile details */}
        <button onClick={handleSelect} className="user-btn">Chat Me</button>
        <button className="user-btn"><Link to="/find" className="link-user-btn">Return</Link></button>
        </div>
      </div>
      <div className="uploaded-images">
        {userProfile.images && userProfile.images.map((imageUrl, index) => (
          <div key={index} className="uploaded-image-container">
            <img src={imageUrl} alt={`Uploaded ${index + 1}`} className="uploaded-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfilePage;
