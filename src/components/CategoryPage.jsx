import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FaHeart, FaArrowLeft } from "react-icons/fa";
import PageLoader from "./PageLoader";

const CATEGORY_API = "https://glassadminpanelapi.onrender.com/api/categories";
const PRODUCT_API = "https://glassadminpanelapi.onrender.com/api/products";

const CategoryPage = ({ onBuyNow }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* ========= FETCH CATEGORIES FROM API ========= */
        const catRes = await fetch(CATEGORY_API);
        const catData = await catRes.json();

        // Check for specific categories first
        if (slug === 'mirror' || slug === 'console' || slug === 'console-mirror') {
          // console.log(`🔍 Handling special category: ${slug}`);
          let categoryName, categoryDescription;
          
          if (slug === 'mirror') {
            categoryName = 'Mirror';
            categoryDescription = 'Premium mirrors with elegant designs and superior quality';
          } else if (slug === 'console') {
            categoryName = 'Console';
            categoryDescription = 'Premium console tables with modern designs and storage solutions';
          } else {
            categoryName = 'Console + Mirror';
            categoryDescription = 'Complete console and mirror combinations for elegant interiors';
          }
          
          setCategory({
            _id: slug,
            name: categoryName,
            slug: slug,
            description: categoryDescription
          });

          /* ========= FETCH PRODUCTS ========= */
          // console.log(`🔄 Fetching products for ${slug}...`);
          const prodRes = await fetch(PRODUCT_API);
          const prodData = await prodRes.json();
          
          // console.log(`📊 Products API response:`, prodData);
          // console.log(`📊 Total products:`, prodData?.products?.length);

          // Filter products by category name with multiple variations
          const filteredProducts = prodData?.products?.filter((p) => {
            const productCategoryName = p.category?.name?.toLowerCase();
            // console.log(`🔍 Product: ${p.name}, Category: ${productCategoryName}`);
            
            if (slug === 'mirror') {
              const matches = productCategoryName?.includes('mirror') && 
                             !productCategoryName?.includes('console');
              // console.log(`🔍 Mirror match for "${productCategoryName}": ${matches}`);
              return matches;
            } else if (slug === 'console') {
              const matches = (productCategoryName?.includes('console') || 
                             productCategoryName?.includes('console table') ||
                             productCategoryName?.includes('console tables')) &&
                             !productCategoryName?.includes('mirror');
              // console.log(`🔍 Console match for "${productCategoryName}": ${matches}`);
              return matches;
            } else {
              const matches = productCategoryName?.includes('console') && 
                             productCategoryName?.includes('mirror');
              // console.log(`🔍 Console+Mirror match for "${productCategoryName}": ${matches}`);
              return matches;
            }
          }) || [];
          
          // console.log(`✅ Filtered products for ${slug}:`, filteredProducts);
          // console.log(`✅ Filtered products count:`, filteredProducts.length);

          const mappedProducts = filteredProducts.map((p, index) => ({
            id: p._id || `prod-${index}`,
            img: p.mainImage?.url || "https://via.placeholder.com/400",
            title: p.name,
            oldPrice: p.discountPercent ? `₹${p.price.toLocaleString()}` : "",
            newPrice: `₹${(p.finalPrice || p.price).toLocaleString()}`,
            price: `₹${(p.finalPrice || p.price).toLocaleString()}`,
          }));

          setProducts(mappedProducts);
          setLoading(false);
          return;
        }

        // Handle other categories from API
        const foundCategory = catData?.categories?.find(
          (cat) => cat.slug === slug
        );

        if (!foundCategory) {
          setCategory(null);
          setProducts([]);
          return;
        }

        setCategory(foundCategory);

        /* ========= FETCH PRODUCTS ========= */
        const prodRes = await fetch(PRODUCT_API);
        const prodData = await prodRes.json();

        // filter by category _id (NOT slug)
        const filteredProducts =
          prodData?.products?.filter(
            (p) => p.category?._id === foundCategory._id
          ) || [];

        const mappedProducts = filteredProducts.map((p, index) => ({
          id: p._id || `prod-${index}`,
          img: p.mainImage?.url || "https://via.placeholder.com/400",
          title: p.name,
          oldPrice: p.discountPercent ? `₹${p.price}` : "",
          newPrice: `₹${p.finalPrice || p.price}`,
          price: `₹${p.finalPrice || p.price}`,
        }));

        setProducts(mappedProducts);
      } catch (error) {
        // console.error("Category fetch error:", error);
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  /* ========= LOADING ========= */
  if (loading) {
    return <PageLoader />;
  }

  /* ========= CATEGORY NOT FOUND ========= */
  if (!category) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div className="text-center">
          <p className="text-xl mb-4">Category not found</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#862b2a] text-white px-6 py-3 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-2xl hover:text-[#862b2a]"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2 text-lg text-gray-500">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* PRODUCTS */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              No products found in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => navigate(`/product/${item.id}`)}
                className={`rounded overflow-hidden shadow-lg transition-all duration-300 cursor-pointer ${
                  isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}
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
                    className={`absolute top-4 right-4 p-2 rounded-full z-10 transition-colors ${
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
                      (e.target.src =
                        "https://via.placeholder.com/400")
                    }
                  />
                </div>

                {/* DETAILS */}
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="mt-2">
                    {item.oldPrice && (
                      <p className={`text-sm line-through ${
                        isDark ? 'text-gray-400' : 'text-gray-400'
                      }`}>
                        {item.oldPrice}
                      </p>
                    )}
                    <p className="font-bold text-lg text-[#862b2a]">
                      From {item.newPrice}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuyNow && onBuyNow(item);
                      }}
                      className="w-1/2 bg-[#898383] text-white py-2 rounded-lg"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="w-1/2 bg-[#862b2a] text-white py-2 rounded-lg"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
