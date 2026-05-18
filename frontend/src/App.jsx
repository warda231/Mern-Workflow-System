import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Requests from './Pages/Requests.jsx';
import Layout from './Components/Layout.jsx';
import AdminLayout from './Components/AdminLayout.jsx';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard.jsx';
import AdminRequests from './Pages/AdminRequests.jsx';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      
      {/* User Routes - Only for employees */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/requests" element={<Requests />} />
      </Route>
      
      {/* Admin/Manager Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
      </Route>
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;