import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}/`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleOrder = async () => {
    try {
      await api.post('/orders/', {
        product: product.id,
        quantity: quantity
      });
      alert('Order placed successfully!');
    } catch (error) {
      alert('Error placing order');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p><strong>Price: ${product.price}</strong></p>
      <p>Category: {product.category_name}</p>
      <p>Seller: {product.user.name}</p>
      
      {user && user.role === 'buyer' && user.id !== product.user.id && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Place Order</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label>Quantity: </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
            />
          </div>
          <p>Total: ${(product.price * quantity).toFixed(2)}</p>
          <button 
            onClick={handleOrder}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;