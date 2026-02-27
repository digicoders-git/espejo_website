import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaHeart, FaCheck } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageLoader from "./PageLoader";
import ProductService from "../services/ProductService";

const BestSeller = ({ onBuyNow }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [buyingNow, setBuyingNow] = useState({});

  const handleBuyNow = async (product) => {
    setBuyingNow(prev => ({ ...prev, [product.id]: 'loading' }));
    
    try {
      setBuyingNow(prev => ({ ...prev, [product.id]: 'success' }));
      setTimeout(() => {
        navigate('/checkout', { 
          state: { 
            buyNowItem: {
              id: product.id,
              title: product.title,
              price: product.newPrice || product.price,
              img: product.img,
              quantity: 1
            }
          }
        });
      }, 500);
      
    } catch (error) {
      setBuyingNow(prev => ({ ...prev, [product.id]: null }));
    }
  };

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getBestSellers(8);
        
        if (response.success && response.products.length > 0) {
          const mappedProducts = response.products.map(p => ({
            id: p.id,
            img: p.image,
            title: p.name,
            reviews: p.reviews || 0,
            rating: p.rating || 0,
            oldPrice: p.originalPrice ? `₹${p.originalPrice}` : "",
            newPrice: typeof p.price === 'number' ? `₹${p.price}` : p.price,
            price: typeof p.price === 'number' ? `₹${p.price}` : p.price,
            inStock: p.inStock,
            isBestSeller: p.isBestSeller
          }));
          setProducts(mappedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching bestseller products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className={`p-4 ${isDark ? "bg-black" : "bg-white"}`}>
      {/* <h1
        className={`text-center text-3xl font-semibold p-4 ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        Best Seller
      </h1> */}

      {!loading && products.length === 0 && (
        <p className="text-center py-10">No products found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item, index) => (
          <div
            key={item.id || index}
            onClick={() => navigate(`/product/${item.id}`)}
            className={`rounded overflow-hidden ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} relative shadow-lg h-[520px] flex flex-col cursor-pointer`}
          >
            {/* IMAGE */}
            <div className="relative">
              {item.isBestSeller && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md bg-[#a76665] text-white">
                    <FaStar size={8} />
                    Best Seller
                  </span>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isInWishlist(item.id)
                    ? removeFromWishlist(item.id)
                    : addToWishlist(item);
                }}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-20 ${
                  isInWishlist(item.id)
                    ? "bg-red-500 text-white shadow-lg"
                    : isDark 
                      ? "bg-gray-800/80 text-white hover:bg-red-500" 
                      : "bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white"
                }`}
              >
                <FaHeart size={14} />
              </button>

              <img
                src={item.img}
                alt={item.title}
                className="w-full h-[300px] object-cover"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/400")
                }
              />
            </div>

            {/* QUICK SHOP */}
            <div className={`${isDark ? 'bg-gray-700 text-white' : 'bg-black text-white'} text-center py-3 font-semibold text-sm`}>
              QUICK SHOP
            </div>

            {/* DETAILS */}
            <div className="p-3 flex-1 flex flex-col">
              <p className={`font-bold text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>ESPEJO</p>

              <h3 className="font-semibold mt-1 text-sm line-clamp-2 flex-1">
                {item.title}
              </h3>

              {/* RATING */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-yellow-400 text-sm">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < Math.floor(item.rating) ? (
                      <FaStar key={i} />
                    ) : (
                      <FaRegStar key={i} />
                    )
                  )}
                </div>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>({item.reviews})</span>
              </div>

              {/* PRICE */}
              <div className="mt-2 flex items-center gap-3">
                <p className="font-bold text-lg text-[#a76665]">
                  {item.newPrice}
                </p>
                {item.oldPrice && (
                  <p className={`text-xs line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {item.oldPrice}
                  </p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow(item);
                  }}
                  className="flex-1 text-white py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-wide flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#898383" }}
                  disabled={buyingNow[item.id]}
                >
                  {buyingNow[item.id] === 'loading' && <ImSpinner8 className="animate-spin" size={12} />}
                  {buyingNow[item.id] === 'success' && <FaCheck size={12} />}
                  {!buyingNow[item.id] && 'Buy Now'}
                </button>

                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    setAddingToCart(prev => ({ ...prev, [item.id]: 'loading' }));
                    await addToCart(item);
                    setAddingToCart(prev => ({ ...prev, [item.id]: 'success' }));
                    setTimeout(() => {
                      setAddingToCart(prev => ({ ...prev, [item.id]: null }));
                    }, 1500);
                  }}
                  className="flex-1 text-white py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-wide flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#a76665" }}
                  disabled={addingToCart[item.id]}
                >
                  {addingToCart[item.id] === 'loading' && <ImSpinner8 className="animate-spin" size={12} />}
                  {addingToCart[item.id] === 'success' && <FaCheck size={12} />}
                  {!addingToCart[item.id] && 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
