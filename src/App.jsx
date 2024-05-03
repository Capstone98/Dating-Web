import { useState, useContext, useEffect } from 'react'
import './App.css'
import { Navbar } from './components/Navbar'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Profile } from './pages/Profile'
import { Find } from './pages/Find'
import { Footer } from './components/Footer'
import AdditionalData from './pages/AdditionalData'
import { AuthContext } from './context/AuthContext'
import ChatPage from './pages/ChatPage'
import ProfileEdit from './components/ProfileEdit'
import ResetPassword from './components/ChangePass'
import UserProfilePage from './pages/UserProfilePage'
import { Admin } from './pages/Admin'

function App() {
  const [count, setCount] = useState(0)

  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    useEffect(() => {
      if (!currentUser) {
        // If user is not logged in, display an alert after navigating to login page
        alert("Please log in first.");
      }
    }, [currentUser]);

    if (!currentUser) {
      // If user is not logged in, redirect to login page
      return <Navigate to="/login" />;
    }

    // If user is logged in, render the children (protected content)
    return children;
  };

  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />
          <Routes>
            <Route path="/" element={<Home /> } />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile">
              <Route index element={ <ProtectedRoute> <Profile /> </ProtectedRoute> } />
            </Route>
            <Route path="/find">
              <Route index element={ <ProtectedRoute> <Find /> </ProtectedRoute> } />
            </Route>
            <Route path="/add-data">
              <Route index element={ <ProtectedRoute> <AdditionalData /> </ProtectedRoute> } />
            </Route>
            
            <Route path="/profile-edit">
              <Route index element={ <ProtectedRoute> <ProfileEdit /> </ProtectedRoute> } />
            </Route>
            <Route path="/chat">
              <Route index element={ <ProtectedRoute> <ChatPage /> </ProtectedRoute> } />
            </Route>
            <Route path="/admin">
              <Route index element={ <ProtectedRoute> <Admin isAdmin={true} /> </ProtectedRoute> } />
            </Route>
            <Route path="/change-pass">
              <Route index element={ <ProtectedRoute> <ResetPassword /> </ProtectedRoute> } />
            </Route>
            <Route path="/chat/:chatId" element={<ProtectedRoute> <ChatPage /> </ProtectedRoute>} />
            <Route path="/view-profile/:userId" element={<ProtectedRoute> <UserProfilePage /> </ProtectedRoute>} />


          </Routes>
        <Footer />
        </BrowserRouter>
    </div>
  )
}

export default App;
