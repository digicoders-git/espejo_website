import React, { useState } from 'react';
import { FaStar, FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductQuickView from './ProductQuickView';

const ProductCard = ({ product, onClick, isDark, showActions = true, size = 'medium', enableQuickView = true }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        title: product.name || product.title,
        price: product.price,
        img: product.image || product.img
      });
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      img: product.image || product.img,
      quantity: 1
    });
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (enableQuickView) {
      setShowQuickView(true);
    } else {
      onClick?.(product);
    }
  };

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (!product.originalPrice) return 0;
    const original = parseFloat(product.originalPrice.replace(/[₹,]/g, ''));
    const current = parseFloat(product.price.replace(/[₹,]/g, ''));
    return Math.round(((original - current) / original) * 100);
  };

  const discountPercent = getDiscountPercentage();

  // Size variants
  const sizeClasses = {
    small: 'w-full max-w-xs',
    medium: 'w-full',
    large: 'w-full max-w-sm'
  };

  return (
    <>
      <div
        onClick={onClick}
        className={`${sizeClasses[size]} ${isDark ? 'bg-gray-900 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'} rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative`}
      >
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discountPercent}% OFF
            </span>
            {/* Offer Badge */}
            {product.offer && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                {product.offer.code} APPLIED
              </span>
            )}
          </div>
        )}
        {!discountPercent && product.offer && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
              {product.offer.code} APPLIED
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        {showActions && (
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 ${
              isInWishlist(product.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <FaHeart size={14} />
          </button>
        )}

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image || product.img}
            alt={product.name || product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => e.target.src = 'https://via.placeholder.com/300x300'}
          />
          
          {/* Hover Actions */}
          {showActions && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <button
                onClick={handleViewDetails}
                className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="View Details"
              >
                <FaEye size={16} />
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-[#862b2a] text-white p-2 rounded-full hover:bg-[#6b1f1e] transition-colors"
                title="Add to Cart"
              >
                <FaShoppingCart size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="font-semibold mb-2 line-clamp-2 text-sm md:text-base">
            {product.name || product.title}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'} 
                  size={12} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviews || 0})
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-[#862b2a] text-lg">
              {typeof product.price === 'string' ? product.price : `₹${product.price}`}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {typeof product.originalPrice === 'string' ? product.originalPrice : `₹${product.originalPrice}`}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${
              product.inStock !== false ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={`text-xs font-medium ${
              product.inStock !== false ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.inStock === false}
                className="flex-1 bg-[#862b2a] hover:bg-[#6b1f1e] text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaShoppingCart size={12} />
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {enableQuickView && (
        <ProductQuickView
          productId={product.id}
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
};

export default ProductCard;