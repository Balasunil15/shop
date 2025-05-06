import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import Cart from './components/Cart';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (token, admin) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setIsAdmin(admin);
  };

  return (
    <Router>
      <div className="App">
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
