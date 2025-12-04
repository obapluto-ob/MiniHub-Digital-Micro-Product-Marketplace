import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>
          MiniHub
        </Link>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Home</Link>
          
          {user ? (
            <>
              <span>Hello, {user.name}</span>
              {user.role === 'seller' && (
                <Link to="/upload" style={{ textDecoration: 'none', color: '#333' }}>Upload Product</Link>
              )}
              <Link to="/orders" style={{ textDecoration: 'none', color: '#333' }}>Orders</Link>
              <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: '#333' }}>Login</Link>
              <Link to="/register" style={{ textDecoration: 'none', color: '#333' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;