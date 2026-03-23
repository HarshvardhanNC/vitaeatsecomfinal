import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (user && user.role === 'user') fetchMyOrders();
  }, [user]);

  return (
    <div className="container mt-8 mb-8" style={{ minHeight: '60vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem' }}>My Recent Orders</h1>
      
      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '4rem' }}>You haven't placed any orders yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map(order => (
            <div key={order._id} className="card" style={{ padding: '1.5rem' }}>
              <div className="flex justify-between items-center mb-4" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Order #{order._id}</span>
                  <div style={{ fontWeight: '600', marginTop: '0.2rem' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
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
                  <div style={{ fontWeight: '700', fontSize: '1.2rem', marginTop: '0.5rem' }}>₹{order.totalAmount.toFixed(2)}</div>
                </div>
              </div>
              
              <div>
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-2" style={{ padding: '0.5rem 0' }}>
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                      <span style={{ fontWeight: '500' }}>{item.name}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>{item.quantity} x ₹{item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
