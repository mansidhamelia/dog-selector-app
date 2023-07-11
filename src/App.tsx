import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './components/Login'
import DogList from './components/Dog/DogList';
import { AuthContextProvider } from './store/Auth-context'
import { DogSearchProvider } from './store/Dog-context';
import DogDemo from './components/DogDemo';

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <DogSearchProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/doglist" element={<DogList />} />
            <Route path="/dogdemo" element={<DogDemo />} />

          </Routes>
        </DogSearchProvider>
      </AuthContextProvider>
    </Router >
  )
}

export default App
