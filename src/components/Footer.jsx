import React, { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Footer = ({ onLoginClick }) => {
  const { isDark } = useTheme();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch(
          'https://glassadminpanelapi.onrender.com/api/products'
        );
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <footer className={`${isDark ? 'bg-black text-white' : 'bg-gray-100 text-black'} py-12 px-6 border-t`}>
      
      {/* ===== MAIN FOOTER GRID ===== */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* ========== OUR COMPANY ========== */}
        <div>
          <img
            src="/Logo/PNG/SLogo2.png"
            alt="ESPEJO Logo"
            className="h-[90px] object-contain mb-5 cursor-pointer"
            onClick={() => navigate('/')}
          />

          <h3 className="text-lg font-semibold mb-4">Our Company</h3>

          <ul className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-2 text-sm md:text-[16px]`}>
            <li onClick={() => isLoggedIn ? navigate('/profile') : onLoginClick()} className="cursor-pointer hover:text-[#862b2a]">
              {isLoggedIn ? 'My Account' : 'Login/Create account'}
            </li>
            <li onClick={() => navigate('/company-profile')} className="cursor-pointer hover:text-[#862b2a]">Company Profile</li>
            <li onClick={() => navigate('/about')} className="cursor-pointer hover:text-[#862b2a]">About Us</li>
            <li onClick={() => navigate('/contact')} className="cursor-pointer hover:text-[#862b2a]">Contact Us</li>
            <li onClick={() => navigate('/privacy-policy')} className="cursor-pointer hover:text-[#862b2a]">Privacy Policy</li>
            <li onClick={() => navigate('/refund-policy')} className="cursor-pointer hover:text-[#862b2a]">Refund Policy</li>
            <li onClick={() => navigate('/terms-of-service')} className="cursor-pointer hover:text-[#862b2a]">Terms of Service</li>
            <li onClick={() => navigate('/why-choose-espezo')} className="cursor-pointer hover:text-[#862b2a]">Why Choose ESPEJO?</li>
            <li onClick={() => navigate('/return-policy')} className="cursor-pointer hover:text-[#862b2a]">Return Policy</li>
          </ul>
        </div>

        {/* ========== EXPLORE + SOCIAL ========== */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Explore</h3>

          <ul className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-2 text-sm md:text-[16px] mb-6`}>
            <li onClick={() => navigate('/become-dealer')} className="cursor-pointer hover:text-[#862b2a]">Become a dealer</li>
            <li onClick={() => navigate('/sitemap')} className="cursor-pointer hover:text-[#862b2a]">Sitemap</li>
            <li onClick={() => navigate('/blog')} className="cursor-pointer hover:text-[#862b2a]">Blog</li>
          </ul>

          <h4 className="text-sm font-semibold mb-3">Follow Us</h4>

          <div className="flex gap-4">
            <SocialIcon icon={<FaFacebookF />} isDark={isDark} />
            <SocialIcon icon={<FaTwitter />} isDark={isDark} />
            <SocialIcon icon={<FaInstagram />} isDark={isDark} />
            <SocialIcon icon={<FaLinkedinIn />} isDark={isDark} />
          </div>
        </div>

        {/* ========== PRODUCTS ========== */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Products</h3>

          <ul className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-2 text-sm md:text-[16px]`}>
            {products
              .filter(p => p.category?.slug)
              .slice(0, 10)
              .map(product => (
                <li
                  key={product._id}
                  className="cursor-pointer hover:text-[#862b2a]"
                  onClick={() => navigate(`/category/${product.category.slug}`)}
                >
                  {product.name}
                </li>
              ))}
          </ul>
        </div>

      </div>

      {/* ===== BOTTOM BAR ===== */}
      <hr className="my-8 border-gray-700 opacity-30" />

      <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'} text-sm text-center`}>
        © {new Date().getFullYear()}
        <span className="text-[#862b2a] font-semibold"> Espejo </span>
        | Designed by{' '}
        <span
          className="text-[#862b2a] font-semibold cursor-pointer hover:text-[#6b1f1e]"
          onClick={() => window.open('https://digicoders.in/', '_blank')}
        >
          Team DigiCoders
        </span>
      </p>
    </footer>
  );
};

/* ===== CLEAN SOCIAL ICON ===== */
const SocialIcon = ({ icon, isDark }) => (
  <div
    className={`
      w-9 h-9 flex items-center justify-center rounded-full
      cursor-pointer transition-all duration-300
      ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}
      hover:bg-[#862b2a] hover:text-white
    `}
  >
    {icon}
  </div>
);

export default Footer;
