import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FaTag, FaPercent, FaCopy, FaCheck, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import PageLoader from './PageLoader';

const OffersPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch('https://glassadminpanelapi-zvz4.onrender.com/api/offers');
        const data = await res.json();
        
        if (res.ok && data) {
          // Handle both single offer and array of offers
          const offersArray = Array.isArray(data) ? data : [data];
          setOffers(offersArray);
        }
      } catch (error) {
        // console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Offer code ${code} copied!`);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const shopNow = () => {
    navigate('/all-products');
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'} transition-colors duration-200`}>
      {/* Hero Section */}
      <div className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-orange-100 to-red-100'} py-20`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <FaTag className="text-6xl mx-auto mb-6 text-orange-500" />
          <h1 className="text-5xl font-bold mb-6 text-orange-600">Special Offers</h1>
          <div className="flex justify-center mb-6">
            <div className="w-24 h-1 rounded bg-orange-500"></div>
          </div>
          <p className={`text-xl leading-relaxed max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Save more on your favorite products with our exclusive discount codes and special offers!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {offers.length === 0 ? (
          <div className="text-center py-20">
            <FaTag className="text-6xl mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-bold mb-4 text-gray-500">No Active Offers</h2>
            <p className="text-gray-400 mb-8">Check back soon for exciting deals and discounts!</p>
            <button
              onClick={shopNow}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer, index) => (
              <div
                key={offer.code || index}
                className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
              >
                {/* Offer Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <FaPercent className="text-3xl" />
                    <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                      Limited Time
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-orange-100">
                    {offer.discountType === 'percentage' 
                      ? `${offer.discountValue}% OFF` 
                      : `₹${offer.discountValue} OFF`}
                  </p>
                </div>

                {/* Offer Details */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Minimum Order:</span>
                      <span className="text-sm">₹{offer.minOrderAmount}</span>
                    </div>
                    {offer.maxDiscountAmount && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Max Discount:</span>
                        <span className="text-sm">₹{offer.maxDiscountAmount}</span>
                      </div>
                    )}
                  </div>

                  {/* Offer Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Offer Code:</label>
                    <div className={`flex items-center gap-2 p-3 border-2 border-dashed rounded-lg ${isDark ? 'border-gray-600 bg-gray-800' : 'border-orange-300 bg-orange-50'}`}>
                      <code className="flex-1 font-mono font-bold text-lg text-orange-600">
                        {offer.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(offer.code)}
                        className={`p-2 rounded-lg transition-colors ${
                          copiedCode === offer.code
                            ? 'bg-green-500 text-white'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                      >
                        {copiedCode === offer.code ? <FaCheck size={16} /> : <FaCopy size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={shopNow}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <FaShoppingCart size={16} />
                    Shop Now & Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How to Use Section */}
        {offers.length > 0 && (
          <div className={`mt-16 ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-xl p-8`}>
            <h2 className="text-2xl font-bold mb-6 text-center">How to Use Offer Codes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Copy Code</h3>
                <p className="text-sm text-gray-500">Click the copy button to copy your favorite offer code</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Shop Products</h3>
                <p className="text-sm text-gray-500">Add products to cart and proceed to checkout</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Apply & Save</h3>
                <p className="text-sm text-gray-500">Paste the code at checkout and enjoy your discount</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;