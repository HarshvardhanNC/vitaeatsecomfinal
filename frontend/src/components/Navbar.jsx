import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { ShoppingBag, User as UserIcon, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="brand">
          <span style={{ fontSize: '1.8rem' }}>🥗</span>
          VitaEats
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              {user.role !== 'admin' && (
                <Link to="/cart" className="nav-link">
                  <ShoppingBag size={20} />
                  <span>Cart ({cartCount})</span>
                </Link>
              )}
              {user.role === 'admin' && (
                <span className="nav-link" style={{ fontWeight: '600', color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.3rem 0.8rem', borderRadius: '8px' }}>
                  Admin Portal
                </span>
              )}
              <Link to="/user/profile" className="nav-link">
                <UserIcon size={20} />
                <span>{user.name}</span>
              </Link>
              <button className="btn btn-outline" onClick={logout} style={{ padding: '0.4rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/user/login" className="nav-link">Login</Link>
              <Link to="/user/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
