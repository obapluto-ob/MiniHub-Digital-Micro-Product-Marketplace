import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === parseInt(selectedCategory))
    : products;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Digital Marketplace</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <label>Filter by Category: </label>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filteredProducts.map(product => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p><strong>${product.price}</strong></p>
            <p>Category: {product.category_name}</p>
            <p>Seller: {product.user.name}</p>
            <Link 
              to={`/products/${product.id}`}
              style={{ 
                display: 'inline-block', 
                padding: '0.5rem 1rem', 
                backgroundColor: '#007bff', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '4px' 
              }}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;