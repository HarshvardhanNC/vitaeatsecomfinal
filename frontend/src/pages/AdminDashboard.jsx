import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/admin/dashboard', config);
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (user && user.role === 'admin') fetchStats();
  }, [user]);

  if (!stats) return <div className="container mt-8">Loading dashboard...</div>;

  return (
    <div className="container mt-8 mb-8" style={{ minHeight: '60vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <div className="grid-meals" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Total Users</h3>
          <p style={{ fontSize: '3.5rem', fontWeight: '700', color: 'var(--primary)' }}>{stats.usersCount}</p>
        </div>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Total Orders</h3>
          <p style={{ fontSize: '3.5rem', fontWeight: '700', color: 'var(--primary)' }}>{stats.ordersCount}</p>
        </div>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Total Revenue</h3>
          <p style={{ fontSize: '3.5rem', fontWeight: '700', color: 'var(--primary)' }}>₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex gap-6 mt-12">
        <Link to="/admin/orders" className="btn btn-primary" style={{ padding: '1.2rem 2rem', fontSize: '1.1rem' }}>Manage Master Orders</Link>
        <Link to="/admin/inventory" className="btn btn-outline" style={{ padding: '1.2rem 2rem', fontSize: '1.1rem' }}>Manage Inventory Stock</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
