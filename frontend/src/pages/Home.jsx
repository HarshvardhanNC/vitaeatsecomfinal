import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import MealCard from '../components/MealCard';
import { ArrowRight, Leaf, TrendingDown, Target, Check, Star, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const reviews = [
  { name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: 'The Quinoa Salad Bowl is absolutely divine! Fresh, filling and I lost 3kg in a month eating VitaEats regularly. Highly recommend!', avatar: 'PS' },
  { name: 'Rohan Mehta', location: 'Pune', rating: 5, text: 'Finally a meal service that actually delivers on taste AND nutrition. The High-Protein Chicken Bowl is my go-to after gym.', avatar: 'RM' },
  { name: 'Ananya Iyer', location: 'Bangalore', rating: 5, text: 'Switched from junk food to VitaEats 2 months ago and I feel amazing. The portion sizes are generous and flavors are incredible!', avatar: 'AI' },
  { name: 'Vikram Patel', location: 'Ahmedabad', rating: 4, text: 'Great quality food. The ingredients are always fresh and the packaging is eco-friendly. Love the meal plan options!', avatar: 'VP' },
  { name: 'Kavya Nair', location: 'Chennai', rating: 5, text: 'Best healthy food delivery in the city. My entire family loves the Teriyaki Chicken Bowl. Will keep ordering!', avatar: 'KN' },
  { name: 'Arjun Singh', location: 'Delhi', rating: 5, text: 'Used the HEALTHY20 coupon on my first order — amazing discount. The food quality matched every 5-star review I read!', avatar: 'AS' },
];

export default function Home() {
  const { user } = useContext(AuthContext);
  const [featuredMeals, setFeaturedMeals] = React.useState([]);
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false); // Can fetch exactly via /api/users/profile if needed
  const scrollRef = React.useRef(null);

  // Sync newsletter state if user object changes
  React.useEffect(() => {
    if (user && user.isSubscribedToNewsletter !== undefined) {
      setIsSubscribed(user.isSubscribedToNewsletter);
    }
  }, [user]);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      const emailToUse = user ? user.email : newsletterEmail;
      const action = user ? !isSubscribed : true; 
      const res = await axios.post('/api/users/newsletter', { email: emailToUse, subscribe: action });
      alert(res.data.message);
      if (user) setIsSubscribed(action);
      else setNewsletterEmail(''); // clear form for guests
    } catch (err) {
      alert(err.response?.data?.message || 'Error executing request.');
    }
  };

  React.useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get('/api/meals');
        if (data && data.length > 0) {
          setFeaturedMeals(data.slice(0, 3));
        } else {
          throw new Error("Empty DB");
        }
      } catch (err) {
        console.warn('Backend unavailable, loading local featured meals.');
        const fallbackMeals = [
          { _id: '64a2f8b5f3d4b6c8a291f0c1', name: 'Grilled Salmon Bowl', calories: 420, price: 14.99, protein: 35, category: 'High Protein', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800' },
          { _id: '64a2f8b5f3d4b6c8a291f0c2', name: 'High-Protein Quinoa Salad', calories: 380, price: 11.50, protein: 22, category: 'Weight Loss', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800' },
          { _id: '64a2f8b5f3d4b6c8a291f0c3', name: 'Teriyaki Chicken & Broccoli', calories: 510, price: 13.00, protein: 40, category: 'High Protein', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=800' },
        ];
        setFeaturedMeals(fallbackMeals);
      }
    };
    fetchFeatured();
  }, []);

  // Auto-scroll reviews by 1 card every 4 seconds (LEFT TO RIGHT)
  React.useEffect(() => {
    // Initial jump to the middle of the duplicated sets so we have space to scroll left
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const itemWidth = scrollRef.current.children[0].offsetWidth + 24;
      // Start aligned at the 12th card (start of the 3rd review set)
      scrollRef.current.scrollTo({ left: itemWidth * 12, behavior: 'auto' });
    }

    const timer = setInterval(() => {
      if (scrollRef.current && scrollRef.current.children.length > 0) {
        const { scrollLeft, children } = scrollRef.current;
        const itemWidth = children[0].offsetWidth + 24; // 24px is gap-6
        
        // Loop back seamlessly if we get too close to the left edge
        if (scrollLeft <= itemWidth) {
          // Snap back to the 12th card instantly
          scrollRef.current.scrollTo({ left: itemWidth * 12, behavior: 'auto' });
          setTimeout(() => {
            scrollRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
          }, 50);
        } else {
          scrollRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollNext = () => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.children[0].offsetWidth + 24;
      scrollRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.children[0].offsetWidth + 24;
      scrollRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    }
  };

  const categories = [
    { name: 'High Protein', icon: <Target className="text-primary w-8 h-8" />, desc: 'Build muscle with 30g+ protein meals' },
    { name: 'Weight Loss', icon: <TrendingDown className="text-accent w-8 h-8" />, desc: 'Low calorie, high volume portions' },
    { name: 'Healthy Snacks', icon: <Leaf className="text-green-500 w-8 h-8" />, desc: 'Guilt-free treats for your cravings' }
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] sm:h-[700px] flex items-center bg-gradient-to-br from-green-50 to-white overflow-hidden rounded-b-[3rem] sm:rounded-b-[5rem] shadow-sm mb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-green-100 text-primary text-sm font-bold tracking-wide mb-6">
              <Check size={16} /> 100% Organic Ingredients
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Healthy Food That <br/><span className="text-primary">Actually Tastes Good.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Chef-crafted, nutritionist-approved meals delivered right to your door. Fuel your life with premium ingredients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/menu">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-green-900/20 group">
                  Order Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
              <Link to="/subscription">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto bg-white border border-gray-200">
                  Meal Plans
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform scale-75 animate-pulse"></div>
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800" 
              alt="Fresh salad bowl" 
              className="relative z-10 w-full max-w-lg mx-auto rounded-full shadow-2xl border-white border-8 animate-[spin_40s_linear_infinite]"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Focus On Your Goals</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">We've categorized our menu to help you hit your macros easily.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group cursor-pointer">
              <div className="w-16 h-16 mx-auto bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{cat.name}</h3>
              <p className="text-gray-500">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Meals Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full bg-gray-50/50 rounded-3xl mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Popular Dishes</h2>
            <p className="text-gray-500 text-lg">Our community's favorite healthy meals.</p>
          </div>
          <Link to="/menu">
            <Button variant="outline" className="rounded-full">View Full Menu</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredMeals.length > 0 ? (
            featuredMeals.map(meal => (
              <MealCard key={meal._id} meal={meal} onAddToCart={() => window.location.href = '/menu'} />
            ))
          ) : (
            <div className="text-center col-span-3 py-10 text-gray-400">Loading popular dishes...</div>
          )}
        </div>
      </section>

      {/* Customer Reviews Carousel */}
      <section className="py-20 w-full bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold tracking-wide mb-4">
              <Star size={14} className="fill-yellow-400 text-yellow-400" /> Trusted by 5,000+ Customers
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Real reviews from people who eat VitaEats every day.</p>
          </div>

          <div className="relative w-full">
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pt-4 pb-8 no-scrollbar scroll-smooth"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {/* Output multiple arrays of reviews to ensure smooth infinite looping layout */}
              {[...reviews, ...reviews, ...reviews, ...reviews].map((review, idx) => (
                <div 
                  key={idx} 
                  className="snap-start flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333333%-16px)] bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-transform duration-300 flex flex-col gap-4 transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-gray-200" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic">"{review.text}"</p>
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-extrabold flex-shrink-0">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-6 mt-4">
              <button
                onClick={scrollPrev}
                className="w-12 h-12 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-green-50 hover:border-primary hover:text-primary transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={scrollNext}
                className="w-12 h-12 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-green-50 hover:border-primary hover:text-primary transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 w-full bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-149883716733f-a5189f10f44c?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">Join the VitaEats Family</h2>
          <p className="text-green-50 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive discounts, healthy recipes, and the latest menu updates!
          </p>
          <form 
            onSubmit={handleNewsletterSubmit} 
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          >
            {user ? (
              <div className="flex-1 flex items-center justify-between px-6 py-4 rounded-full bg-white text-gray-900 font-bold shadow-inner">
                <span className="flex items-center gap-2 truncate max-w-[180px] sm:max-w-xs"><Mail className="text-gray-400 flex-shrink-0" size={18} /> <span className="truncate">{user.email}</span></span>
                <span className={`text-[10px] sm:text-xs uppercase font-extrabold tracking-widest px-3 py-1.5 flex-shrink-0 rounded-full ${isSubscribed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {isSubscribed ? 'Subscribed' : 'Not Subscribed'}
                </span>
              </div>
            ) : (
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required 
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-full text-gray-900 bg-white border-none focus:outline-none focus:ring-4 focus:ring-green-300 font-medium text-lg"
              />
            )}
            
            <Button type="submit" variant="none" className={`px-8 py-4 rounded-full text-lg font-bold border-none transition-all shadow-xl flex-shrink-0 ${user && isSubscribed ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-900 hover:bg-black text-white'}`}>
              {user && isSubscribed ? 'Unsubscribe' : 'Subscribe Now'}
            </Button>
          </form>
          <p className="text-green-200 text-sm mt-4 font-medium">We respect your privacy. No spam, ever.</p>
        </div>
      </section>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

    </div>
  );
}
