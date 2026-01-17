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

const BestSeller = ({ onBuyNow, minRating = 0 }) => {
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
        const response = await ProductService.getFeaturedProducts(8, minRating);
        
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
            inStock: p.inStock
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
  }, [minRating]);

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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isInWishlist(item.id)
                    ? removeFromWishlist(item.id)
                    : addToWishlist(item);
                }}
                className={`absolute top-4 right-4 p-2 rounded-full z-10 ${
                  isInWishlist(item.id)
                    ? "bg-red-500 text-white"
                    : isDark 
                    ? "bg-gray-700 text-white hover:bg-red-500 hover:text-white"
                    : "bg-white text-gray-700 hover:bg-red-500 hover:text-white"
                }`}
              >
                <FaHeart size={16} />
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
              <div className="mt-2">
                {item.oldPrice && (
                  <p className={`text-xs line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {item.oldPrice}
                  </p>
                )}
                <p className="font-bold text-base text-[#a76665]">
                  {item.newPrice}
                </p>
              </div>

              {/* BUTTONS */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow(item);
                  }}
                  className="flex-1 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1 text-xs"
                  style={{ backgroundColor: "#898383" }}
                  disabled={buyingNow[item.id]}
                >
                  {buyingNow[item.id] === 'loading' && <ImSpinner8 className="animate-spin" size={12} />}
                  {buyingNow[item.id] === 'success' && <FaCheck size={12} />}
                  {!buyingNow[item.id] && 'Buy Now'}
                  {buyingNow[item.id] === 'loading' && 'Processing...'}
                  {buyingNow[item.id] === 'success' && 'Redirecting...'}
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
                  className="flex-1 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1 text-xs"
                  style={{ backgroundColor: "#a76665" }}
                  disabled={addingToCart[item.id]}
                >
                  {addingToCart[item.id] === 'loading' && <ImSpinner8 className="animate-spin" size={12} />}
                  {addingToCart[item.id] === 'success' && <FaCheck size={12} />}
                  {!addingToCart[item.id] && 'Add to Cart'}
                  {addingToCart[item.id] === 'loading' && 'Adding...'}
                  {addingToCart[item.id] === 'success' && 'Added!'}
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
