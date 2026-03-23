import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { adminLogin, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container card" style={{ borderTop: '4px solid #ef4444' }}>
      <h2 className="auth-title">Admin Portal</h2>
      <p className="auth-subtitle">Secure access to VitaEats Management</p>
      
      {error && <div style={{ color: 'white', backgroundColor: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label className="form-label">Admin Email</label>
          <input 
            type="email" 
            className="input" 
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="input" 
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        
        <button type="submit" className="btn btn-danger" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius)', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
          Authenticate
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
