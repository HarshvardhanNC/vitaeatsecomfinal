import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { cartItems, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.meal.price, 0);
  const deliveryFee = 40;
  const totalAmount = subtotal + deliveryFee;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, [cartItems, navigate]);

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const { data: { keyId } } = await axios.get('/api/config/razorpay');
      
      const { data } = await axios.post('/api/payment/create-order', {}, config);
      
      const options = {
        key: keyId, 
        amount: data.order.amount, 
        currency: "INR",
        name: "VitaEats",
        description: "Test Transaction",
        order_id: data.order.id, 
        handler: async function (response) {
          try {
            const verifyRes = await axios.post('/api/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: data.dbOrderId
            }, config);
            
            await fetchCart();
            // Using replace so user can't hit 'back' to go to successful checkout processing securely
            navigate(`/invoice/${verifyRes.data.orderId}`, { replace: true });
          } catch (err) {
            console.error(err);
            alert('Payment verification failed. Please contact support if amount was deducted.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#22c55e"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response){
        alert("Payment failed: " + response.error.description);
      });

    } catch (error) {
       console.error(error);
       alert(error.response?.data?.message || 'Error initializing payment gateway');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="container mt-8 mb-12" style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldCheck size={32} color="var(--primary)" /> Secure Checkout
      </h1>

      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Order Summary</h2>
        <div className="flex flex-col gap-4 mb-6">
          {cartItems.map((item) => (
             <div key={item._id} className="flex justify-between items-center" style={{ paddingBottom: '0.8rem', borderBottom: '1px dashed var(--border)' }}>
               <div className="flex items-center gap-3">
                 <span style={{ fontWeight: '600', color: 'var(--primary)', width: '25px' }}>{item.quantity}x</span>
                 <span style={{ fontWeight: '500' }}>{item.meal.name}</span>
               </div>
               <div style={{ color: 'var(--text-muted)' }}>₹{(item.meal.price * item.quantity).toFixed(2)}</div>
             </div>
          ))}
        </div>
        <div className="flex flex-col gap-2" style={{ marginLeft: 'auto', width: '300px' }}>
            <div className="flex justify-between" style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              <span>Fixed Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ fontWeight: '700', fontSize: '1.3rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '2px solid var(--border)' }}>
              <span>Total Payable</span>
              <span style={{ color: 'var(--primary)' }}>₹{totalAmount.toFixed(2)}</span>
            </div>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--surface)' }}>
         <h2 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '1rem' }}>Payment</h2>
         <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
           You will be safely redirected to complete your payment through Razorpay's secure gateway. No card details are saved on our servers.
         </p>
         
         <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
            onClick={handlePayment}
            disabled={loading}
         >
            {loading ? 'Initializing Gateway...' : <><CreditCard size={24} /> Proceed to Pay ₹{totalAmount.toFixed(2)}</>}
         </button>
      </div>
    </div>
  );
};
export default Checkout;
