import React from "react";
import "../pages/css/UserProfileCard.css";

const UserProfileCard = ({ user, currentUserUid }) => {
  const onViewProfile = (userId) => {
    window.location.href = `/view-profile/${userId}`;
  };

  return (
    <div className="card">
      {user.uid !== currentUserUid ? (
        <img src={user.photoURL} className="card-img-top" alt={user.displayName} />
      ) : (
        <div className="profile-picture-placeholder">No Profile Picture</div>
      )}
      <div className="card-body">
        <h5 className="card-title">{user.displayName}</h5>
        <p className="card-text">Username: {user.username}</p>
        <p className="card-text">Bio: {user.bio}</p>
        <button onClick={() => onViewProfile(user.uid)} className="card-button">View Profile</button>
      </div>
    </div>
  );
};

export default UserProfileCard;
