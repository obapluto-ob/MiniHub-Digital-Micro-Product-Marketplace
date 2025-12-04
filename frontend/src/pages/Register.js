import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    role: 'buyer',
    password: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Username:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Role:</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            required
          />
        </div>
        
        <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          Register
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;