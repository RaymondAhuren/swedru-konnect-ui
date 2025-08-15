import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Login from './pages/Login'
import Homepage from './pages/Homepage';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import MyAds from './pages/MyAds';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/homepage" replace />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/product/:id/:slug" element={<ProductDetails />} />
      <Route path="/auth/login" element={<Login />} />

      <Route path="/sk/user/profile" element={<Profile />} />
      <Route path="/my-ads" element={<MyAds />} />
    </Routes>
  );
}

export default App
