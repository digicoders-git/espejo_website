import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart, FaCheck } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import PageLoader from "./PageLoader";

const PRODUCT_API = "https://glassadminpanelapi.onrender.com/api/products";

const AllProductsPage = ({ onBuyNow }) => {
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
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first to place an order!');
      setBuyingNow(prev => ({ ...prev, [product.id]: null }));
      return;
    }
    
    try {
      const addToCartPayload = {
        productId: product.id,
        quantity: 1
      };
      
      const cartResponse = await fetch('https://glassadminpanelapi.onrender.com/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(addToCartPayload)
      });
      
      if (cartResponse.ok) {
        setBuyingNow(prev => ({ ...prev, [product.id]: 'success' }));
        setTimeout(() => {
          navigate('/checkout');
        }, 500);
      } else {
        const error = await cartResponse.json();
        toast.error('Failed to add product to cart');
        setBuyingNow(prev => ({ ...prev, [product.id]: null }));
      }
      
    } catch (error) {
      toast.error('Network error. Please try again.');
      setBuyingNow(prev => ({ ...prev, [product.id]: null }));
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(PRODUCT_API);
        const data = await res.json();

        if (data?.products?.length > 0) {
          const mappedProducts = data.products.map((p, index) => ({
            id: p._id || index,
            img: p.mainImage?.url || "https://via.placeholder.com/400x300",
            title: p.name,
            price: `₹${(p.finalPrice || p.price).toLocaleString("en-IN")}`,
            oldPrice: p.discountPercent ? `₹${p.price.toLocaleString("en-IN")}` : "",
          }));

          setProducts(mappedProducts);
        }
      } catch (error) {
        // Error handled silently
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
    <div className={`min-h-screen p-5 ${isDark ? "bg-black" : "bg-white"} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold text-center mb-8 pt-8 ${isDark ? "text-white" : "text-black"}`}>
          All Products
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item, i) => (
            <div
              key={item.id || i}
              onClick={() => navigate(`/product/${item.id}`)}
              className={`relative rounded-xl overflow-hidden shadow-lg group cursor-pointer ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-[300px] object-cover rounded-xl"
                onError={(e) => (e.target.src = "https://via.placeholder.com/400x300")}
              />

              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent text-white">
                <h2 className="text-sm font-semibold truncate">{item.title}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-lg font-bold">{item.price}</p>
                  {item.oldPrice && (
                    <p className="text-gray-400 line-through text-sm">{item.oldPrice}</p>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isInWishlist(item.id)
                    ? removeFromWishlist(item.id)
                    : addToWishlist(item);
                }}
                className={`absolute top-4 left-4 p-2 rounded-full transition-colors z-20 ${
                  isInWishlist(item.id)
                    ? "bg-red-500 text-white"
                    : "bg-white/20 text-white hover:bg-red-500"
                }`}
              >
                <FaHeart size={16} />
              </button>

              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 md:group-hover:opacity-100 md:opacity-0 opacity-100 transition-opacity z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow(item);
                  }}
                  className="text-white px-3 py-2 rounded font-semibold text-sm flex items-center justify-center gap-2"
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
                  className="text-white px-3 py-2 rounded font-semibold text-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#a76665" }}
                  disabled={addingToCart[item.id]}
                >
                  {addingToCart[item.id] === 'loading' && <ImSpinner8 className="animate-spin" size={14} />}
                  {addingToCart[item.id] === 'success' && <FaCheck size={14} />}
                  {!addingToCart[item.id] && 'Add to Cart'}
                  {addingToCart[item.id] === 'loading' && 'Adding...'}
                  {addingToCart[item.id] === 'success' && 'Added!'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;