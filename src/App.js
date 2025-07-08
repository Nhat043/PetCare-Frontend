import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Index from './user/Index';
import Login from './auth/Login';
import Register from './auth/Register';
import PostWriting from './user/Posts/Index';
import Product from './user/Product/Index';
import AdminDashboard from './admin/Dashboard';
import UserManagement from './admin/user/UserManagement';
import UserDashboard from './user/UserDashboard';
import ProductDetailPage from './user/Product/ProductDetailPage';
import PostDetailPage from './user/Posts/PostDetailPage';
import CreatePost from './user/Posts/CreatePost';
import UserProfile from './user/Profile/UserProfile';
import ProductManagement from './admin/product/ProductManagement';
import CreateProduct from './admin/product/CreateProduct';
import PostManagement from './admin/post/PostManagement';

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
            <Route path="/post/create" element={<CreatePost />} />
            <Route path="/product" element={<Product />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/products/create" element={<CreateProduct />} />
            <Route path="/admin/posts" element={<PostManagement />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/user/profile" element={<UserProfile />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App; 