import React, { useState, useEffect } from 'react';
import { 
  FaTimes, FaHeart, FaShoppingCart, FaStar, FaCheck, FaInfoCircle, 
  FaTools, FaShieldAlt, FaTruck, FaGem, FaRedoAlt, FaLeaf, FaBoxOpen
} from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import ProductService from '../services/ProductService';

const ProductQuickView = ({ productId, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isDark } = useTheme();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || !isOpen) return;
      
      try {
        setLoading(true);
        const response = await ProductService.getProductById(productId);
        
        if (response.success) {
          setProduct(response.product);
          setSelectedImage(0);
          setQuantity(1);
          setActiveTab('description');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, isOpen]);

  const handleAddToCart = async (e) => {
    if (e) e.stopPropagation();
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: `₹${product.price}`,
        img: product.images[0],
        quantity: quantity
      });
    } finally {
      setTimeout(() => setAddingToCart(false), 500);
    }
  };

  const handleWishlistToggle = (e) => {
    if (e) e.stopPropagation();
    if (!product) return;
    const item = {
      id: product.id,
      title: product.name,
      price: `₹${product.price}`,
      img: product.images[0]
    };
    isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(item);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 md:p-10 animate-fade-in overflow-hidden">
      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-6xl max-h-[95vh] flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl animate-scale-up ${
          isDark ? 'bg-[#0a0a0a] text-white border border-white/10' : 'bg-white text-black'
        }`}
      >
        {/* Close Button Mobile/Global */}
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 z-[60] p-3 rounded-full shadow-lg transition-all hover:rotate-90 active:scale-95 ${
            isDark ? 'bg-white/10 text-white hover:bg-[#862b2a]' : 'bg-black/5 text-black hover:bg-[#862b2a] hover:text-white'
          }`}
        >
          <FaTimes size={18} />
        </button>

        {loading ? (
          <div className="w-full min-h-[400px] flex flex-col items-center justify-center">
            <ImSpinner8 className="animate-spin text-[#862b2a]" size={60} />
            <p className="mt-6 text-xs uppercase tracking-[0.3em] font-bold opacity-40">Loading Excellence</p>
          </div>
        ) : product ? (
          <>
            {/* Left Column: Media Gallery (Fixed height or scroll on mobile) */}
            <div className={`w-full md:w-5/12 p-4 md:p-10 flex flex-col items-center bg-opacity-30 border-r ${isDark ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-black/5 overflow-y-auto'}`}>
              <div className="w-full relative aspect-square rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 group shadow-inner">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 transition-transform duration-1000 group-hover:scale-110"
                />
                {product.discountPercent > 0 && (
                   <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl">
                      -{product.discountPercent}%
                   </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all p-0.5 ${
                        selectedImage === idx ? 'border-[#862b2a] scale-105' : 'border-transparent opacity-40 hover:opacity-100'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover rounded-sm" alt="" />
                    </button>
                  ))}
                </div>
              )}

              {/* Stats & Trust */}
              <div className="grid grid-cols-2 gap-3 mt-10 w-full">
                 <div className="flex flex-col items-center p-4 rounded-xl border border-opacity-10" style={{borderColor: '#862b2a'}}>
                    <FaShieldAlt className="text-[#862b2a] text-xl mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center">5 Year<br/>Warranty</span>
                 </div>
                 <div className="flex flex-col items-center p-4 rounded-xl border border-opacity-10" style={{borderColor: '#862b2a'}}>
                    <FaTruck className="text-[#862b2a] text-xl mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center">Insured<br/>Shipping</span>
                 </div>
              </div>
            </div>

            {/* Right Column: Details & Tabs (Scrollable body) */}
            <div className={`w-full md:w-7/12 p-6 md:p-12 overflow-y-auto no-scrollbar`}>
              <div className="max-w-xl mx-auto md:mx-0">
                
                {/* Header Information */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-[#862b2a] text-white rounded-full">
                        {product.category}
                     </span>
                     <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 text-yellow-600 rounded-full">
                        <FaStar size={10} />
                        <span className="text-[10px] font-bold">{product.rating || '4.8'}</span>
                     </div>
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight leading-tight uppercase font-serif">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center gap-6 mb-4">
                     <div className="flex flex-col">
                        <span className="text-4xl font-bold text-[#862b2a]">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm opacity-30 line-through decoration-red-500">M.R.P. ₹{product.originalPrice.toLocaleString()}</span>
                        )}
                     </div>
                     <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${product.inStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{product.inStock ? 'Ready for shipping' : 'Out of Stock'}</span>
                     </div>
                  </div>
                </div>

                {/* Content Tabs */}
                <div className="mb-10">
                   <div className={`flex gap-8 border-b mb-6 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      {[
                        { id: 'description', label: 'Details', icon: <FaInfoCircle /> },
                        { id: 'specs', label: 'Tech Specs', icon: <FaTools /> },
                        { id: 'care', label: 'Care', icon: <FaLeaf /> }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                             activeTab === tab.id ? 'text-[#862b2a] opacity-100' : 'opacity-30 hover:opacity-100'
                          }`}
                        >
                           {tab.icon} {tab.label}
                           {activeTab === tab.id && <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#862b2a] rounded-t-full shadow-[0_0_10px_rgba(134,43,42,0.5)]"></span>}
                        </button>
                      ))}
                   </div>

                   <div className="min-h-[160px] animate-fade-in-up">
                      {activeTab === 'description' && (
                        <div className="space-y-4">
                           <p className="text-sm md:text-base leading-relaxed opacity-70">
                              {product.description}
                           </p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                              {(product.features?.length > 0 ? product.features : ['Reinforced Frame', 'Crystal HD Clarity', 'Anti-Fog Coating']).map((f, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs font-medium">
                                   <div className="flex-shrink-0 w-5 h-5 rounded-full border border-[#862b2a] flex items-center justify-center text-[#862b2a]">
                                      <FaCheck size={8} />
                                   </div>
                                   {f}
                                </div>
                              ))}
                           </div>
                        </div>
                      )}

                      {activeTab === 'specs' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           {Object.entries(product.specifications || {}).map(([key, val]) => (
                             val && (
                               <div key={key} className="flex flex-col border-b border-white/5 pb-2">
                                  <span className="text-[10px] uppercase font-bold opacity-30 tracking-widest">{key}</span>
                                  <span className="text-xs font-semibold">{val}</span>
                               </div>
                             )
                           ))}
                        </div>
                      )}

                      {activeTab === 'care' && (
                        <div className="space-y-4">
                           {product.careInstructions?.map((c, i) => (
                              <div key={i} className="flex gap-4 items-start bg-opacity-5 p-3 rounded-lg" style={{backgroundColor: '#862b2a10'}}>
                                 <FaRedoAlt className="text-[#862b2a] mt-1 shrink-0" size={14} />
                                 <p className="text-xs font-medium opacity-80">{c}</p>
                              </div>
                           ))}
                        </div>
                      )}
                   </div>
                </div>

                {/* Purchase Area */}
                <div className={`flex flex-col gap-6 pt-10 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                   <div className="flex items-center gap-8">
                      <div className="space-y-2">
                         <span className="text-[10px] uppercase font-black tracking-widest opacity-40">Select Qty</span>
                         <div className={`flex items-center rounded-2xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                            <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-5 py-3 hover:text-[#862b2a] transition-colors font-bold">-</button>
                            <span className="px-6 py-3 font-black text-sm">{quantity}</span>
                            <button onClick={() => setQuantity(q => q+1)} className="px-5 py-3 hover:text-[#862b2a] transition-colors font-bold">+</button>
                         </div>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <span className="text-[10px] uppercase font-black tracking-widest opacity-40">Final Value</span>
                        <div className="text-xl font-black text-[#862b2a]">₹{(product.price * quantity).toLocaleString()}</div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                         onClick={handleAddToCart}
                         disabled={!product.inStock || addingToCart}
                         className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#862b2a] text-white font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl shadow-[#862b2a]/20"
                      >
                         {addingToCart ? <ImSpinner8 className="animate-spin" size={18} /> : <><FaShoppingCart size={16} /> Add to Cart</>}
                      </button>
                      <button 
                         onClick={handleWishlistToggle}
                         className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                            isInWishlist(product.id) ? 'bg-red-500 border-red-500 text-white' : 'border-black/10 dark:border-white/10 opacity-30 hover:opacity-100 hover:border-[#862b2a] hover:text-[#862b2a]'
                         }`}
                      >
                         <FaHeart size={16} /> {isInWishlist(product.id) ? 'Loved' : 'Fav'}
                      </button>
                   </div>
                </div>

                {/* Footer Badges */}
                <div className="mt-12 flex flex-wrap gap-6 opacity-30 justify-center md:justify-start">
                   <div className="flex items-center gap-2"><FaBoxOpen size={12} /> <span className="text-[8px] font-bold uppercase tracking-widest">Premium Package</span></div>
                   <div className="flex items-center gap-2"><FaLayerGroup size={12} /> <span className="text-[8px] font-bold uppercase tracking-widest">Crafted In India</span></div>
                </div>

              </div>
            </div>
          </>
        ) : null}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-up { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default ProductQuickView;