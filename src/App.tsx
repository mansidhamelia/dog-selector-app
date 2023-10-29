import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './components/Login'
import DogList from './components/Dog/DogList';
import { AuthContextProvider } from './store/Auth-context'
import { DogSearchProvider } from './store/Dog-context';
// import Location from './components/GeoLocation/GeoLocationSearch'
import { NotificationProvider } from './store/Notification-context';
import Notification from './components/Base/Notification'

function App() {
  return (
    <Router>
      <NotificationProvider>
        <AuthContextProvider>
          <DogSearchProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/doglist" element={<DogList />} />
              {/* <Route path="/location" element={<Location />} /> */}
            </Routes>
            <Notification />
          </DogSearchProvider>
        </AuthContextProvider>
      </NotificationProvider>
    </Router >
  )
}

export default App
