import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './components/Login'
import DogList from './components/Dog/DogList';
import { AuthContextProvider } from './store/Auth-context'
import { DogBreedsProvider } from './store/Dog-context';

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <DogBreedsProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/doglist" element={<DogList />} />
            {/* <Route path=":id" element={<DogDetails />} /> */}
          </Routes>
        </DogBreedsProvider>
      </AuthContextProvider>
    </Router >
  )
}

export default App
