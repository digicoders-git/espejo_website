import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import {
  FaArrowLeft,
  FaTrash,
  FaShoppingCart,
  FaTrashAlt,
  FaEye
} from 'react-icons/fa';
import { showSuccess, showCart } from '../components/CustomLoader';

const WishlistPage = ({ onBuyNow }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  // ✅ SAFETY LAYER (MOST IMPORTANT FIX)
  const items = Array.isArray(wishlistItems)
    ? wishlistItems
    : wishlistItems?.items || wishlistItems?.wishlist || [];

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      } transition-colors duration-200`}
    >
      <div className="max-w-6xl mx-auto p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-2xl hover:text-orange-500"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
                  clearWishlist();
                  showSuccess('Wishlist cleared successfully!');
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <FaTrashAlt size={14} /> Clear All
            </button>
          )}
        </div>

        {/* EMPTY STATE */}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p
              className={`text-xl ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              } mb-4`}
            >
              Your wishlist is empty
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#862b2a] hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div
            className={
              items.length > 4
                ? 'flex overflow-x-auto gap-8 pb-4'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
            }
          >
            {items.map((item) => (
              <div
                key={item.id}
                className={`${
                  isDark
                    ? 'bg-gray-900 hover:bg-gray-800'
                    : 'bg-gray-100 hover:bg-gray-200'
                } rounded-lg overflow-hidden transition-colors group ${
                  items.length > 4 ? 'min-w-[350px] flex-shrink-0' : ''
                }`}
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.img || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold flex-1 pr-4">
                      {item.title || item.name}
                    </h3>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xl font-bold text-orange-500">
                      {item.price}
                    </span>
                    {item.oldPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        {item.oldPrice}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/product/${item.id}`)}
                      className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 ${
                        isDark
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white transition-colors`}
                    >
                      <FaEye size={14} /> View Details
                    </button>

                    <div className="flex gap-3">
                      <button
                        onClick={() => onBuyNow && onBuyNow(item)}
                        className="flex-1 text-white py-3 rounded-lg font-semibold text-sm transition-colors hover:opacity-90"
                        style={{ backgroundColor: '#898383' }}
                      >
                        Buy Now
                      </button>

                      <button
                        onClick={() => {
                          addToCart(item);
                          removeFromWishlist(item.id);
                          showCart('Item moved to cart!');
                        }}
                        className="flex-1 text-white py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:opacity-90"
                        style={{ backgroundColor: '#862b2a' }}
                      >
                        <FaShoppingCart size={14} /> Add to Cart
                      </button>
                    </div>
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

export default WishlistPage;
