import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FaArrowLeft, FaHeart, FaShoppingCart, FaStar, FaCheck, FaShippingFast, FaShieldAlt, FaUndo, FaPhone, FaWhatsapp, FaExpand } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import PageLoader from './PageLoader';
import ProductService from '../services/ProductService';
import RelatedProductsSection from './RelatedProductsSection';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [newReviewRating, setNewReviewRating] = useState(0);



  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({ average: 0, total: 0 });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching product details for ID:', productId);

        // Fetch product details
        const productResponse = await ProductService.getProductById(productId);
        
        if (productResponse.success) {
          setProduct(productResponse.product);
          console.log('✅ Product loaded:', productResponse.product);
          
          // Fetch Reviews (Fail-safe)
          try {
            const reviewsResponse = await ProductService.getProductReviews(productId);
            if (reviewsResponse.success) {
              setReviews(reviewsResponse.reviews);
              setRatingStats({
                average: reviewsResponse.averageRating,
                total: reviewsResponse.totalReviews
              });
              console.log('✅ Reviews loaded:', reviewsResponse);
            }
          } catch (reviewError) {
            console.warn('⚠ Could not fetch reviews (Backend might be updating):', reviewError);
            // Non-critical error, do not block product loading
          }
        } else {
          console.error('❌ Product not found');
          setProduct(null);
        }
      } catch (error) {
        console.error('🚨 Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);



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

  const handleRelatedProductClick = (relatedProduct) => {
    navigate(`/product/${relatedProduct.id}`);
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!product) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#862b2a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6b1f1e] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{color: '#862b2a'}}>Product Details</h1>
            <p className="text-gray-500">Premium Mirror Collection</p>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                onError={(e) => e.target.src = 'https://via.placeholder.com/600x600'}
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomPosition({ x, y });
                }}
              />
              <button className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform">
                <FaExpand />
              </button>
            </div>
            
            {/* Zoom Window */}
            {showZoom && (
              <div className="fixed top-1/2 right-8 -translate-y-1/2 w-[600px] h-[500px] bg-white dark:bg-gray-900 border-4 border-[#862b2a] rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="w-full h-full relative">
                  <div 
                    className="w-full h-full bg-no-repeat transition-all duration-100 ease-out"
                    style={{
                      backgroundImage: `url(${product.images[selectedImage]})`,
                      backgroundSize: '300%',
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                    Zoom View
                  </div>
                </div>
              </div>
            )}
            
            {/* Image Thumbnails - Limited to 4 */}
            {product.images.length > 1 && (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                        selectedImage === index 
                          ? 'border-[#862b2a] ring-2 ring-[#862b2a]/30' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-[#862b2a]/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/100x100'}
                      />
                    </button>
                  ))}
                </div>
                
                {/* Image Counter */}
                <div className="text-center">
                  <span className="text-sm text-gray-500">
                    {selectedImage + 1} of {Math.min(product.images.length, 4)} images
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
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
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(ratingStats.average || 0) ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({ratingStats.total || 0} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold" style={{color: '#862b2a'}}>₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* Product Options */}
            {(product.sizes?.length > 0 || product.colors?.length > 0) && (
              <div className="space-y-4">
                {/* Size Options */}
                {product.sizes?.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Available Sizes:</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 border rounded-lg text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Color Options */}
                {product.colors?.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Available Colors:</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 border rounded-lg text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add-ons */}
            {product.addOns?.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Available Add-ons:</h3>
                <div className="space-y-2">
                  {product.addOns.map((addon, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        addon.isDefault 
                          ? 'border-[#862b2a] bg-[#862b2a]/5' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div>
                        <span className="font-medium">{addon.name}</span>
                        {addon.isDefault && (
                          <span className="ml-2 text-xs bg-[#862b2a] text-white px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-[#862b2a]">
                        {addon.price === 0 ? 'Free' : `+₹${addon.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-medium text-green-600">In Stock</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBuyNow}
                disabled={buyingNow}
                className="flex-1 bg-[#898383] hover:bg-[#6b6161] text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {buyingNow ? (
                  <>
                    <ImSpinner8 className="animate-spin" size={16} />
                    Redirecting...
                  </>
                ) : (
                  'Buy Now'
                )}
              </button>
              
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 bg-[#862b2a] hover:bg-[#6b1f1e] text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FaShippingFast className="text-green-500" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-blue-500" />
                <span className="text-sm">5 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUndo className="text-orange-500" />
                <span className="text-sm">Easy Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-500" />
                <span className="text-sm">Quality Assured</span>
              </div>
            </div>

            {/* Contact Options */}
            <div className="flex gap-4">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <FaPhone className="text-green-500" />
                <span className="text-sm">Call Us</span>
              </a>
              <a
                href="https://wa.me/919876543210?text=Hi, I'm interested in this mirror product"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <FaWhatsapp className="text-green-500" />
                <span className="text-sm">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl p-6 mb-16`}>
          <div className="flex gap-6 mb-6 border-b">
            {['description', 'specifications', 'features', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 text-[#862b2a]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={activeTab === tab ? {borderColor: '#862b2a'} : {}}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {activeTab === 'description' && (
              <div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).filter(([_, value]) => value).length > 0 ? (
                  Object.entries(product.specifications)
                    .filter(([_, value]) => value)
                    .map(([key, value]) => {
                      const formatKey = (k) => {
                        return k
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase());
                      };
                      
                      return (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="font-medium">{formatKey(key)}:</span>
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{value}</span>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-gray-500 italic col-span-2">No specific technical specifications available for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'features' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features?.length > 0 ? (
                  product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <FaCheck className="text-green-500 flex-shrink-0" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                    </div>
                  ))
                ) : (
                   <p className="text-gray-500 italic col-span-2">No special features listed for this product.</p>
                )}
              </div>
            )}



            {/* Reviews Tab Content */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* 1. Write a Review Form */}
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className="text-lg font-bold mb-4">Write a Review</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    
                    if(newReviewRating === 0) {
                      alert("Please select a star rating");
                      return;
                    }

                    const name = e.target.name.value;
                    const comment = e.target.comment.value;
                    const reviewData = { user: name, rating: newReviewRating, comment };

                    try {
                      await ProductService.addReview(product.id, reviewData);
                      alert("Thank you! Your review has been submitted.");
                      e.target.reset();
                      setNewReviewRating(0);
                      // Refresh reviews
                      const response = await ProductService.getProductReviews(product.id);
                      if (response.success) {
                        setReviews(response.reviews);
                        setRatingStats({
                          average: response.averageRating,
                          total: response.totalReviews
                        });
                      }
                    } catch (error) {
                      console.error("Error submitting review:", error);
                      alert("Failed to submit review. Please try again.");
                    }
                  }}>
                    <div className="space-y-4">
                      {/* Star Rating Select */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Your Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReviewRating(star)}
                              className="text-2xl transition-colors focus:outline-none"
                            >
                              <FaStar className={star <= newReviewRating ? 'text-yellow-400' : 'text-gray-300'} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name Input */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#862b2a] focus:border-transparent outline-none transition-all ${
                            isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                          }`}
                          placeholder="John Doe"
                        />
                      </div>

                      {/* Comment Input */}
                      <div>
                        <label htmlFor="comment" className="block text-sm font-medium mb-1">Your Review</label>
                        <textarea
                          id="comment"
                          name="comment"
                          rows="4"
                          required
                          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#862b2a] focus:border-transparent outline-none transition-all resize-none ${
                            isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                          }`}
                          placeholder="Share your experience with this product..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="bg-[#862b2a] hover:bg-[#6b1f1e] text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Reviews Header & List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#862b2a]">{ratingStats.average || 0}</span>
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.round(ratingStats.average || 0) ? 'fill-current' : 'text-gray-300'} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">Based on {ratingStats.total || 0} reviews</span>
                    </div>
                  </div>

                  {/* Dynamic Review List */}
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`}>
                                {(review.user || "A").charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{review.user}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex text-yellow-400 text-xs">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < review.rating ? 'fill-current' : 'text-gray-300'} />
                              ))}
                            </div>
                          </div>
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {product && (
          <RelatedProductsSection
            currentProductId={product.id}
            categoryName={product.category}
            isDark={isDark}
            showFilters={true}
            maxItems={12}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;