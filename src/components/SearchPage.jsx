import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { FaHeart } from 'react-icons/fa';
import PageLoader from './PageLoader';

const SearchPage = ({ onBuyNow }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  // All products data for search
  const allProducts = [
    // Card products
    { id: 1, title: "Self Standing Mirror with Base", price: "₹39,045.00", oldPrice: "₹41,100.00", video: "https://cdn.shopify.com/videos/c/o/v/ddc73a68333a46f18e5de01165aa2657.mp4", category: "Standing Mirror" },
    { id: 2, title: "Round LED Premium Mirror", price: "₹18,999.00", oldPrice: "₹23,500.00", video: "https://cdn.shopify.com/videos/c/o/v/8889764b88b14ea981c7bc32cff15f09.mp4", category: "LED Mirror" },
    { id: 3, title: "Designer LED Vanity Mirror", price: "₹24,050.00", oldPrice: "₹27,100.00", video: "https://cdn.shopify.com/videos/c/o/v/73d57a6c4a694933b23ec33481c180a2.mp4", category: "Vanity Mirror" },
    { id: 4, title: "Full Height Standing Mirror", price: "₹34,999.00", oldPrice: "₹39,000.00", video: "https://cdn.shopify.com/videos/c/o/v/ab7450779dac4e558d214e7906c4ddca.mp4", category: "Standing Mirror" },
    { id: 5, title: "Premium Wall LED Mirror", price: "₹12,450.00", oldPrice: "₹15,000.00", video: "https://cdn.shopify.com/videos/c/o/v/58aa76a1fbd749a6ac31179cb3808bfd.mp4", category: "LED Mirror" },
    
    // BestSeller products
    { id: 9, title: "Capsule Shaped LED Mirror with Backlit", price: "₹5,662.00", oldPrice: "Rs. 5,960.00", img: "https://www.glazonoid.com/cdn/shop/products/Ovid-1_600x.jpg?v=1703566479", category: "LED Mirror" },
    { id: 10, title: "Pebble-Shaped Mirror With Lights", price: "₹7,077.50", oldPrice: "Rs. 7,450.00", img: "https://www.glazonoid.com/cdn/shop/products/Ovid-1_600x.jpg?v=1703566479", category: "LED Mirror" },
    { id: 11, title: "Double Door Cabinets | Matt Black Finish", price: "₹19,760.00", oldPrice: "Rs. 20,800.00", img: "https://www.glazonoid.com/cdn/shop/files/doubledoor2_1_600x.webp?v=1742384394", category: "Cabinet" },
    { id: 12, title: "Elegant Border Design Mirror With Lights", price: "₹7,077.50", oldPrice: "Rs. 7,450.00", img: "https://www.glazonoid.com/cdn/shop/files/doubledoor2_1_600x.webp?v=1742384394", category: "LED Mirror" },
    
    // Metal Mirror products
    { id: 17, title: "Antique Brass Round Metal Mirror", price: "₹8,999.00", oldPrice: "₹12,500.00", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", category: "Metal Mirror" },
    { id: 18, title: "Industrial Black Metal Frame Mirror", price: "₹6,750.00", oldPrice: "₹9,000.00", img: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", category: "Metal Mirror" },
    { id: 19, title: "Gold Decorative Metal Mirror", price: "₹11,250.00", oldPrice: "₹15,000.00", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", category: "Metal Mirror" },
    { id: 20, title: "Copper Vintage Metal Mirror", price: "₹9,500.00", oldPrice: "₹13,200.00", img: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", category: "Metal Mirror" },
  ];

  useEffect(() => {
    setLoading(true);
    
    if (query.trim()) {
      const results = allProducts.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
    
    setLoading(false);
  }, [query]);

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-white text-black'} min-h-screen transition-colors duration-200`}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search Results</h1>
          {query && (
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {loading ? 'Searching...' : `Found ${searchResults.length} results for "${query}"`}
            </p>
          )}
        </div>

        {loading ? (
          <PageLoader />
        ) : searchResults.length === 0 ? (
          <div className="text-center py-20">
            <div className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              {query ? `No results found for "${query}"` : 'Enter a search term to find products'}
            </div>
            <p className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Try searching for: LED Mirror, Metal Mirror, Standing Mirror, Cabinet</p>
          </div>
        ) : (
          <div className={`${searchResults.length > 4 ? 'flex overflow-x-auto gap-8 pb-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'}`} style={searchResults.length > 4 ? {scrollbarWidth: 'none', msOverflowStyle: 'none'} : {}} onScroll={(e) => e.target.style.setProperty('--webkit-scrollbar', 'none')}>
            {searchResults.map((product) => (
              <div 
                key={product.id} 
                onClick={() => navigate(`/product/${product.id}`)}
                className={`${isDark ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg overflow-hidden transition-colors cursor-pointer ${searchResults.length > 4 ? 'min-w-[350px] flex-shrink-0' : ''}`}
              >
                <div className="relative">
                  {product.video ? (
                    <video
                      src={product.video}
                      className="w-full h-48 object-cover"
                      autoPlay
                      loop
                      muted
                    />
                  ) : (
                    <img
                      src={product.img}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    {product.category}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
                    }}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                      isInWishlist(product.id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <FaHeart size={14} />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-3 line-clamp-2">{product.title}</h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl font-bold text-orange-500">{product.price}</span>
                    <span className="text-gray-400 line-through text-sm">{product.oldPrice}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuyNow && onBuyNow(product);
                      }}
                      className="flex-1 text-white py-2 rounded font-semibold transition-colors text-sm"
                      style={{backgroundColor: '#898383'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#6b6161'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#898383'}
                    >
                      Buy Now
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="flex-1 text-white py-2 rounded font-semibold transition-colors text-sm"
                      style={{backgroundColor: '#862b2a'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#6b1f1e'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#862b2a'}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;