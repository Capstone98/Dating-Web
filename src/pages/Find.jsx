// Find.js

import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import UserProfileCard from "../components/UserProfileCard";
import "../pages/css/Find.css";


export const Find = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedUsers = querySnapshot.docs.map((doc) => doc.data());
        setUsers(fetchedUsers);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2 className="text-center-find">Find Your ChatMate</h2>
      <div className="container-find">
        <div className="row-find">
          {users.map((user) => (
            <div key={user.uid} className="find-card">
              <UserProfileCard user={user}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Find;
