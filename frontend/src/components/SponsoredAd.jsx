import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Zap } from 'lucide-react';

export default function SponsoredAd({ className = "" }) {
  const [isVisible, setIsVisible] = useState(true);

  // Automatically make the ad reappear 20 seconds after closing
  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 20000); // 20,000 ms = 20 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`relative w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-3xl overflow-hidden shadow-lg border border-gray-700 flex flex-col md:flex-row items-center justify-between p-6 md:p-8 ${className}`}>
      {/* Ad Tag */}
      <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-gray-300 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
        Sponsored
      </div>
      
      {/* Close Button */}
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors bg-black/50 p-1.5 rounded-full"
      >
        <X size={16} />
      </button>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center gap-6 mt-4 md:mt-0 w-full md:w-auto">
        <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-white rounded-2xl p-1 shadow-inner flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=400" 
            alt="Avvatar Whey Protein" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="text-center md:text-left flex-1 md:max-w-xl">
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight mb-2 flex items-center justify-center md:justify-start gap-2">
            Avvatar Premium Whey <Zap className="text-yellow-400" fill="currentColor" size={20} />
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Maximize your gains with India's freshest 100% vegetarian whey protein. <span className="text-white font-bold">Get a flat 15% OFF</span> exclusively for VitaEats members!
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6 md:mt-0 w-full md:w-auto">
        <button className="w-full md:w-auto bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
          Claim Offer <ExternalLink size={18} />
        </button>
      </div>
    </div>
  );
}
