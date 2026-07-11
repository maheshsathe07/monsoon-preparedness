import { useState } from 'react'
import AuthScreen from './pages/AuthScreen'
import WelcomeScreen from './pages/WelcomeScreen'
import MainApp from './pages/MainApp'
import { clearStoredAuth, getStoredAuth } from './lib/api'
import './globals.css'

function App() {
  const [auth, setAuth] = useState(() => getStoredAuth())
  const [userProfile, setUserProfile] = useState(null)

  const handleAuthenticated = (authResponse) => {
    setAuth(authResponse)
  }

  const handleProfileCreate = (profile) => {
    setUserProfile(profile)
  }

  const handleLogout = () => {
    clearStoredAuth()
    setAuth(null)
    setUserProfile(null)
  }

  if (!auth) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />
  }

  if (!userProfile) {
    return <WelcomeScreen auth={auth} onProfileCreate={handleProfileCreate} onLogout={handleLogout} />
  }

  return <MainApp userProfile={userProfile} onLogout={handleLogout} />
}

export default App
