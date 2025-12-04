import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/user/');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  if (!user) {
    return <div style={{ padding: '2rem' }}>Please login to view orders</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Orders</h1>
      
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
              <h3>{order.product_title}</h3>
              <p>Quantity: {order.quantity}</p>
              <p>Total Price: ${order.total_price}</p>
              <p>Status: {order.status}</p>
              <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;