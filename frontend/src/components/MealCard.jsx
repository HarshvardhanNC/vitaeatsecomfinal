import React, { useState } from 'react';
import Button from './Button';
import { Leaf, Flame, Star, Sparkles, ChefHat, AlertCircle } from 'lucide-react';

export default function MealCard({ meal, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  // Safe defaults if dummy data is missing fields
  const image = meal?.image || 'https://via.placeholder.com/400x300?text=Meal';
  const name = meal?.name || 'Delicious Meal';
  const price = meal?.price || '9.99';
  const calories = meal?.calories || '450';
  const protein = meal?.protein || '25g';
  const stock = meal?.stock;

  // Premium, emoji-free promotional logic
  const getPromoLogic = (nameStr) => {
    if (!nameStr) return null;
    const len = nameStr.length;
    if (len % 3 === 0) return { text: 'BESTSELLER', type: 'bestseller' };
    if (len % 7 === 0) return { text: "TODAY'S SPECIAL", type: 'special' };
    if (len % 5 === 0) return { text: 'CHEF RECOMMENDED', type: 'chef' };
    return null; 
  };
  const promo = getPromoLogic(name);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-50 group flex flex-col h-full">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Marketing / Stock Badges (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-2 z-10">
          {stock !== undefined && stock > 0 && stock <= 5 && (
            <div className="bg-red-600/95 backdrop-blur-md text-white px-3 py-1.5 rounded-sm text-[10px] font-bold shadow-sm tracking-wider flex items-center gap-1.5 uppercase">
              <AlertCircle size={12} /> Only {stock} Left
            </div>
          )}
          {stock === 0 && (
            <div className="bg-gray-900/95 backdrop-blur-md text-gray-100 px-3 py-1.5 rounded-sm text-[10px] font-bold shadow-sm tracking-wider uppercase">
              Sold Out
            </div>
          )}
          {(!(stock <= 5) && promo) && (
            <div className={`backdrop-blur-md text-white px-3 py-1.5 rounded-sm text-[10px] font-bold shadow-sm tracking-wider flex items-center gap-1.5 uppercase
              ${promo.type === 'bestseller' ? 'bg-[#D4AF37]/90' : ''} 
              ${promo.type === 'special' ? 'bg-primary/95 text-green-50' : ''}
              ${promo.type === 'chef' ? 'bg-[#2C3E50]/95' : ''}
            `}>
              {promo.type === 'bestseller' && <Star size={12} fill="currentColor" />}
              {promo.type === 'special' && <Sparkles size={12} />}
              {promo.type === 'chef' && <ChefHat size={12} />}
              {promo.text}
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-primary shadow-sm flex items-center gap-1 z-10">
          <Flame size={14} className="text-orange-500" /> {calories} kcal
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 leading-tight block">{name}</h3>
          <span className="font-bold text-lg text-primary">₹{price}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-5 gap-1.5">
          <Leaf size={14} className="text-accent" />
          <span>{protein} Protein</span>
        </div>
        
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1 border border-gray-100">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-500 hover:text-primary hover:shadow-sm font-bold transition-all"
            >
              -
            </button>
            <span className="font-bold text-gray-900 w-8 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-500 hover:text-primary hover:shadow-sm font-bold transition-all"
            >
              +
            </button>
          </div>
          <Button 
            variant="primary" 
            className={`w-full flex items-center justify-center gap-2 ${stock === 0 ? 'bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed border-none shadow-none' : ''}`} 
            onClick={() => {
              if (onAddToCart && stock !== 0) {
                onAddToCart(meal, quantity);
                setQuantity(1); // Reset after adding
              }
            }}
          >
            {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
