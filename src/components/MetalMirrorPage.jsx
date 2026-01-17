import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import PageLoader from './PageLoader';
import ProductService from '../services/ProductService';
import ProductCard from './ProductCard';

const MetalMirrorPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  
  const contentContainerRef = useRef(null);
  const tabContainerRef = useRef(null);
  const tabRefs = useRef([]);

  useEffect(() => {
    const fetchEverything = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          ProductService.getCategories(),
          ProductService.getAllProducts()
        ]);

        if (catRes.success && prodRes.success) {
          const categories = catRes.categories || [];
          const allProducts = prodRes.products || [];

          const groupedData = categories.map(cat => {
            const catProducts = allProducts
              .filter(p => p.category?._id === cat._id)
              .slice(0, 8)
              .map(p => ProductService.mapProductData(p, true));

            return {
              ...cat,
              products: catProducts
            };
          }).filter(cat => cat.products.length > 0);

          setCategoryData(groupedData);
        }
      } catch (error) {
        console.error('Error fetching data for MetalMirrorPage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEverything();
  }, []);

  const handleTabClick = (idx) => {
    setActiveTabIdx(idx);
    centerTab(idx);
    
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({
        left: contentContainerRef.current.offsetWidth * idx,
        behavior: 'smooth'
      });
    }
  };

  const centerTab = (idx) => {
    const tabElement = tabRefs.current[idx];
    const container = tabContainerRef.current;
    if (tabElement && container) {
      const containerWidth = container.offsetWidth;
      const tabOffsetLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const scrollLeft = tabOffsetLeft - containerWidth / 2 + tabWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  const handleContentScroll = () => {
    if (!contentContainerRef.current) return;
    const scrollLeft = contentContainerRef.current.scrollLeft;
    const width = contentContainerRef.current.offsetWidth;
    const newIdx = Math.round(scrollLeft / width);
    if (newIdx !== activeTabIdx && newIdx >= 0 && newIdx < categoryData.length) {
      setActiveTabIdx(newIdx);
      centerTab(newIdx);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#020202] text-white' : 'bg-[#ffffff] text-black'} font-sans`}>
      
      {/* --- MINIMALIST HERO --- */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#862b2a0d] to-transparent"></div>
          <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full blur-[100px] opacity-[0.05] bg-[#862b2a]"></div>
        </div>

        <div className="relative z-10 text-center px-6 animate-fade-in-blur">
           <p className="text-[9px] font-bold uppercase tracking-[0.6em] mb-3 opacity-40">Artistic Expressions</p>
           <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] mb-6 uppercase leading-tight font-serif italic text-[#862b2a]">
              The Collection 
           </h1>
           <div className="flex items-center justify-center gap-2 opacity-20">
              <span className="w-12 h-[1px] bg-current"></span>
              <span className="text-[8px] uppercase tracking-[0.3em]">Since 2024</span>
              <span className="w-12 h-[1px] bg-current"></span>
           </div>
        </div>
      </div>

      {/* --- ELEVATED TAB NAV --- */}
      <div className={`sticky top-[70px] z-40 border-b border-t transition-all ${isDark ? 'bg-[#020202]/80 border-white/5' : 'bg-white/80 border-black/5'}`} style={{ backdropFilter: 'blur(30px)' }}>
         <div className="max-w-7xl mx-auto px-6">
            <div 
              ref={tabContainerRef}
              className="flex items-center justify-center overflow-x-auto no-scrollbar scroll-smooth gap-1 md:gap-4 py-4"
            >
              {categoryData.map((cat, i) => (
                <button
                  key={cat._id}
                  ref={el => tabRefs.current[i] = el}
                  onClick={() => handleTabClick(i)}
                  className={`group relative flex-shrink-0 px-6 py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-500 ${
                    activeTabIdx === i 
                      ? 'text-white translate-y-[-1px]' 
                      : 'opacity-30 hover:opacity-100 hover:tracking-[0.25em]'
                  }`}
                >
                  <span className={`relative z-10 transition-colors ${activeTabIdx === i ? 'text-white' : 'text-current'}`}>
                    {cat.name}
                  </span>
                  {activeTabIdx === i && (
                    <div className="absolute inset-0 bg-[#862b2a] rounded-full shadow-[0_4px_15px_rgba(134,43,42,0.3)] animate-pop-in"></div>
                  )}
                </button>
              ))}
            </div>
         </div>
      </div>

      {/* --- SLIDING CONTENT --- */}
      <div className="relative overflow-hidden w-full h-full pb-32">
         {/* Minimal Index Badge */}
         <div className="absolute top-10 left-10 pointer-events-none opacity-[0.03] select-none font-serif italic text-9xl">
            {activeTabIdx + 1}
         </div>

         <div 
           ref={contentContainerRef}
           onScroll={handleContentScroll}
           className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar transition-all"
         >
            {categoryData.map((category, idx) => (
               <div 
                key={category._id} 
                className="w-full flex-shrink-0 snap-start px-6 pt-16 md:pt-24"
               >
                  <div className="max-w-7xl mx-auto">
                     {/* Category Header */}
                     <div className="flex flex-col md:flex-row items-baseline justify-between gap-8 mb-16 px-2">
                        <div className="animate-reveal-up">
                           <h2 className="text-2xl md:text-4xl font-bold tracking-tight uppercase mb-4 font-sans">
                              {category.name}
                           </h2>
                           <p className="max-w-xl text-[10px] md:text-[12px] opacity-40 font-medium uppercase tracking-[0.1em] leading-relaxed">
                              {category.description || 'Crafted with precision, our metal series embodies timeless aesthetics and unmatched quality.'}
                           </p>
                        </div>
                        
                        <button 
                          onClick={() => navigate(`/category/${category.slug}`)}
                          className="group flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 hover:text-[#862b2a] transition-all"
                        >
                           Full Collection <FaArrowRight className="transition-transform group-hover:translate-x-2" />
                        </button>
                     </div>

                     {/* Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {category.products.map((product, pIdx) => (
                           <div key={product.id} className="animate-reveal-up" style={{ animationDelay: `${pIdx * 0.05}s` }}>
                              <ProductCard product={product} />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            ))}
         </div>
         
         {/* Footer Controls */}
         <div className="max-w-7xl mx-auto px-6 mt-16 flex justify-between items-center opacity-40">
            <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em]">
               <span className="text-[#862b2a]">Collection</span>
               <span className="w-8 h-[1px] bg-current opacity-20"></span>
               <span>0{activeTabIdx + 1} of 0{categoryData.length}</span>
            </div>
            
            <div className="flex gap-2">
               <button 
                onClick={() => handleTabClick(activeTabIdx - 1)}
                className={`p-3 rounded-full border border-current hover:bg-[#862b2a] hover:text-white transition-all duration-300 disabled:opacity-0 ${activeTabIdx === 0 ? 'invisible' : ''}`}
                disabled={activeTabIdx === 0}
               >
                 <FaArrowLeft size={10} />
               </button>
               <button 
                onClick={() => handleTabClick(activeTabIdx + 1)}
                className={`p-3 rounded-full border border-current hover:bg-[#862b2a] hover:text-white transition-all duration-300 disabled:opacity-0 ${activeTabIdx === categoryData.length - 1 ? 'invisible' : ''}`}
                disabled={activeTabIdx === categoryData.length - 1}
               >
                 <FaArrowRight size={10} />
               </button>
            </div>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fade-in-blur { 
          from { opacity: 0; filter: blur(10px); transform: translateY(10px); } 
          to { opacity: 1; filter: blur(0); transform: translateY(0); } 
        }
        @keyframes reveal-up {
           from { opacity: 0; transform: translateY(20px); }
           to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop-in {
           from { transform: scale(0.9); opacity: 0; }
           to { transform: scale(1); opacity: 1; }
        }

        .animate-fade-in-blur { animation: fade-in-blur 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-reveal-up { animation: reveal-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .snap-x { scroll-snap-type: x mandatory; }
        .snap-start { scroll-snap-align: start; }
      `}} />
    </div>
  );
};

export default MetalMirrorPage;