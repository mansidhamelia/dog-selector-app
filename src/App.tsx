import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './components/Login'
import DogList from './components/DogList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/doglist" element={<DogList />}>
          {/* <Route path=":id" element={<DogDetails />} /> */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
