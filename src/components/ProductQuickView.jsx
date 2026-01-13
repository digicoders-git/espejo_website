import React, { useState, useEffect } from 'react';
import { FaTimes, FaHeart, FaShoppingCart, FaStar, FaCheck, FaExpand, FaEye } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import ProductService from '../services/ProductService';

const ProductQuickView = ({ productId, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || !isOpen) return;
      
      try {
        setLoading(true);
        const response = await ProductService.getProductById(productId);
        
        if (response.success) {
          setProduct(response.product);
          setSelectedImage(0);
          setQuantity(1);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, isOpen]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: `₹${product.price}`,
        img: product.images[0],
        quantity: quantity
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    setBuyingNow(true);
    setTimeout(() => {
      onClose();
      navigate('/checkout', {
        state: {
          buyNowItem: {
            id: product.id,
            title: product.name,
            price: `₹${product.price}`,
            img: product.images[0],
            quantity: quantity
          }
        }
      });
    }, 500);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    const wishlistItem = {
      id: product.id,
      title: product.name,
      price: `₹${product.price}`,
      img: product.images[0]
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(wishlistItem);
    }
  };

  const handleViewFullDetails = () => {
    onClose();
    navigate(`/product/${productId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'} rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto`}>
        
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold" style={{color: '#862b2a'}}>Quick View</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-100 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <ImSpinner8 className="animate-spin text-[#862b2a]" size={40} />
          </div>
        ) : product ? (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="space-y-4">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/600x600'}
                  />
                  <button 
                    onClick={handleViewFullDetails}
                    className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
                    title="View Full Details"
                  >
                    <FaExpand />
                  </button>
                </div>
                
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index 
                            ? 'border-[#862b2a]' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/64x64'}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium px-2 py-1 rounded-full" style={{backgroundColor: '#862b2a20', color: '#862b2a'}}>
                      {product.category}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-sm font-medium px-2 py-1 bg-red-100 text-red-600 rounded-full">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} size={16} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-2xl font-bold" style={{color: '#862b2a'}}>₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                  </span>
                </div>

                <div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed line-clamp-3`}>
                    {product.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {product.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FaCheck className="text-green-500 flex-shrink-0" size={12} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock || buyingNow}
                    className="flex-1 bg-[#898383] hover:bg-[#6b6161] text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    disabled={!product.inStock || addingToCart}
                    className="flex-1 bg-[#862b2a] hover:bg-[#6b1f1e] text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {addingToCart ? (
                      <>
                        <ImSpinner8 className="animate-spin" size={16} />
                        Adding...
                      </>
                    ) : (
                      <>
                        <FaShoppingCart size={16} />
                        Add to Cart
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      isInWishlist(product.id)
                        ? 'border-red-500 bg-red-50 text-red-500'
                        : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    <FaHeart size={20} />
                  </button>
                </div>

                <button
                  onClick={handleViewFullDetails}
                  className="w-full py-2 px-4 border border-[#862b2a] text-[#862b2a] rounded-lg hover:bg-[#862b2a] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <FaEye size={16} />
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">Product not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductQuickView;