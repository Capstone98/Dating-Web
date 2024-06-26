// ChatPage.jsx
import React from 'react';
import '../pages/css/ChatPage.css';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';

const ChatPage = () => {
  return (
    <div className='home'>
      <div className="container">
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  );
};

export default ChatPage;
