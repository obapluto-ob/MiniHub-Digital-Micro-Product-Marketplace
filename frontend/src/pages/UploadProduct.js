import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const UploadProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    if (file) data.append('file_url', file);

    try {
      await api.post('/products/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (error) {
      alert('Error uploading product');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Upload Product</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', minHeight: '100px' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Category:</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>File:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            required
          />
        </div>
        
        <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Upload Product
        </button>
      </form>
    </div>
  );
};

export default UploadProduct;