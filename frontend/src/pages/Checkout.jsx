import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { CreditCard, ShieldCheck, MapPin, Tag } from 'lucide-react';
import Button from '../components/Button';

const Checkout = () => {
  const { cartItems, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // New State variables for Phase 2
  const [address, setAddress] = useState({ street: '', city: '', zip: '' });
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay' or 'COD'

  const getMealData = (item) => item.meal || item;
  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * (getMealData(item).price || 0), 0);
  
  const discountAmount = subtotal * discountPercent;
  const deliveryFee = 40.00;
  
  const walletUsed = Math.min(walletBalance, (subtotal - discountAmount + deliveryFee));
  const totalAmount = subtotal - discountAmount + deliveryFee - walletUsed; 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/users/profile', config);
        setWalletBalance(data.walletBalance || 0);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    const code = couponCode.trim().toUpperCase();
    
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    
    if (code.startsWith('VITA-')) {
       try {
         const { data } = await axios.get(`/api/coupons/${code}`, config);
         setDiscountPercent(data.discountPercent / 100);
         setCouponMsg({ text: 'Valid Referral Code! 20% Discount Applied! 🎉', type: 'success' });
       } catch (error) {
         setDiscountPercent(0);
         setCouponMsg({ text: error.response?.data?.message || 'Invalid referral code.', type: 'error' });
       }
       return;
    }

    try {
      const { data } = await axios.get(`/api/coupons/${code}`, config);
      setDiscountPercent(data.discountPercent / 100);
      setCouponMsg({ text: `${data.discountPercent}% Special Discount Applied! 🎉`, type: 'success' });
    } catch (error) {
      setDiscountPercent(0);
      setCouponMsg({ text: error.response?.data?.message || 'Invalid coupon code.', type: 'error' });
    }
  };

  const handlePayment = async () => {
    if (!address.street || !address.city || !address.zip) {
      alert("Please fill in your complete delivery address.");
      return;
    }
    
    if (loading) return;
    setLoading(true);
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const payload = {
        shippingAddress: address,
        couponCode: couponCode.trim() || null,
        paymentMethod
      };
      
      const { data } = await axios.post('/api/payment/create-order', payload, config);
      
      if (data.paymentMethod === 'COD') {
        // Direct Settlement Complete
        await fetchCart();
        navigate(`/invoice/${data.dbOrderId}`, { replace: true });
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy_key', // Ensure VITE_RAZORPAY_KEY_ID is in your .env
        amount: data.amount, 
        currency: data.currency,
        name: "VitaEats Premium",
        description: "Test Transaction Checkout",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
             // Verify the Cryptographic Signature against our Backend
             await axios.post('/api/payment/verify', {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: data.dbOrderId
             }, config);
             
             await fetchCart();
             navigate(`/invoice/${data.dbOrderId}`, { replace: true });
          } catch (err) {
             console.error("Verification Error:", err);
             alert('Payment verification failed. Please contact support.');
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

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Payment Failed. Reason: " + response.error.description);
      });
      
      // Opens the Razorpay UI
      rzp.open();

    } catch (error) {
       console.error(error);
       alert(error.response?.data?.message || 'Error processing your order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck size={36} className="text-primary" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Secure Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Input Forms */}
        <div className="flex flex-col gap-8">
          
          {/* Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="text-accent" /> Delivery Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address</label>
                <input 
                  type="text" 
                  autoComplete="off"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  placeholder="123 Health Ave, Apt 4"
                  value={address.street}
                  onChange={(e) => setAddress({...address, street: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Metropolis"
                    value={address.city}
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Postal / Zip</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="10001"
                    value={address.zip}
                    onChange={(e) => setAddress({...address, zip: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Tag className="text-accent" /> Have a Coupon?
            </h2>
            <div className="flex gap-3">
              <input 
                type="text" 
                className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent uppercase"
                placeholder="e.g. HEALTHY20"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button variant="outline" onClick={applyCoupon}>Apply</Button>
            </div>
            {couponMsg && (
              <p className={`mt-3 text-sm font-semibold ${couponMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {couponMsg.text}
              </p>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary & Payment */}
        <div className="flex flex-col gap-8">
          <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-bl-full opacity-50 z-0"></div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10">Order Summary</h2>
            
            <div className="flex flex-col gap-4 mb-6 relative z-10">
              {cartItems.map((item) => {
                const meal = getMealData(item);
                return (
                  <div key={item._id} className="flex justify-between items-center pb-3 border-b border-gray-200 border-dashed">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-primary bg-white px-2 py-0.5 rounded-lg text-sm border border-gray-100">
                        {item.quantity}x
                      </span>
                      <span className="font-semibold text-gray-800">{meal.name}</span>
                    </div>
                    <div className="text-gray-600 font-medium">₹{((meal.price || 0) * item.quantity).toFixed(2)}</div>
                  </div>
                )
              })}
            </div>
            
            <div className="flex flex-col gap-3 font-medium text-gray-600 relative z-10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({couponCode.toUpperCase()})</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {walletUsed > 0 && (
                <div className="flex justify-between text-primary font-bold">
                  <span>Wallet Balance Used</span>
                  <span>-₹{walletUsed.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-2xl text-gray-900 mt-4 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mt-6 border-t border-gray-200 pt-6 relative z-10">
              <h3 className="font-bold text-gray-900 mb-3">Payment Method</h3>
              <div className="flex flex-col gap-3">
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'Razorpay' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <input type="radio" value="Razorpay" checked={paymentMethod === 'Razorpay'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-primary accent-primary" />
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">Pay Online Securely</span>
                    <span className="text-xs text-gray-500 font-medium">Razorpay (Cards, UPI, NetBanking)</span>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-primary accent-primary" />
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">Cash on Delivery (COD)</span>
                    <span className="text-xs text-gray-500 font-medium">Pay directly to our delivery partner</span>
                  </div>
                </label>
              </div>
            </div>

            <Button 
              variant="primary" 
              size="lg"
              className="w-full mt-8 relative z-10 font-bold"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                'Processing Order...'
              ) : (
                <span className="flex items-center justify-center gap-2">
                   Confirm Order (₹{totalAmount.toFixed(2)})
                </span>
              )}
            </Button>
            
            <p className="text-center text-xs text-gray-400 mt-4 relative z-10 transition-colors">
              Direct Prototype Authorization Engaged.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
