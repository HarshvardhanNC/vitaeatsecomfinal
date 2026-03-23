import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const AdminInventory = () => {
  const [meals, setMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ _id: null, name: '', price: '', calories: '', stock: '', image: '', protein: '', carbs: '', fats: '', dietTags: '', ingredients: '', oilType: 'Standard', sugarLevel: 'medium' });
  const { user } = useContext(AuthContext);

  const fetchMeals = async () => {
    try {
      const { data } = await axios.get('/api/meals');
      setMeals(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleEdit = (meal) => {
    setFormData(meal);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ _id: null, name: '', price: '', calories: '', stock: '', image: '', protein: '', carbs: '', fats: '', dietTags: '', ingredients: '', oilType: 'Standard', sugarLevel: 'medium' });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const payload = {
        ...formData,
        dietTags: typeof formData.dietTags === 'string' ? formData.dietTags.split(',').map(s=>s.trim()) : formData.dietTags,
        ingredients: typeof formData.ingredients === 'string' ? formData.ingredients.split(',').map(s=>s.trim()) : formData.ingredients
      };

      if (formData._id) {
        await axios.put(`/api/meals/${formData._id}`, payload, config);
      } else {
        await axios.post('/api/meals', payload, config);
      }
      fetchMeals();
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Error saving meal');
    }
  };

  const deleteMeal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/meals/${id}`, config);
      fetchMeals();
    } catch (error) {
      console.error(error);
      alert('Error deleting meal');
    }
  };

  return (
    <div className="container mt-8 mb-8" style={{ minHeight: '60vh' }}>
      <div className="flex justify-between items-center mb-8">
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Master Inventory</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>
          {showForm ? 'Cancel Form' : '+ Manage New Meal'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-8" style={{ padding: '2.5rem', borderTop: '4px solid var(--primary)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>{formData._id ? 'Edit Internal Product' : 'Create Custom Product'}</h2>
          <form onSubmit={handleSubmit} className="grid-meals" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Menu Item Name</label>
              <input type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Avocado Toast" required />
            </div>
            <div className="form-group">
              <label className="form-label">Retail Price (₹)</label>
              <input type="number" step="0.01" className="input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" required />
            </div>
            <div className="form-group">
              <label className="form-label">Total Calories</label>
              <input type="number" className="input" value={formData.calories} onChange={e => setFormData({...formData, calories: e.target.value})} placeholder="0" required />
            </div>
            <div className="form-group">
              <label className="form-label">Live Stock Units</label>
              <input type="number" className="input" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="0" required />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Secure Image Link (URL)</label>
              <input type="url" className="input" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Total Protein (g)</label>
              <input type="number" className="input" value={formData.protein} onChange={e => setFormData({...formData, protein: e.target.value})} placeholder="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Net Carbs (g)</label>
              <input type="number" className="input" value={formData.carbs} onChange={e => setFormData({...formData, carbs: e.target.value})} placeholder="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Healthy Fats (g)</label>
              <input type="number" className="input" value={formData.fats} onChange={e => setFormData({...formData, fats: e.target.value})} placeholder="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Diet Tags (Comma Separated)</label>
              <input type="text" className="input" value={formData.dietTags} onChange={e => setFormData({...formData, dietTags: e.target.value})} placeholder="e.g. Heart-friendly, Keto" />
            </div>
            <div className="form-group">
              <label className="form-label">Ingredients (Comma Separated)</label>
              <input type="text" className="input" value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} placeholder="e.g. Tomato, Olive Oil" />
            </div>
            <div className="form-group">
              <label className="form-label">Cooking Oil Type</label>
              <select className="input" value={formData.oilType} onChange={e => setFormData({...formData, oilType: e.target.value})}>
                <option value="None">None</option>
                <option value="Standard">Standard</option>
                <option value="Olive Oil">Olive Oil</option>
                <option value="Coconut Oil">Coconut Oil</option>
                <option value="Butter">Butter</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sugar Content</label>
              <select className="input" value={formData.sugarLevel} onChange={e => setFormData({...formData, sugarLevel: e.target.value})}>
                <option value="zero">Zero Sugar</option>
                <option value="low">Low Sugar</option>
                <option value="medium">Medium Sugar</option>
                <option value="high">High Sugar</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flexGrow: 1, padding: '1rem' }}>Save to Database</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Image</th>
              <th style={{ color: 'var(--text-muted)' }}>Product Name</th>
              <th style={{ color: 'var(--text-muted)' }}>Price</th>
              <th style={{ color: 'var(--text-muted)' }}>Stock</th>
              <th style={{ color: 'var(--text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map(meal => (
              <tr key={meal._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem' }}><img src={meal.image} alt={meal.name} style={{width: 50, height: 50, borderRadius: 8, objectFit: 'cover'}}/></td>
                <td style={{ fontWeight: '600' }}>{meal.name}</td>
                <td style={{ color: 'var(--primary)', fontWeight: '600' }}>₹{meal.price.toFixed(2)}</td>
                <td>
                  <span style={{ background: meal.stock > 0 ? '#dcfce7' : '#fee2e2', color: meal.stock > 0 ? '#166534' : '#991b1b', padding: '0.3rem 0.8rem', borderRadius: '8px', fontWeight: '500' }}>
                    {meal.stock || 0} Units
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(meal)} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', marginRight: '0.5rem' }}>Edit</button>
                  <button onClick={() => deleteMeal(meal._id)} className="btn btn-danger" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {meals.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No products in inventory.</p>}
      </div>
    </div>
  );
};

export default AdminInventory;
