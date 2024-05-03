import React, { useContext } from 'react';
import { AdminStateContext, AdminActionsContext, AdminFunctionsContext } from '../context/AdminContext';
import "../pages/css/Admin.css";

const AdminRender = () => {
  const { users, error, editingUser, updatedName, updatedUsername, updatedBio, selectedFile } = useContext(AdminStateContext);
  const { setEditingUser, setUpdatedName, setUpdatedUsername, setUpdatedBio, setSelectedFile } = useContext(AdminActionsContext);
  const { deleteUser, handleUpdate, deleteImage, uploadProfilePicture, handleProfilePictureUpload, handleUploadImage } = useContext(AdminFunctionsContext);

  return (
    <div className='admin-container'>
      <>
        <h2 className='admin-header'>Admin Panel</h2>
        {error && <div>Error: {error}</div>}
        <table className='admin-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Bio</th>
              <th>Username</th>
              <th>Profile Picture</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="admin-row">
                <td className="admin-displayName">
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      value={updatedName || user.displayName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                      className="admin-input"
                    />
                  ) : (
                    user.displayName
                  )}
                </td>
                <td className="admin-email">{user.email}</td>
                <td className="admin-bio">
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      value={updatedBio || user.bio}
                      onChange={(e) => setUpdatedBio(e.target.value)}
                      className="admin-input"
                    />
                  ) : (
                    user.bio
                  )}
                </td>
                <td className="admin-username">
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      value={updatedUsername || user.username}
                      onChange={(e) => setUpdatedUsername(e.target.value)}
                      className="admin-input"
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td className="admin-photoURL">
                  {user.photoURL && <img src={user.photoURL} alt="Profile" style={{ width: '50px', height: '50px' }} />}
                  <label htmlFor={`profile-upload-${user.id}`} className="admin-profile-upload-label">Change Profile Picture</label>
                  <input id={`profile-upload-${user.id}`} type="file" onChange={handleProfilePictureUpload} style={{ display: 'none' }} />
                  <button onClick={() => uploadProfilePicture(user.id)} className="admin-button">Upload</button>
                </td>
                <td className="admin-images">
                  {user.images && user.images.map((image, index) => (
                    <div key={index} className="admin-image">
                      <a href={image} target="_blank" rel="noopener noreferrer" className="admin-image-link">{`Image ${index + 1}`}</a>
                      {editingUser === user.id && (
                        <button onClick={() => deleteImage(user.id, image)} className="admin-button">Del</button>
                      )}
                    </div>
                  ))}
                  <input type="file" onChange={(event) => handleUploadImage(user.id, event)} className="admin-input" />
                  <button onClick={() => uploadImage(user.id)} className="admin-button">Up Img</button> {/* Upload image button */}
                </td>
                <td className="admin-actions">
                  {editingUser === user.id ? (
                    <button onClick={() => handleUpdate(user.id)} className="admin-button">Save</button>
                  ) : (
                    <button onClick={() => setEditingUser(user.id)} className="admin-button">Update</button>
                  )}
                  <button onClick={() => deleteUser(user.id)} className="admin-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    </div>
  );
};

export default AdminRender;
