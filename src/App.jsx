import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Login from './pages/Login'
import Homepage from './pages/Homepage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/homepage" replace />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/auth/login" element={<Login />} />
    </Routes>
  );
}

export default App
