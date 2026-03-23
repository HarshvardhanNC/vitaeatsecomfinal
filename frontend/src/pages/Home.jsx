import { useState, useEffect } from 'react';
import axios from 'axios';
import MealCard from '../components/MealCard';

const Home = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isGymMode, setIsGymMode] = useState(false);

  const medicalConditions = ["Heart-friendly", "Diabetes Safe", "Low Sodium", "Keto", "High Protein", "Vegan", "Gluten-Free"];

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const queryString = selectedTags.length > 0 ? `?dietTags=${selectedTags.join(',')}` : '';
        const { data } = await axios.get(`/api/meals${queryString}`);
        setMeals(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meals', error);
        setLoading(false);
      }
    };

    fetchMeals();
  }, [selectedTags]);

  const sortedMeals = isGymMode ? [...meals].sort((a, b) => b.protein - a.protein) : meals;

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', color: isGymMode ? '#ea580c' : 'var(--text-main)' }}>
          {isGymMode ? 'MAXIMIZE YOUR GAINS.' : 'Discover Healthy & Delicious Meals'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', marginBottom: '2.5rem' }}>
          {isGymMode ? 'Scientifically filtered high-protein modules built specifically for advanced muscular hypertrophy and athletic recovery.' : 'Order fresh, chef-prepared meals delivered straight to your door. Fuel your body with the nutrients it deserves.'}
        </p>

        {/* Control Center */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            
            {/* Gym Mode Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: isGymMode ? '#fff7ed' : 'var(--surface)', padding: '0.8rem 2rem', borderRadius: '30px', border: `2px solid ${isGymMode ? '#fdba74' : 'var(--border)'}`, transition: 'all 0.3s' }}>
              <span style={{ fontWeight: '700', fontSize: '1.1rem', color: isGymMode ? '#ea580c' : 'var(--text-muted)' }}>GYM MODE</span>
              <button 
                onClick={() => setIsGymMode(!isGymMode)}
                style={{
                  width: '60px', height: '30px', borderRadius: '30px', background: isGymMode ? '#ea580c' : '#cbd5e1', position: 'relative', border: 'none', cursor: 'pointer', transition: 'background 0.3s'
                }}
              >
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: isGymMode ? '33px' : '3px', transition: 'left 0.3s' }}></div>
              </button>
            </div>

            {/* Medical Filters */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.8rem', padding: '1rem', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', marginRight: '1rem', color: 'var(--text-main)' }}>Medical Filters:</span>
              {medicalConditions.map(tag => (
                <button 
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{ 
                    padding: '0.4rem 1rem', 
                    borderRadius: '20px', 
                    border: 'none', 
                    fontWeight: '500', 
                    transition: 'all 0.2s',
                    backgroundColor: selectedTags.includes(tag) ? 'var(--primary)' : '#e2e8f0',
                    color: selectedTags.includes(tag) ? 'white' : 'var(--text-main)',
                    cursor: 'pointer'
                  }}
                >
                  {selectedTags.includes(tag) ? '✓ ' : ''}{tag}
                </button>
              ))}
            </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading structural inventory...</div>
      ) : (
        <div className="grid-meals">
          {sortedMeals.map((meal) => (
            <MealCard key={meal._id} meal={meal} isGymMode={isGymMode} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
