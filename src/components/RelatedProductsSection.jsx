import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import ProductCard from './ProductCard';
import ProductService from '../services/ProductService';

const RelatedProductsSection = ({ 
  currentProductId, 
  categoryName, 
  isDark, 
  maxItems = 8 
}) => {
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('related');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!currentProductId || !categoryName) return;
      
      try {
        setLoading(true);
        
        const [relatedResponse, recommendationsResponse, variantsResponse] = await Promise.all([
          ProductService.getRelatedProducts(currentProductId, categoryName, maxItems),
          ProductService.getRecommendations(currentProductId),
          ProductService.getProductVariants(currentProductId)
        ]);
        
        if (relatedResponse.success) {
          setRelatedProducts(relatedResponse.relatedProducts);
        }
        
        if (recommendationsResponse.success) {
          setRecommendations(recommendationsResponse.recommendations);
        }
        
        if (variantsResponse.success) {
          setVariants(variantsResponse.variants);
        }
      } catch (error) {
        console.error('Error fetching related data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedData();
  }, [currentProductId, categoryName, maxItems]);

  const getCurrentProducts = () => {
    switch (activeSection) {
      case 'related':
        return relatedProducts;
      case 'recommendations':
        return recommendations;
      case 'variants':
        return variants;
      default:
        return relatedProducts;
    }
  };

  const currentProducts = getCurrentProducts();
  const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
  const displayedProducts = currentProducts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };


  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getSectionInfo = () => {
    switch (activeSection) {
      case 'related':
        return { title: 'Related Products', count: relatedProducts.length };
      case 'recommendations':
        return { title: 'You Might Also Like', count: recommendations.length };
      case 'variants':
        return { title: 'Available Variants', count: variants.length };
      default:
        return { title: 'Related Products', count: relatedProducts.length };
    }
  };

  const sectionInfo = getSectionInfo();

  if (loading) {
    return (
      <div className="mb-16">
        <div className="flex justify-center py-12">
          <ImSpinner8 className="animate-spin text-[#862b2a]" size={40} />
        </div>
      </div>
    );
  }

  if (currentProducts.length === 0) {
    return null;
  }

  return (
    <div className="mb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{color: '#862b2a'}}>
            {sectionInfo.title}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {sectionInfo.count} items available
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {relatedProducts.length > 0 && (
              <button
                onClick={() => {
                  setActiveSection('related');
                  setCurrentPage(0);
                }}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activeSection === 'related'
                    ? 'bg-[#862b2a] text-white'
                    : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Related ({relatedProducts.length})
              </button>
            )}
            {recommendations.length > 0 && (
              <button
                onClick={() => {
                  setActiveSection('recommendations');
                  setCurrentPage(0);
                }}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activeSection === 'recommendations'
                    ? 'bg-[#862b2a] text-white'
                    : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Recommended ({recommendations.length})
              </button>
            )}
            {variants.length > 0 && (
              <button
                onClick={() => {
                  setActiveSection('variants');
                  setCurrentPage(0);
                }}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activeSection === 'variants'
                    ? 'bg-[#862b2a] text-white'
                    : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Variants ({variants.length})
              </button>
            )}
          </div>

        </div>
      </div>

      <div className="relative">
        {totalPages > 1 && (
          <>
            <button
              onClick={prevPage}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FaChevronLeft className="text-[#862b2a]" />
            </button>
            <button
              onClick={nextPage}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FaChevronRight className="text-[#862b2a]" />
            </button>
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product)}
              isDark={isDark}
              showActions={true}
            />
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentPage === index ? 'bg-[#862b2a]' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProductsSection;