import React, { useState, useEffect, useContext, Fragment } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${id}/status`, { status }, config);
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    }
  };

  const toggleExpand = (id) => {
    if (expandedId === id) setExpandedId(null);
    else setExpandedId(id);
  };

  return (
    <div className="container mt-8 mb-8" style={{ minHeight: '60vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem' }}>Order Management System</h1>
      <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}></th>
              <th style={{ color: 'var(--text-muted)' }}>Order ID</th>
              <th style={{ color: 'var(--text-muted)' }}>User</th>
              <th style={{ color: 'var(--text-muted)' }}>Date</th>
              <th style={{ color: 'var(--text-muted)' }}>Total</th>
              <th style={{ color: 'var(--text-muted)' }}>Status</th>
              <th style={{ color: 'var(--text-muted)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <Fragment key={order._id}>
                <tr style={{ borderBottom: expandedId === order._id ? 'none' : '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', cursor: 'pointer', color: 'var(--primary)' }} onClick={() => toggleExpand(order._id)}>
                    {expandedId === order._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </td>
                  <td style={{ fontWeight: '500' }}>...{order._id.substring(order._id.length - 6)}</td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: '600' }}>₹{order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span style={{ 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: '20px', 
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      backgroundColor: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Confirmed' ? '#dbeafe' : '#fef9c3',
                      color: order.status === 'Delivered' ? '#166534' : order.status === 'Confirmed' ? '#1e40af' : '#854d0e'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={order.status} 
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="input" 
                      style={{ padding: '0.5rem', width: 'auto', outline: 'none' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
                {expandedId === order._id && (
                  <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
                    <td colSpan="7" style={{ padding: '1.5rem 3rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Receipt Contents:</h4>
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                            <span style={{ fontWeight: '600' }}>{item.quantity}x {item.name}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>(₹{item.price.toFixed(2)} ea)</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found.</p>}
      </div>
    </div>
  );
};

export default AdminOrders;
