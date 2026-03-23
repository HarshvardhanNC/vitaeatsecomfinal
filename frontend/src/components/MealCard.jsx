import { useState, useContext } from 'react';
import CartContext from '../context/CartContext';
import { Plus, Info, Droplet, Candy, X, Activity } from 'lucide-react';

const MealCard = ({ meal, isGymMode }) => {
  const { addToCart } = useContext(CartContext);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="card" style={{ border: isGymMode && meal.protein >= 25 ? '2px solid #ea580c' : '1px solid var(--border)' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowModal(true)}>
          <img 
            src={meal.image} 
            alt={meal.name} 
            style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
          />
          {isGymMode && meal.protein > 0 && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#ea580c', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontWeight: '700', boxShadow: '0 4px 6px rgba(234, 88, 12, 0.3)' }}>
              {meal.protein}g PROTEIN
            </div>
          )}
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.65)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', backdropFilter: 'blur(4px)' }}>
            <span style={{ fontWeight: '500' }}>Click for Details</span>
          </div>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <div className="flex justify-between items-start mb-2">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', cursor: 'pointer' }} onClick={() => setShowModal(true)}>{meal.name}</h3>
          </div>

          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flexGrow: 1, display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
               <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{meal.calories}</span> kcal
            </span>
            {meal.protein > 0 && !isGymMode && (
              <span style={{ background: '#fff7ed', color: '#c2410c', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: '600', fontSize: '0.85rem' }}>
                {meal.protein}g Protein
              </span>
            )}
            <span style={{ background: meal.stock > 0 ? '#dcfce7' : '#fee2e2', color: meal.stock > 0 ? '#166534' : '#991b1b', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: '500', fontSize: '0.85rem' }}>
              {meal.stock > 0 ? `${meal.stock} Left` : 'Sold Out'}
            </span>
          </p>

          <div className="flex justify-between items-center" style={{ marginTop: 'auto' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
              ₹{meal.price.toFixed(2)}
            </span>
            <button 
              className={`btn ${meal.stock > 0 ? (isGymMode ? 'btn-danger' : 'btn-primary') : 'btn-outline'}`} 
              style={{ 
                padding: '0.5rem 1rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                background: meal.stock > 0 && isGymMode ? '#ea580c' : undefined,
                borderColor: meal.stock > 0 && isGymMode ? '#ea580c' : undefined,
                opacity: meal.stock > 0 ? 1 : 0.6,
                cursor: meal.stock > 0 ? 'pointer' : 'not-allowed'
              }}
              onClick={() => meal.stock > 0 && addToCart(meal._id, 1)}
              disabled={meal.stock <= 0}
            >
              {meal.stock > 0 ? <><Plus size={16} /> Add</> : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Extreme Introspection Modal Overlay */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }} onClick={() => setShowModal(false)}>
          <div style={{ width: '90%', maxWidth: '550px', backgroundColor: 'var(--surface)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
              <X size={20} color="#0f172a" />
            </button>

            <img src={meal.image} alt={meal.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-main)' }}>{meal.name}</h2>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>₹{meal.price.toFixed(2)}</div>
              </div>

              {meal.dietTags && meal.dietTags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  {meal.dietTags.map((tag, i) => (
                    <span key={i} style={{ background: 'var(--primary)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>#{tag}</span>
                  ))}
                </div>
              )}

              {/* Macroscopic Grid Mathematics */}
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}><Activity size={18} color="var(--primary)" /> Nutritional Parameters</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                 <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.2rem' }}>CALORIES</div>
                   <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>{meal.calories}</div>
                 </div>
                 <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.2rem' }}>PROTEIN</div>
                   <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ea580c' }}>{meal.protein}g</div>
                 </div>
                 <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.2rem' }}>CARBS</div>
                   <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#3b82f6' }}>{meal.carbs || 0}g</div>
                 </div>
                 <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.2rem' }}>FATS</div>
                   <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#eab308' }}>{meal.fats || 0}g</div>
                 </div>
              </div>

              {/* Absolute Transparency Matrix */}
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <span style={{ fontWeight: '700', display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Raw Ingredients Mapping:</span>
                  <p style={{ lineHeight: '1.5', color: 'var(--text-muted)' }}>{meal.ingredients?.length > 0 ? meal.ingredients.join(', ') : 'Proprietary Blend'}</p>
                </div>
                <div className="flex justify-between items-center" style={{ borderTop: '2px dashed var(--border)', paddingTop: '1rem' }}>
                   <div className="flex items-center gap-2" title="Cooking Oil Parameter">
                     <Droplet size={18} color="#eab308" />
                     <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{meal.oilType || 'Standard'}</span>
                   </div>
                   <div className="flex items-center gap-2" title="Sugar Content Level">
                     <Candy size={18} color="#d946ef" />
                     <span style={{ fontWeight: '600', color: 'var(--text-main)', textTransform: 'capitalize' }}>{meal.sugarLevel || 'Unknown'} Sugar</span>
                   </div>
                </div>
              </div>

              <button 
                className={`btn ${meal.stock > 0 ? 'btn-primary' : 'btn-outline'}`} 
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', opacity: meal.stock > 0 ? 1 : 0.6, cursor: meal.stock > 0 ? 'pointer' : 'not-allowed' }}
                onClick={() => {
                  if(meal.stock > 0) {
                    addToCart(meal._id, 1);
                    setShowModal(false);
                  }
                }}
              >
                {meal.stock > 0 ? <><Plus size={20} /> Add to Cart Payload</> : 'Awaiting Inventory Restock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MealCard;
