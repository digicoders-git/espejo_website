import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaHome, FaStar, FaGem, FaInfoCircle, FaPhone, FaBoxOpen, FaShieldAlt, FaFileContract, FaBuilding, FaHandshake, FaSitemap, FaChevronRight, FaExternalLinkAlt } from 'react-icons/fa';

const SitemapPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://glassadminpanelapi.onrender.com/api/categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        // console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const siteLinks = {
    'Main Pages': {
      icon: <FaHome className="text-2xl" style={{color: '#862b2a'}} />,
      links: [
        { name: 'Home', path: '/', icon: <FaHome /> },
        { name: 'Categories', path: '/categories', icon: <FaBoxOpen /> },
        { name: 'Best Seller', path: '/bestseller', icon: <FaStar /> },
        { name: 'Products', path: '/metal-mirror', icon: <FaGem /> },
        { name: 'About Us', path: '/about', icon: <FaInfoCircle /> },
        { name: 'Contact Us', path: '/contact', icon: <FaPhone /> }
      ]
    },
    'Product Categories': {
      icon: <FaBoxOpen className="text-2xl" style={{color: '#862b2a'}} />,
      links: categories.map(category => ({
        name: category.name,
        path: `/category/${category.slug}`,
        icon: <FaGem />
      }))
    },
    'Policies & Legal': {
      icon: <FaShieldAlt className="text-2xl" style={{color: '#862b2a'}} />,
      links: [
        { name: 'Privacy Policy', path: '/privacy-policy', icon: <FaShieldAlt /> },
        { name: 'Refund Policy', path: '/refund-policy', icon: <FaFileContract /> },
        { name: 'Return Policy', path: '/return-policy', icon: <FaFileContract /> },
        { name: 'Terms of Service', path: '/terms-of-service', icon: <FaFileContract /> }
      ]
    },
    'Company Info': {
      icon: <FaBuilding className="text-2xl" style={{color: '#862b2a'}} />,
      links: [
        { name: 'Company Profile', path: '/company-profile', icon: <FaBuilding /> },
        { name: 'Why Choose ESPEJO?', path: '/why-choose-espezo', icon: <FaStar /> },
        { name: 'Become a Dealer', path: '/become-dealer', icon: <FaHandshake /> },
        { name: 'Sitemap', path: '/sitemap', icon: <FaSitemap /> }
      ]
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} transition-colors duration-200`}>
      {/* Hero Section */}
      <div className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-200'} py-20`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <FaSitemap className="text-6xl mx-auto mb-6" style={{color: '#862b2a'}} />
          <h1 className="text-5xl font-bold mb-6" style={{color: '#862b2a'}}>Sitemap</h1>
          <div className="flex justify-center mb-6">
            <div className="w-24 h-1 rounded" style={{backgroundColor: '#862b2a'}}></div>
          </div>
          <p className={`text-xl leading-relaxed max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Navigate through all pages and sections of our website. Find everything you need quickly and easily.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.entries(siteLinks).map(([category, data]) => (
            <div key={category} className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'} rounded-xl border hover:shadow-lg transition-all duration-300`}>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  {data.icon}
                  <h2 className="text-2xl font-bold" style={{color: '#862b2a'}}>{category}</h2>
                </div>
                
                <div className="space-y-3">
                  {data.links.map((link, index) => (
                    <div key={index} className={`${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} rounded-lg transition-colors duration-200`}>
                      <button
                        onClick={() => navigate(link.path)}
                        className="w-full flex items-center justify-between p-3 text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`${isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-black'} transition-colors`}>
                            {link.icon}
                          </span>
                          <span className={`${isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-black'} font-medium transition-colors`}>
                            {link.name}
                          </span>
                        </div>
                        <FaChevronRight className={`${isDark ? 'text-gray-500 group-hover:text-white' : 'text-gray-400 group-hover:text-black'} transition-colors`} size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;