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
      console.log('Error getting products');
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
    } catch (error) {
      alert('Login failed');
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
        <h1>🛍️ MiniHub Marketplace</h1>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>Hello {user.name}! 👋</span>
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)}>Login</button>
          )}
        </div>
      </div>

      {/* Login Form */}
      {showLogin && !user && <LoginForm onLogin={login} onClose={() => setShowLogin(false)} />}

      {/* Products */}
      <div className="products-section">
        <h2>✨ Featured Products</h2>
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
      <h3>🔐 Login to Your Account</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button type="submit">Login</button>
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
      alert('Please login first! 🔐');
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
      alert('Order placed successfully! 🎉');
    } catch (error) {
      alert('Error placing order 😞');
    }
  };

  return (
    <div className="product-card">
      <h4>📦 {product.title}</h4>
      <p>{product.description}</p>
      <div className="product-price">${product.price}</div>
      <p style={{ fontSize: '14px', color: '#888' }}>
        👤 Seller: {product.user?.name}
      </p>
      {user && user.role === 'buyer' && (
        <button className="buy-button" onClick={buyProduct}>
          🛒 Buy Now
        </button>
      )}
    </div>
  );
}

export default App;