import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import Cart from './components/Cart';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for existing token on component mount
    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('isAdmin') === 'true';
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(admin);
    }
  }, []);

  const handleLogin = (token, admin) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', admin);
    setIsAuthenticated(true);
    setIsAdmin(admin);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const renderHeader = () => {
    if (isAuthenticated) {
      return (
        <div className="header">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      );
    }
    return null;
  };

  return (
    <Router>
      <div className="App">
        {renderHeader()}
        <Routes>
          <Route 
            path="/" 
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/shop" />
              )
            } 
          />
          <Route
            path="/admin"
            element={
              isAuthenticated && isAdmin ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/shop"
            element={
              isAuthenticated && !isAdmin ? (
                <CustomerDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/cart"
            element={
              isAuthenticated && !isAdmin ? (
                <Cart />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
