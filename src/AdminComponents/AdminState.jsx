import React, { useState, useEffect } from 'react';
import { AdminStateContext, AdminActionsContext, AdminFunctionsContext } from '../context/AdminContext';
import { db } from '../config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import AdminRender from './AdminRender';

const AdminState = ({ isAdmin }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedUsername, setUpdatedUsername] = useState('');
  const [updatedBio, setUpdatedBio] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdate = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        displayName: updatedName || users.find(user => user.id === userId).displayName,
        username: updatedUsername || users.find(user => user.id === userId).username,
        bio: updatedBio || users.find(user => user.id === userId).bio
      });
      setEditingUser(null);
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteImage = async (userId, imageUrl) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
  
      if (userData && Array.isArray(userData.images)) {
        const updatedImages = userData.images.filter(image => image !== imageUrl);
  
        await updateDoc(userRef, { images: updatedImages });
  
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } else {
        console.error('User data or images array is missing or not an array.');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  

  const uploadProfilePicture = async (userId) => {
    try {
      if (!selectedFile) return;
      
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);
      
      const downloadURL = await getDownloadURL(storageRef);
      
      await updateDoc(doc(db, 'users', userId), { photoURL: downloadURL });
      
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const handleProfilePictureUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadImage = async (userId, event) => {
    const file = event.target.files[0];
    await uploadImage(userId, file);
  };

  const uploadImage = async (userId, file) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
  
      const imagesArray = Array.isArray(userData.images) ? userData.images : [];
  
      const storage = getStorage();
      const storageRef = ref(storage, `images/${userId}/${file.name}`);
      await uploadBytes(storageRef, file);
  
      const imageUrl = await getDownloadURL(storageRef);
  
      await updateDoc(userRef, { images: [...imagesArray, imageUrl] });
  
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  return (
    <AdminStateContext.Provider value={{ users, error, editingUser, updatedName, updatedUsername, updatedBio, selectedFile }}>
      <AdminActionsContext.Provider value={{ setEditingUser, setUpdatedName, setUpdatedUsername, setUpdatedBio, setSelectedFile }}>
        <AdminFunctionsContext.Provider value={{ deleteUser, handleUpdate, deleteImage, uploadProfilePicture, handleProfilePictureUpload, handleUploadImage }}>
          {isAdmin && <AdminRender />}
        </AdminFunctionsContext.Provider>
      </AdminActionsContext.Provider>
    </AdminStateContext.Provider>
  );
};

export default AdminState;
