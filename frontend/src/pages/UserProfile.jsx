import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp, RotateCcw, Activity, Target, Shield, Settings, AlertCircle, Users, Database } from 'lucide-react';

const UserProfile = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  
  // Health Dashboard States
  const [nutritionData, setNutritionData] = useState({ totalCalories: 0, totalProtein: 0, targetCalories: 2000 });
  const [healthProfile, setHealthProfile] = useState({ age: '', weight: '', height: '', activityLevel: 'low', goal: 'maintenance' });
  const [isUpdatingHealth, setIsUpdatingHealth] = useState(false);
  const [healthMessage, setHealthMessage] = useState('');

  const { user } = useContext(AuthContext);
  const { fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // Fetch Orders
        const { data: ordersData } = await axios.get('/api/orders/myorders', config);
        setOrders(ordersData);
        
        // Fetch Nutrition Dashboard
        const { data: dashData } = await axios.get('/api/users/dashboard/nutrition', config);
        setNutritionData(dashData);
        
        // Fetch Full User Profile for Biometrics
        const { data: profileData } = await axios.get('/api/users/profile', config);
        if (profileData.healthProfile) {
          setHealthProfile({
            age: profileData.healthProfile.age || '',
            weight: profileData.healthProfile.weight || '',
            height: profileData.healthProfile.height || '',
            activityLevel: profileData.healthProfile.activityLevel || 'low',
            goal: profileData.healthProfile.goal || 'maintenance'
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (user && user.role === 'user') fetchUserData();
  }, [user]);

  const handleHealthUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingHealth(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/users/profile/health', healthProfile, config);
      setHealthMessage(data.message);
      // Refresh nutrition data to get new targets
      const { data: dashData } = await axios.get('/api/users/dashboard/nutrition', config);
      setNutritionData(dashData);
      setTimeout(() => setHealthMessage(''), 3000);
    } catch (error) {
       setHealthMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setIsUpdatingHealth(false);
    }
  };

  const activeOrders = orders.filter(o => o.status !== 'Delivered');
  const pastOrders = orders.filter(o => o.status === 'Delivered');

  const getStepProgress = (status) => {
    switch(status) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const toggleExpand = (id) => {
    if (expandedOrderId === id) setExpandedOrderId(null);
    else setExpandedOrderId(id);
  };

  const handleReorder = async (order) => {
    setIsReordering(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      for (const item of order.orderItems) {
        await axios.post('/api/cart', { mealId: item.meal, quantity: item.quantity }, config);
      }
      await fetchCart();
      navigate('/cart');
    } catch (error) {
      console.error('Error reordering', error);
      alert(error.response?.data?.message || 'Failed to reorder. Items may be out of stock.');
    } finally {
      setIsReordering(false);
    }
  };

  const caloriePercentage = Math.min((nutritionData.totalCalories / nutritionData.targetCalories) * 100, 100);

  return (
    <div className="container mt-8 mb-12">
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(135deg, var(--surface) 0%, #f0fdf4 100%)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '700' }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)' }}>{user.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{user.email}</p>
        </div>
      </div>

      {user && user.role === 'admin' && (
        <div className="admin-features mb-12">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={24} color="var(--primary)" /> Admin Control Center
          </h2>
          
          <div className="grid-meals" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s', borderLeft: '4px solid var(--primary)' }} onClick={() => navigate('/admin/dashboard')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <Activity size={24} color="var(--primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Platform Analytics</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>View total revenue, users, and overall platform statistics.</p>
            </div>
            
            <div className="card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s', borderLeft: '4px solid #3b82f6' }} onClick={() => navigate('/admin/orders')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <Package size={24} color="#3b82f6" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Master Orders</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage and update statuses for all incoming customer orders.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s', borderLeft: '4px solid #8b5cf6' }} onClick={() => navigate('/admin/inventory')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <Database size={24} color="#8b5cf6" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Inventory Stock</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add, remove, or update meal offerings and their prices.</p>
            </div>
          </div>

          <div className="grid-meals" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} color="var(--text-main)" /> System Activity Logs
              </h3>
              <div className="flex flex-col gap-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontWeight: '500' }}>New User Registration Complete</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>User: john.doe@example.com</p>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2 mins ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontWeight: '500' }}>High Value Order Placed</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order ID: #A1B2C3D4</p>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>15 mins ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontWeight: '500' }}>Failed Login Attempt</p>
                    <p style={{ fontSize: '0.85rem', color: '#ef4444' }}>IP: 192.168.1.1 (Admin Portal)</p>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1 hour ago</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem', background: 'var(--surface)' }}>
               <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Settings size={20} color="var(--text-main)" /> Quick Settings
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Users size={16} /> Manage Admin Users
                 </button>
                 <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Database size={16} /> Backup Database
                 </button>
                 <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', display: 'flex', gap: '0.5rem', alignItems: 'center', borderColor: '#ef4444', color: '#ef4444' }}>
                    <AlertCircle size={16} /> Maintenance Mode
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {user && user.role === 'user' && (
      <div className="grid-meals mb-12" style={{ gridTemplateColumns: 'minmax(300px, 1fr) minmax(350px, 1.5fr)', gap: '2rem' }}>
        {/* Daily Nutrition Tracker */}
        <div className="card" style={{ padding: '2rem', background: 'var(--surface)' }}>
           <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <Activity size={24} color="var(--primary)" /> Today's Nutrition Dashboard
           </h2>
           
           <div style={{ marginBottom: '2rem' }}>
             <div className="flex justify-between items-end mb-2">
               <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Calories Consumed</span>
               <span style={{ fontSize: '1.5rem', fontWeight: '700', color: caloriePercentage >= 100 ? '#ef4444' : 'var(--text-main)' }}>
                 {Math.round(nutritionData.totalCalories)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {nutritionData.targetCalories} kcal</span>
               </span>
             </div>
             <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
               <div style={{ height: '100%', width: `${caloriePercentage}%`, backgroundColor: caloriePercentage >= 100 ? '#ef4444' : 'var(--primary)', transition: 'width 0.5s ease' }}></div>
             </div>
             <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'right' }}>
               {caloriePercentage >= 100 ? "Limit Reached" : `${Math.round(nutritionData.targetCalories - nutritionData.totalCalories)} kcal remaining`}
             </p>
           </div>

           <div>
             <div className="flex justify-between items-end mb-2">
               <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Protein Consumed</span>
               <span style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)' }}>
                 {Math.round(nutritionData.totalProtein)}g
               </span>
             </div>
             <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
               <div style={{ height: '100%', width: `${Math.min((nutritionData.totalProtein / 150) * 100, 100)}%`, backgroundColor: '#3b82f6', transition: 'width 0.5s ease' }}></div>
             </div>
             <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>*Based on real-time order tracking</p>
           </div>
        </div>

        {/* Biometric Health Form */}
        <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--primary)' }}>
           <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <Target size={24} color="var(--primary)" /> Biometric Profile Math
           </h2>
           <form onSubmit={handleHealthUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group mb-0">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Age</label>
                    <input type="number" className="input" value={healthProfile.age} onChange={e => setHealthProfile({...healthProfile, age: e.target.value})} placeholder="yrs" required />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Weight (kg)</label>
                    <input type="number" className="input" value={healthProfile.weight} onChange={e => setHealthProfile({...healthProfile, weight: e.target.value})} placeholder="kg" required />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Height (cm)</label>
                    <input type="number" className="input" value={healthProfile.height} onChange={e => setHealthProfile({...healthProfile, height: e.target.value})} placeholder="cm" required />
                  </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group mb-0">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Activity Level</label>
                    <select className="input" value={healthProfile.activityLevel} onChange={e => setHealthProfile({...healthProfile, activityLevel: e.target.value})}>
                      <option value="low">Low (Sedentary)</option>
                      <option value="moderate">Moderate (Active)</option>
                      <option value="high">High (Athlete)</option>
                    </select>
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Body Goal</label>
                    <select className="input" value={healthProfile.goal} onChange={e => setHealthProfile({...healthProfile, goal: e.target.value})}>
                      <option value="weight-loss">Weight Loss</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="muscle-gain">Muscle Gain</option>
                    </select>
                  </div>
              </div>

              <button type="submit" className="btn btn-primary mt-2" disabled={isUpdatingHealth}>
                {isUpdatingHealth ? 'Calculating BMR...' : 'Calculate & Save Biometrics'}
              </button>
              {healthMessage && <p style={{ color: 'var(--primary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '0.5rem', fontWeight: '500' }}>{healthMessage}</p>}
           </form>
        </div>
      </div>
      )}

      {activeOrders.length > 0 && (
        <div className="mb-12">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="pulse-dot"></span> Live Active Deliveries
          </h2>
          <div className="flex flex-col gap-8">
            {activeOrders.map(order => {
              const step = getStepProgress(order.status);
              return (
                <div key={order._id} className="card tracking-card" style={{ padding: '2.5rem' }}>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 style={{ fontWeight: '600', fontSize: '1.2rem' }}>Order #{order._id.substring(order._id.length - 6).toUpperCase()}</h3>
                      <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Estimated Delivery Time: 30-45 mins</p>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '1.8rem', color: 'var(--primary)' }}>₹{order.totalAmount.toFixed(2)}</div>
                  </div>

                  <div className="tracking-progress">
                    <div className="progress-bg"></div>
                    <div className="progress-bar" style={{ width: `${(step - 1) * 33.33}%` }}></div>
                    
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                      <div className="step-icon"><Clock size={20} /></div>
                      <span className="step-text">Verifying</span>
                    </div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                      <div className="step-icon"><Package size={20} /></div>
                      <span className="step-text">Confirmed</span>
                    </div>
                    <div className={`step ${step >= 3 ? 'active' : ''} ${step === 3 ? 'pulse-icon' : ''}`}>
                      <div className="step-icon"><Truck size={20} /></div>
                      <span className="step-text">On the Way</span>
                    </div>
                    <div className={`step ${step >= 4 ? 'active' : ''}`}>
                      <div className="step-icon"><CheckCircle size={20} /></div>
                      <span className="step-text">Delivered</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {pastOrders.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Order History Log</h2>
          <div className="flex flex-col gap-4">
            {pastOrders.map(order => (
              <div key={order._id} className="card" style={{ overflow: 'hidden', opacity: 0.95 }}>
                <div 
                  className="flex justify-between items-center" 
                  style={{ padding: '1.5rem', cursor: 'pointer', backgroundColor: expandedOrderId === order._id ? 'var(--background)' : 'transparent', transition: 'background 0.2s' }}
                  onClick={() => toggleExpand(order._id)}
                >
                  <div className="flex items-center gap-4">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                       {order.orderItems.slice(0, 3).map((item, idx) => (
                         <img key={idx} src={item.image} alt={item.name} title={item.name} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid white', marginLeft: idx > 0 ? '-1rem' : '0', boxShadow: 'var(--shadow-sm)', objectFit: 'cover' }} />
                       ))}
                       {order.orderItems.length > 3 && <span style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--border)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '600', marginLeft: '-1rem', border: '2px solid white', zIndex: 10 }}>+{order.orderItems.length - 3}</span>}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>#{order._id.substring(order._id.length - 6).toUpperCase()}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CheckCircle size={14} color="var(--primary)" /> Delivered on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div style={{ fontWeight: '700', fontSize: '1.3rem', color: 'var(--text-main)' }}>₹{order.totalAmount.toFixed(2)}</div>
                    <div style={{ color: 'var(--primary)' }}>
                      {expandedOrderId === order._id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </div>
                </div>

                {expandedOrderId === order._id && (
                  <div style={{ padding: '2rem 1.5rem', borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '1rem' }}>Detailed Receipt Overview</h4>
                    
                    <div className="flex flex-col gap-4 mb-6">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center" style={{ paddingBottom: '0.8rem', borderBottom: '1px dashed var(--border)' }}>
                          <div className="flex items-center gap-3">
                            <span style={{ fontWeight: '600', color: 'var(--primary)', width: '25px' }}>{item.quantity}x</span>
                            <span style={{ fontWeight: '500' }}>{item.name}</span>
                          </div>
                          <div style={{ color: 'var(--text-muted)' }}>₹{(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col gap-2" style={{ marginLeft: 'auto', width: '250px', paddingBottom: '1.5rem' }}>
                      <div className="flex justify-between" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        <span>Subtotal Math</span>
                        <span>₹{(order.totalAmount - 40).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        <span>Fixed Delivery Fee</span>
                        <span>₹40.00</span>
                      </div>
                      <div className="flex justify-between" style={{ fontWeight: '700', fontSize: '1.2rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '2px solid var(--border)' }}>
                        <span>Final Total Paid</span>
                        <span>₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        onClick={() => handleReorder(order)}
                        disabled={isReordering}
                      >
                        {isReordering ? 'Executing Rebuild Action...' : <><RotateCcw size={18} /> Reorder Entire Meal</>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
