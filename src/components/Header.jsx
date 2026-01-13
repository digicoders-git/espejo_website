import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaHeart,
  FaMoon,
  FaSun,
  FaChevronDown,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Header = ({ onUserClick }) => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { getTotalItems } = useCart();
  const { wishlistItems } = useWishlist(); // ✅ FIX
  const { isDark, toggleTheme } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();

  // ✅ SAFE WISHLIST COUNT (API + LOCAL dono ke liye)
  const wishlistCount = Array.isArray(wishlistItems)
    ? wishlistItems.length
    : wishlistItems?.items?.length ||
      wishlistItems?.wishlist?.length ||
      0;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://glassadminpanelapi.onrender.com/api/categories"
        );
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        // console.error("Category fetch error:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const Menu = [
    { name: "Home", path: "/" },
    { name: "BestSeller", path: "/bestseller" },
    { name: "Products", path: "/metal-mirror" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  const isActiveMenu = (item) => location.pathname === item.path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
    setSearchOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      } shadow`}
    >
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-2">

        {/* MOBILE MENU */}
        <div className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          {open ? <FaTimes /> : <FaBars />}
        </div>

        {/* LOGO */}
        <div
          className="cursor-pointer mx-auto md:mx-0"
          onClick={() => navigate("/")}
        >
          <img
            src="/Logo/PNG/Logo.png"
            alt="Logo"
            className="h-[30px] md:h-[60px] object-contain"
          />
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex gap-8 font-semibold">
          {Menu.map((item) => (
            <li
              key={item.name}
              className={`cursor-pointer transition ${
                isActiveMenu(item) ? "text-[#862b2a]" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </li>
          ))}
        </ul>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-4 text-xl">
          {/* WISHLIST */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/wishlist")}
          >
            <FaHeart />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* CART */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#862b2a] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {getTotalItems()}
              </span>
            )}
          </div>

          {/* THEME */}
          <div className="cursor-pointer" onClick={toggleTheme}>
            {isDark ? <FaSun /> : <FaMoon />}
          </div>

          {/* USER */}
          {isLoggedIn ? (
            <div
              className="w-8 h-8 bg-[#862b2a] text-white rounded-full flex items-center justify-center cursor-pointer font-bold"
              onClick={() => navigate("/profile")}
            >
              {(user?.name || user?.firstName || user?.email)?.charAt(0)?.toUpperCase() || "U"}
            </div>
          ) : (
            <FaUser className="cursor-pointer" onClick={onUserClick} />
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div
          className={`md:hidden px-4 py-4 ${
            isDark ? "bg-black" : "bg-white"
          }`}
        >
          {Menu.map((item) => (
            <div
              key={item.name}
              className="py-2 font-semibold cursor-pointer"
              onClick={() => {
                navigate(item.path);
                setOpen(false);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}

      {/* SEARCH */}
      {searchOpen && (
        <form onSubmit={handleSearch} className="p-3 border-t">
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full p-2 rounded border"
          />
        </form>
      )}
    </header>
  );
};

export default Header;
