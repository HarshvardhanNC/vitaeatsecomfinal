import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Trash2, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.meal.price, 0);

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '6rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Looks like you haven't added any meals yet.</p>
        <Link to="/" className="btn btn-primary">Browse Meals</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Your Cart</h1>
      
      <div className="flex" style={{ gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 600px' }}>
          {cartItems.map((item) => (
            <div key={item._id} className="card flex items-center justify-between" style={{ padding: '1rem', marginBottom: '1rem', flexDirection: 'row' }}>
              <div className="flex items-center gap-4">
                <img 
                  src={item.meal.image} 
                  alt={item.meal.name} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} 
                />
                <div>
                  <h3 style={{ fontWeight: '600', fontSize: '1.1rem' }}>{item.meal.name}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>₹{item.meal.price.toFixed(2)} x {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                  ₹{(item.meal.price * item.quantity).toFixed(2)}
                </span>
                <button 
                  onClick={() => removeFromCart(item._id)}
                  style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="card" style={{ padding: '2rem', flex: '1 1 300px', backgroundColor: 'var(--surface)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            Order Summary
          </h2>
          
          <div className="flex justify-between mb-4">
            <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
            <span style={{ fontWeight: '500' }}>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
            <span style={{ fontWeight: '500' }}>₹40.00</span>
          </div>
          
          <div className="flex justify-between mt-6" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', fontSize: '1.25rem', fontWeight: '700' }}>
            <span>Total</span>
            <span>₹{(subtotal + 40).toFixed(2)}</span>
          </div>
          
          <button 
            className="btn btn-primary mt-8 flex items-center justify-center gap-2" 
            style={{ width: '100%', padding: '1rem' }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
