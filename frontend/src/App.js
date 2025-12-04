import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // Get products when app loads
  useEffect(() => {
    fetchProducts();
    checkUser();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products/');
      setProducts(response.data);
    } catch (error) {
      console.log('Error getting products:', error);
    }
  };

  const checkUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password
      });
      
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setShowLogin(false);
      alert('Login successful!');
    } catch (error) {
      alert('Login failed: Invalid credentials');
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', userData);
      
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setShowLogin(false);
      alert('Registration successful!');
    } catch (error) {
      alert('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>MiniHub Marketplace</h1>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>Hello {user.name}!</span>
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowLogin(true)}>Login</button>
              <button onClick={() => setShowLogin('register')}>Register</button>
            </div>
          )}
        </div>
      </div>

      {/* Login/Register Form */}
      {showLogin && !user && (
        showLogin === 'register' ? 
          <RegisterForm onRegister={register} onClose={() => setShowLogin(false)} /> :
          <LoginForm onLogin={login} onClose={() => setShowLogin(false)} />
      )}

      {/* Products */}
      <div className="products-section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Simple login form
function LoginForm({ onLogin, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="login-form">
      <h3>Login to Your Account</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button type="submit">Login</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

// Simple register form
function RegisterForm({ onRegister, onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    role: 'buyer'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <div className="login-form">
      <h3>Create New Account</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          style={{ width: '100%', padding: '18px 20px', margin: '15px 0', border: '2px solid #ecf0f1', borderRadius: '15px', fontSize: '16px', background: 'rgba(255,255,255,0.9)' }}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button type="submit">Register</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

// Simple product card
function ProductCard({ product, user }) {
  const buyProduct = async () => {
    if (!user) {
      alert('Please login first!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:8000/api/orders/', {
        product: product.id,
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order placed successfully!');
    } catch (error) {
      alert('Error placing order');
    }
  };

  return (
    <div className="product-card">
      <h4>{product.title}</h4>
      <p>{product.description}</p>
      <div className="product-price">${product.price}</div>
      <p style={{ fontSize: '14px', color: '#888' }}>
        Seller: {product.user?.name}
      </p>
      {user && user.role === 'buyer' && (
        <button className="buy-button" onClick={buyProduct}>
          Buy Now
        </button>
      )}
    </div>
  );
}

export default App;