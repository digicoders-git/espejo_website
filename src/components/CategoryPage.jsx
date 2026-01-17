import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FaHeart, FaArrowLeft, FaHome, FaChevronRight } from "react-icons/fa";
import PageLoader from "./PageLoader";
import ProductService from "../services/ProductService";
import ProductCard from "./ProductCard";

const CategoryPage = ({ onBuyNow }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Fetch category details by slug
        const catRes = await ProductService.getCategoryBySlug(slug);
        
        if (catRes.success) {
          const cat = catRes.category;
          setCategory(cat);
          
          // 2. Fetch products for this specific category ID
          const prodRes = await ProductService.getProductsByCategoryId(cat._id);
          if (prodRes.success) {
            setProducts(prodRes.products);
          }
        } else {
          setError(catRes.message || "Category not found");
        }
      } catch (err) {
        console.error("Error in CategoryPage:", err);
        setError("Something went wrong while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  if (loading) return <PageLoader />;

  if (error || !category) {
    return (
      <div className={`min-h-[80vh] flex flex-col items-center justify-center px-4 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6 opacity-20">🏷️</div>
          <h2 className="text-2xl font-bold mb-2">{error || "Category Not Found"}</h2>
          <p className="opacity-60 mb-8">We couldn't find the category you're looking for. It might have been removed or the URL is incorrect.</p>
          <button
            onClick={() => navigate("/metal-mirror")}
            className="w-full bg-[#862b2a] text-white px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-[#0a0a0a] text-white" : "bg-[#fafafa] text-black"}`}>
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-50 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link to="/" className="hover:text-[#862b2a] flex items-center gap-1">
            <FaHome className="mb-0.5" /> Home
          </Link>
          <FaChevronRight className="text-[8px]" />
          <Link to="/metal-mirror" className="hover:text-[#862b2a]">
            Collections
          </Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-[#862b2a] font-bold">{category.name}</span>
        </nav>
      </div>

      {/* Header Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden mb-12">
        <div className="absolute inset-0 z-0">
          <img 
            src={category.image?.url || "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
            className="w-full h-full object-cover blur-[2px] scale-105 opacity-40"
            alt=""
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-black/80 via-black/40 to-[#0a0a0a]' : 'bg-gradient-to-b from-white/80 via-white/40 to-[#fafafa]'}`}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="max-w-2xl text-base md:text-lg opacity-70 font-light leading-relaxed">
              {category.description}
            </p>
          )}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-opacity-20" style={{ borderColor: '#862b2a', color: '#862b2a' }}>
              {products.length} Products Found
            </span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-32">
        {products.length === 0 ? (
          <div className="text-center py-40 border-2 border-dashed border-opacity-10 rounded-3xl" style={{ borderColor: '#862b2a' }}>
            <p className="text-xl opacity-40">No products currently available in this collection.</p>
            <button
               onClick={() => navigate('/metal-mirror')}
               className="mt-6 text-[#862b2a] font-bold hover:underline"
            >
              Browse other collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Brand values footer for consistency */}
      <div className={`py-20 border-t ${isDark ? 'border-white/10' : 'border-black/5'}`}>
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold mb-8">Premium Quality Guaranteed</h3>
            <div className="flex flex-wrap justify-center gap-12">
               <div className="flex flex-col items-center">
                  <span className="text-3xl mb-2">✨</span>
                  <span className="text-sm font-bold uppercase tracking-tighter opacity-70">Shatterproof</span>
               </div>
               <div className="flex flex-col items-center">
                  <span className="text-3xl mb-2">🚛</span>
                  <span className="text-sm font-bold uppercase tracking-tighter opacity-70">Free Shipping</span>
               </div>
               <div className="flex flex-col items-center">
                  <span className="text-3xl mb-2">🛡️</span>
                  <span className="text-sm font-bold uppercase tracking-tighter opacity-70">5yr Warranty</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CategoryPage;
