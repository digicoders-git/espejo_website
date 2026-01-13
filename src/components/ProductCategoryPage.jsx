import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import {
  FaArrowLeft,
  FaSort,
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaEye,
  FaTimes
} from 'react-icons/fa';

const ProductCategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const API_URL = import.meta.env.VITE_API_URL;

  const [sortBy, setSortBy] = useState('name');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // 🔥 API STATES
  const [apiCategories, setApiCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= API FETCH ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();

        // expected: { categories: [...] }
        if (data?.categories) {
          setApiCategories(data.categories);
        }
      } catch (err) {
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_URL]);

  /* ================= DUMMY DATA (FALLBACK) ================= */
  const dummyData = {
    'bathroom-mirrors': {
      title: 'Bathroom Mirrors',
      description: 'Stylish and functional bathroom mirrors.',
      products: [
        {
          id: 1,
          name: 'Round Bathroom Mirror',
          price: '₹3999',
          image:
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
        }
      ]
    }
  };

  /* ================= FINAL CATEGORY (API > DUMMY) ================= */
  const backendCategory = apiCategories.find(
    (cat) => cat.slug === category
  );

  const currentCategory = backendCategory
    ? {
        title: backendCategory.name,
        description: backendCategory.description || '',
        products: backendCategory.products || []
      }
    : dummyData[category] || {
        title: 'Products',
        description: '',
        products: []
      };

  /* ================= SORT ================= */
  const sortedProducts = [...currentCategory.products].sort((a, b) => {
    if (sortBy === 'price-low') {
      return (
        parseInt(a.price.replace(/\D/g, '')) -
        parseInt(b.price.replace(/\D/g, ''))
      );
    }
    if (sortBy === 'price-high') {
      return (
        parseInt(b.price.replace(/\D/g, '')) -
        parseInt(a.price.replace(/\D/g, ''))
      );
    }
    return a.name.localeCompare(b.name);
  });

  /* ================= ACTIONS ================= */
  const handleAddToCart = (product) => {
    const productData = {
      _id: `${category}-${product.id}`,
      id: `${category}-${product.id}`,
      name: product.name,
      title: product.name,
      price: product.price,
      image: product.image,
      img: product.image,
      category
    };
    
    console.log('🛒 Adding to cart:', productData);
    addToCart(productData);
  };

  const handleBuyNow = async (product) => {
    console.log('🛒 Buy Now clicked for:', product);
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first to place an order!');
      return;
    }
    
    try {
      // Add product to cart via API
      const addToCartPayload = {
        productId: `${category}-${product.id}`,
        quantity: 1
      };
      
      console.log('📦 Adding to cart via API:', addToCartPayload);
      
      const cartResponse = await fetch('https://glassadminpanelapi.onrender.com/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(addToCartPayload)
      });
      
      if (cartResponse.ok) {
        console.log('✅ Product added to cart successfully');
        // Navigate to checkout immediately
        navigate('/checkout');
      } else {
        const error = await cartResponse.json();
        console.error('❌ Failed to add to cart:', error);
        toast.error('Failed to add product to cart');
      }
      
    } catch (error) {
      console.error('🚨 Buy Now error:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const handleWishlistToggle = (product) => {
    const id = `${category}-${product.id}`;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        title: product.name,
        price: product.price,
        img: product.image
      });
    }
  };

  /* ================= UI ================= */
  return (
    <div
      className={`min-h-screen ${
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      } px-6 py-12`}
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-3 rounded-full bg-gray-200 dark:bg-gray-800"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-[#862b2a]">
              {currentCategory.title}
            </h1>
            <p className="text-gray-500">{currentCategory.description}</p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-between mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Low to High</option>
            <option value="price-high">High to Low</option>
          </select>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20 text-xl">
            Loading products...
          </div>
        )}

        {/* PRODUCTS */}
        <div
          className={`${sortedProducts.length > 4 ? 'flex overflow-x-auto gap-6 pb-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'}`}
          style={sortedProducts.length > 4 ? {scrollbarWidth: 'none', msOverflowStyle: 'none'} : {}}
          onScroll={(e) => e.target.style.setProperty('--webkit-scrollbar', 'none')}
        >
        
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className={`border rounded-xl overflow-hidden shadow ${sortedProducts.length > 4 ? 'min-w-[300px] flex-shrink-0' : ''}`}
            >
              <div className="relative h-56">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    onClick={() => handleWishlistToggle(product)}
                    className="bg-white p-2 rounded-full"
                  >
                    <FaHeart
                      className={
                        isInWishlist(`${category}-${product.id}`)
                          ? 'text-red-500'
                          : 'text-gray-400'
                      }
                    />
                  </button>
                  <button
                    onClick={() => setQuickViewProduct(product)}
                    className="bg-white p-2 rounded-full"
                  >
                    <FaEye />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>

                <div className="flex gap-1 my-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < 4 ? 'text-yellow-400' : 'text-gray-300'
                      }
                    />
                  ))}
                </div>

                <p className="text-xl font-bold text-[#862b2a]">
                  {product.price}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-[#862b2a] text-white py-2 rounded"
                  >
                    <FaShoppingCart className="inline mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="flex-1 bg-orange-600 text-white py-2 rounded"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK VIEW */}
        {quickViewProduct && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-lg w-full">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {quickViewProduct.name}
                </h2>
                <button onClick={() => setQuickViewProduct(null)}>
                  <FaTimes />
                </button>
              </div>
              <img
                src={quickViewProduct.image}
                className="w-full h-64 object-cover rounded"
              />
              <p className="mt-4 text-xl font-bold text-[#862b2a]">
                {quickViewProduct.price}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCategoryPage;
