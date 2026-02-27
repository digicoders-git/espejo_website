import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart, FaCheck, FaStar } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

import ProductService from "../services/ProductService";

const Card = ({ onBuyNow }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [buyingNow, setBuyingNow] = useState({});

  const handleBuyNow = async (product) => {
    setBuyingNow(prev => ({ ...prev, [product.id]: 'loading' }));
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first to place an order!');
      setBuyingNow(prev => ({ ...prev, [product.id]: null }));
      return;
    }
    
    try {
      const addToCartPayload = {
        productId: product.id,
        quantity: 1
      };
      
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const cartResponse = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(addToCartPayload)
      });
      
      if (cartResponse.ok) {
        setBuyingNow(prev => ({ ...prev, [product.id]: 'success' }));
        setTimeout(() => {
          navigate('/checkout');
        }, 500);
      } else {
        const error = await cartResponse.json();
        toast.error('Failed to add product to cart');
        setBuyingNow(prev => ({ ...prev, [product.id]: null }));
      }
      
    } catch (error) {
      toast.error('Network error. Please try again.');
      setBuyingNow(prev => ({ ...prev, [product.id]: null }));
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getFeaturedProducts(12);
        
        if (response.success && response.products.length > 0) {
          const mappedProducts = response.products.map(p => ({
            id: p.id,
            img: p.image,
            title: p.name,
            price: typeof p.price === 'number' ? `₹${p.price.toLocaleString("en-IN")}` : p.price,
            oldPrice: p.originalPrice ? `₹${p.originalPrice.toLocaleString("en-IN")}` : "",
            isBestSeller: p.isBestSeller
          }));

          setProducts(mappedProducts);
        }
      } catch (error) {
        // console.error("Card product fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div
        className={`p-5 text-center ${
          isDark ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        Loading products...
      </div>
    );
  }

  return (
    <div className={`p-5 ${isDark ? "bg-black" : "bg-white"} transition-colors duration-200`}>
      <div className={`${products.length > 4 ? 'flex overflow-x-auto gap-6 pb-4' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'}`} style={products.length > 4 ? {scrollbarWidth: 'none', msOverflowStyle: 'none'} : {}} onScroll={(e) => e.target.style.setProperty('--webkit-scrollbar', 'none')}>
        {products.map((item, i) => (
          <div
            key={item.id || i}
            onClick={() => navigate(`/product/${item.id}`)}
            className={`rounded-xl overflow-hidden shadow-lg flex flex-col cursor-pointer transition-all duration-300 hover:shadow-2xl ${
              isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
            } ${products.length > 4 ? 'min-w-[300px] flex-shrink-0' : ''}`}
          >
            {/* IMAGE AREA */}
            <div className="relative">
              {/* BEST SELLER TAG */}
              {item.isBestSeller && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md bg-[#a76665] text-white">
                    <FaStar size={8} />
                    Best Seller
                  </span>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isInWishlist(item.id)
                    ? removeFromWishlist(item.id)
                    : addToWishlist(item);
                }}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-20 ${
                  isInWishlist(item.id)
                    ? "bg-red-500 text-white shadow-lg"
                    : isDark 
                      ? "bg-gray-800/80 text-white hover:bg-red-500" 
                      : "bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white"
                }`}
              >
                <FaHeart size={14} />
              </button>

              <img
                src={item.img}
                alt={item.title}
                className="w-full h-[300px] object-cover"
                onError={(e) => (e.target.src = "https://via.placeholder.com/400x300")}
              />
            </div>

            {/* DETAILS AREA */}
            <div className="p-4 flex-1 flex flex-col">
              <p className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                ESPEJO PREMIUM
              </p>
              
              <h3 className={`font-bold text-sm mb-2 line-clamp-2 flex-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                {item.title}
              </h3>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-[#a76665]">{item.price}</span>
                  {item.oldPrice && (
                    <span className={`text-xs line-through ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                      {item.oldPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    setBuyingNow(prev => ({ ...prev, [item.id]: 'loading' }));
                    await handleBuyNow(item);
                  }}
                  className="flex-1 text-white py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-wide flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#898383" }}
                  disabled={buyingNow[item.id]}
                >
                  {buyingNow[item.id] === 'loading' && <ImSpinner8 className="animate-spin" size={12} />}
                  {buyingNow[item.id] === 'success' && <FaCheck size={12} />}
                  {!buyingNow[item.id] && 'Buy Now'}
                </button>

                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    setAddingToCart(prev => ({ ...prev, [item.id]: 'loading' }));
                    await addToCart(item);
                    setAddingToCart(prev => ({ ...prev, [item.id]: 'success' }));
                    setTimeout(() => {
                      setAddingToCart(prev => ({ ...prev, [item.id]: null }));
                    }, 1500);
                  }}
                  className="flex-1 text-white py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-wide flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#a76665" }}
                  disabled={addingToCart[item.id]}
                >
                  {addingToCart[item.id] === 'loading' && <ImSpinner8 className="animate-spin" size={12} />}
                  {addingToCart[item.id] === 'success' && <FaCheck size={12} />}
                  {!addingToCart[item.id] && 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
