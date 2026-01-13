import React from 'react';
import { useNavigate } from 'react-router-dom';
import BestSeller from './BestSeller';
import { useTheme } from '../context/ThemeContext';

const BestSellerPage = ({ onBuyNow }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  return (
    <div className={`${isDark ? 'bg-black' : 'bg-white'} min-h-screen transition-colors duration-200`}>
      <div className="pt-8">
        <h1 className={`text-center text-4xl md:text-5xl font-bold mb-4`} style={{color: '#862b2a'}}>Best Seller Products</h1>
        <div className="flex justify-center mb-8">
          <div className="w-24 h-1 rounded" style={{backgroundColor: '#862b2a'}}></div>
        </div>
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
      </div>
    </div>
  );
};

export default BestSellerPage;