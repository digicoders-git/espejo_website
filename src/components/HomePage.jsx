import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Slider from './Slider.jsx';
import Company from './Company.jsx';
// import Card from './Card.jsx';
import BestSeller from './BestSeller.jsx';
import FeaturesSection from './FeaturesSection.jsx';

const HomePage = ({ onBuyNow }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  return (
    <div className={`${isDark ? 'bg-black' : 'bg-white'} transition-colors duration-200`}>
      <Slider onOrderNow={() => window.location.href = '/bestseller'} />
      <Company />
      {/* <hr className={`w-[95%] border border-2 mx-auto ${isDark ? 'border-gray-500' : 'border-gray-300'}`} /> */}
      {/* <Card onBuyNow={onBuyNow} /> */}
      <hr className={`w-[95%] border border-2 mx-auto ${isDark ? 'border-gray-500' : 'border-gray-300'}`} />
      <BestSeller onBuyNow={onBuyNow} />
      
      {/* View All Button */}
      <div className="flex justify-center py-8">
        <button
          onClick={() => navigate('/all-products')}
          className="px-8 py-3 text-white font-semibold rounded-lg transition-colors hover:opacity-90"
          style={{ backgroundColor: "#a76665" }}
        >
          View All Products
        </button>
      </div>
      
      <hr className={`w-[95%] border border-2 mx-auto ${isDark ? 'border-gray-500' : 'border-gray-300'}`} />
      <FeaturesSection />
      <hr className={`w-[95%] border border-2 mx-auto ${isDark ? 'border-gray-500' : 'border-gray-300'}`} />
    </div>
  );
};

export default HomePage;