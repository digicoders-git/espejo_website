import React, { useState } from 'react';
import { FaTimes, FaHeart, FaCheck, FaStar, FaRegStar } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductDetailModal = ({ product, isOpen, onClose, onBuyNow }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen || !product) return null;

  const handleBuyNow = async () => {
    setBuyingNow(true);
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first to place an order!');
      setBuyingNow(false);
      return;
    }
    
    try {
      const addToCartPayload = {
        productId: product.id,
        quantity: 1
      };
      
      const cartResponse = await fetch('https://glassadminpanelapi.onrender.com/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(addToCartPayload)
      });
      
      if (cartResponse.ok) {
        onClose();
        navigate('/checkout');
      } else {
        toast.error('Failed to add product to cart');
      }
      
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setBuyingNow(false);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await addToCart(product);
    setAddingToCart(false);
  };

  const images = product.images || [product.img];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'} rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Product Details</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-100 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Images */}
            <div>
              <div className="mb-4">
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-lg"
                  onError={(e) => e.target.src = "https://via.placeholder.com/400x400"}
                />
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                        selectedImage === index ? 'border-[#862b2a]' : 'border-gray-300'
                      }`}
                      onClick={() => setSelectedImage(index)}
                      onError={(e) => e.target.src = "https://via.placeholder.com/80x80"}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="text-sm text-[#862b2a] font-semibold">ESPEJO</span>
                <h1 className="text-3xl font-bold mt-2">{product.title}</h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    i < 4 ? <FaStar key={i} /> : <FaRegStar key={i} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(4.0) 25 reviews</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                {product.oldPrice && (
                  <p className="text-lg line-through text-gray-400">{product.oldPrice}</p>
                )}
                <p className="text-3xl font-bold text-[#862b2a]">{product.price}</p>
                {product.oldPrice && (
                  <p className="text-sm text-green-600 font-semibold">
                    Save {Math.round(((parseFloat(product.oldPrice.replace(/[₹,]/g, '')) - parseFloat(product.price.replace(/[₹,]/g, ''))) / parseFloat(product.oldPrice.replace(/[₹,]/g, ''))) * 100)}%
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  {product.description || 'Premium quality mirror with elegant design and superior craftsmanship. Perfect for adding style and functionality to any space.'}
                </p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <p className="text-sm font-semibold">Warranty</p>
                    <p className="text-[#862b2a]">5 Years</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <p className="text-sm font-semibold">Material</p>
                    <p className="text-[#862b2a]">Premium Glass</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <p className="text-sm font-semibold">Installation</p>
                    <p className="text-[#862b2a]">Free</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <p className="text-sm font-semibold">Delivery</p>
                    <p className="text-[#862b2a]">7-10 Days</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-4">
                <button
                  onClick={handleBuyNow}
                  disabled={buyingNow}
                  className="flex-1 bg-[#898383] hover:bg-[#6b6161] text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {buyingNow ? (
                    <>
                      <ImSpinner8 className="animate-spin" size={16} />
                      Processing...
                    </>
                  ) : (
                    'Buy Now'
                  )}
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-[#862b2a] hover:bg-[#6b1f1e] text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {addingToCart ? (
                    <>
                      <ImSpinner8 className="animate-spin" size={16} />
                      Adding...
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>

                <button
                  onClick={() => {
                    isInWishlist(product.id)
                      ? removeFromWishlist(product.id)
                      : addToWishlist(product);
                  }}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    isInWishlist(product.id)
                      ? 'bg-red-500 border-red-500 text-white'
                      : isDark
                      ? 'border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-500'
                      : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <FaHeart size={20} />
                </button>
              </div>

              {/* Additional Info */}
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>✓ Free shipping on orders above ₹5000</p>
                <p>✓ Easy returns within 30 days</p>
                <p>✓ Professional installation included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;