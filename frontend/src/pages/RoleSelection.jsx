import { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const RoleSelection = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    }
  }, [user, navigate]);
  return (
    <div className="auth-container card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🥗</div>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--primary)' }}>VitaEats</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Select your portal to continue</p>
      
      <div className="flex flex-col gap-4">
        <Link to="/user/login" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', width: '100%' }}>
          Login as User
        </Link>
        <Link to="/admin/login" className="btn btn-outline" style={{ padding: '1rem', fontSize: '1.1rem', width: '100%' }}>
          Login as Admin
        </Link>
      </div>
    </div>
  );
};

export default RoleSelection;
