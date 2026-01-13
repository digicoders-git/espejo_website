import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import PageLoader from './PageLoader';

const CATEGORIES_API = "https://glassadminpanelapi.onrender.com/api/categories";
const PRODUCTS_API = "https://glassadminpanelapi.onrender.com/api/products";

const MetalMirrorPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Predefined categories with fallback data
  const predefinedCategories = [
    {
      id: 'mirror',
      title: "Mirror",
      description: "Premium mirrors with elegant designs and superior quality",
      image: "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      route: "/category/mirror",
      slug: "mirror"
    },
    {
      id: 'console',
      title: "Console",
      description: "Premium console tables with modern designs and storage solutions",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      route: "/category/console",
      slug: "console"
    },
    {
      id: 'console-mirror',
      title: "Console + Mirror",
      description: "Complete console and mirror combinations for elegant interiors",
      image: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      route: "/category/console-mirror",
      slug: "console-mirror"
    }
  ];

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(CATEGORIES_API),
          fetch(PRODUCTS_API)
        ]);
        
        const catData = await catRes.json();
        const prodData = await prodRes.json();
        
        if (catRes.ok && prodRes.ok) {
          // Merge backend categories with predefined ones
          const backendCategories = catData.categories || [];
          const products = prodData.products || [];
          
          const finalCategories = predefinedCategories.map(predefined => {
            // Find matching backend category
            const backendCat = backendCategories.find(cat => 
              cat.name?.toLowerCase().includes(predefined.title.toLowerCase()) ||
              cat.slug === predefined.slug
            );
            
            // Count products for this category
            let productCount = 0;
            if (predefined.slug === 'mirror') {
              productCount = products.filter(p => 
                p.category?.name?.toLowerCase().includes('mirror') &&
                !p.category?.name?.toLowerCase().includes('console')
              ).length;
            } else if (predefined.slug === 'console') {
              productCount = products.filter(p => 
                p.category?.name?.toLowerCase().includes('console') &&
                !p.category?.name?.toLowerCase().includes('mirror')
              ).length;
            } else if (predefined.slug === 'console-mirror') {
              productCount = products.filter(p => {
                const catName = p.category?.name?.toLowerCase() || '';
                return catName.includes('console') && catName.includes('mirror');
              }).length;
            }
            
            return {
              ...predefined,
              _id: backendCat?._id || predefined.id,
              productCount: `${productCount} Products`,
              isActive: backendCat?.isActive !== false
            };
          });
          
          setCategories(finalCategories);
        } else {
          // Fallback to predefined categories
          setCategories(predefinedCategories.map(cat => ({
            ...cat,
            productCount: "Products",
            isActive: true
          })));
        }
      } catch (error) {
        // console.error('Categories fetch error:', error);
        // Fallback to predefined categories
        setCategories(predefinedCategories.map(cat => ({
          ...cat,
          productCount: "Products",
          isActive: true
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className={`${isDark ? 'bg-black' : 'bg-white'} min-h-screen transition-colors duration-200`}>

      {/* Category Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className={`text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-black'} mb-12`}>Browse Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id || category._id}
              onClick={() => navigate(category.route)}
              className={`${isDark ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105 ${
                !category.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="relative h-80">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-sm font-medium mb-2" style={{ color: '#a76665' }}>{category.productCount}</div>
                  <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">{category.description}</p>
                </div>
                {!category.isActive && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Inactive
                  </div>
                )}
              </div>

              <div className="p-6">
                <button
                  className="w-full text-white py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#a76665' }}
                  disabled={!category.isActive}
                >
                  View {category.title} Products
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} py-16`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-6`}>Why Choose Our Products</h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-8`}>
            Our furniture collection features premium quality materials and modern designs.
            Each piece is crafted with attention to detail and built to last for years.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#a76665' }}>5+ Years</div>
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Warranty Coverage</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#a76665' }}>100%</div>
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Quality Assured</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#a76665' }}>25+</div>
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Design Options</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetalMirrorPage;