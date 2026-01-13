import React from 'react';
import { FaTimes, FaStar, FaRegStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductModal = ({ product, isOpen, onClose, onBuyNow }) => {
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Product Details</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-200 ${isDark ? 'hover:bg-gray-700 text-white' : 'text-black'}`}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image/Video */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden">
              {product.video ? (
                <video
                  src={product.video}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  controls
                />
              ) : (
                <img
                  src={product.img || product.image}
                  alt={product.title || product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>ESPEJO</p>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-4`}>
                {product.title || product.name || 'Product'}
              </h3>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex text-yellow-400 text-lg">
                {Array.from({ length: 5 }).map((_, i) =>
                  i < Math.floor(product.rating || 5) ? (
                    <FaStar key={i} />
                  ) : (
                    <FaRegStar key={i} />
                  )
                )}
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {product.oldPrice && (
                <p className={`text-lg line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {product.oldPrice}
                </p>
              )}
              <p className="text-3xl font-bold text-[#862b2a]">
                {product.newPrice || product.price}
              </p>
            </div>

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Brand</p>
                <p className="font-semibold text-[#862b2a]">ESPEJO</p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Warranty</p>
                <p className="font-semibold text-[#862b2a]">5 Years</p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Material</p>
                <p className="font-semibold text-[#862b2a]">Premium Glass</p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Features</p>
                <p className="font-semibold text-[#862b2a]">LED Backlit</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'} mb-3`}>Description</h4>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                {product.description || 'Premium quality mirror with LED backlighting and modern design. Perfect for bathrooms, bedrooms, and dressing areas. Features energy-efficient LED lights and durable construction.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => {
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist(product);
                  }
                }}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 text-white border-red-500'
                    : `border-gray-300 ${isDark ? 'text-white hover:bg-gray-700' : 'text-black hover:bg-gray-100'}`
                }`}
              >
                <FaHeart size={20} />
              </button>
              
              <button
                onClick={() => onBuyNow && onBuyNow(product)}
                className="flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors"
                style={{ backgroundColor: '#898383' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#6b6161'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#898383'}
              >
                Buy Now
              </button>
              
              <button
                onClick={() => addToCart(product)}
                className="flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2"
                style={{ backgroundColor: '#862b2a' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#6b1f1e'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#862b2a'}
              >
                <FaShoppingCart size={16} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;