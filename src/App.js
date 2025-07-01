import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Index from './pages/Index';
import Login from './auth/Login';
import Register from './auth/Register';
import PostWriting from './pages/PostWriting';
import Product from './pages/Product';

function App() {
  // Remove API call logic from here, as Index page will be the home
  return (
    <Router>
      <Navbar />
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post" element={<PostWriting />} />
            <Route path="/product" element={<Product />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App; 