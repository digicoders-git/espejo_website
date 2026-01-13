import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaArrowLeft, FaBoxOpen, FaEye } from 'react-icons/fa';
import PageLoader from './PageLoader';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories and products
        const [catRes, prodRes] = await Promise.all([
          fetch('https://glassadminpanelapi.onrender.com/api/categories'),
          fetch('https://glassadminpanelapi.onrender.com/api/products')
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        const categoriesWithStats = catData.categories?.map(category => {
          const categoryProducts = prodData.products?.filter(
            product => product.category?._id === category._id
          ) || [];

          return {
            ...category,
            productCount: categoryProducts.length,
            sampleImage: categoryProducts[0]?.mainImage?.url || 'https://via.placeholder.com/400'
          };
        }) || [];

        setCategories(categoriesWithStats);
        setProducts(prodData.products || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-2xl hover:text-[#862b2a] transition-colors"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">All Categories</h1>
            <p className={`mt-2 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Explore our complete range of mirror categories
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'} border rounded-lg p-6 text-center`}>
            <div className="text-3xl font-bold text-[#862b2a] mb-2">{categories.length}</div>
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Categories</div>
          </div>
          <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'} border rounded-lg p-6 text-center`}>
            <div className="text-3xl font-bold text-[#862b2a] mb-2">{products.length}</div>
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Products</div>
          </div>
          <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'} border rounded-lg p-6 text-center`}>
            <div className="text-3xl font-bold text-[#862b2a] mb-2">
              {categories.filter(cat => cat.isActive).length}
            </div>
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Active Categories</div>
          </div>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No categories found
            </p>
          </div>
        ) : (
          <div className={`${categories.length > 4 ? 'flex overflow-x-auto gap-8 pb-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}`} style={categories.length > 4 ? {scrollbarWidth: 'none', msOverflowStyle: 'none'} : {}} onScroll={(e) => e.target.style.setProperty('--webkit-scrollbar', 'none')}>
            {categories.map((category) => (
              <div
                key={category._id}
                className={`${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${categories.length > 4 ? 'min-w-[350px] flex-shrink-0' : ''}`}
                onClick={() => navigate(`/category/${category.slug}`)}
              >
                {/* Category Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.sampleImage}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/400'}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    category.isActive 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold group-hover:text-[#862b2a] transition-colors">
                      {category.name}
                    </h3>
                    <div className={`flex items-center gap-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <FaBoxOpen size={14} />
                      <span>{category.productCount}</span>
                    </div>
                  </div>

                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-2`}>
                    {category.description}
                  </p>

                  {/* Category Stats */}
                  <div className="flex items-center justify-between">
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Created: {new Date(category.createdAt).toLocaleDateString()}
                    </div>
                    
                    <button className="flex items-center gap-2 bg-[#862b2a] hover:bg-[#6b1f1e] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                      <FaEye size={12} />
                      View Products
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

export default CategoriesPage;