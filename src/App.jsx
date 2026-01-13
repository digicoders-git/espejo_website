
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header.jsx'
import HomePage from './components/HomePage.jsx'
import BestSellerPage from './components/BestSellerPage.jsx'
import MetalMirrorPage from './components/MetalMirrorPage.jsx'
import AboutUsPage from './components/AboutUsPage.jsx'
import ContactUsPage from './components/ContactUsPage.jsx'
import CompanyProfilePage from './components/CompanyProfilePage.jsx'
import PrivacyPolicyPage from './components/PrivacyPolicyPage.jsx'
import RefundPolicyPage from './components/RefundPolicyPage.jsx'
import TermsOfServicePage from './components/TermsOfServicePage.jsx'
import ProductCategoryPage from './components/ProductCategoryPage.jsx'
import CategoryPage from './components/CategoryPage.jsx'
import CategoriesPage from './components/CategoriesPage.jsx'
import BecomeDealerPage from './components/BecomeDealerPage.jsx'
import SitemapPage from './components/SitemapPage.jsx'
import BlogPage from './components/BlogPage.jsx'
import BlogDetailPage from './components/BlogDetailPage.jsx'
import OrderDetailPage from './components/OrderDetailPage.jsx'
import AllProductsPage from './components/AllProductsPage.jsx'
import ProductDetailPage from './components/ProductDetailPage.jsx'
import OffersPage from './components/OffersPage.jsx'
import WhyChooseEspezoPage from './components/WhyChooseEspezoPage.jsx'
import ReturnPolicyPage from './components/ReturnPolicyPage.jsx'
import SearchPage from './components/SearchPage.jsx'
import WishlistPage from './components/WishlistPage.jsx'
import ProfilePage from './components/ProfilePage.jsx'
import Footer from './components/Footer.jsx'
import CartPage from './components/CartPage.jsx'
import CheckoutPage from './components/CheckoutPage.jsx'
import AuthModal from './components/AuthModal.jsx'
import ScrollToTopButton from './components/ScrollToTop.jsx'
import CustomLoader from './components/CustomLoader.jsx'
import PageLoader from './components/PageLoader.jsx'
import { CartProvider, useCart } from './context/CartContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { OrderProvider } from './context/OrderContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LoadingProvider, useLoading } from './context/LoadingContext.jsx'


function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  return (
    <OrderProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <LoadingProvider>
              <MainContent />
            </LoadingProvider>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </OrderProvider>
  );
};

function MainContent() {
  const [showAuth, setShowAuth] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pendingCheckout, setPendingCheckout] = useState(null);
  const { isLoggedIn } = useAuth();
  const { isLoading } = useLoading();
  const { addToCart } = useCart();

  const handleBuyNow = async (item) => {
    setSelectedItem(item);
    
    if (isLoggedIn) {
      // Add item to cart first, then redirect to checkout
      await addToCart(item);
      window.location.href = '/checkout';
    } else {
      setPendingCheckout(item);
      setShowAuth(true);
    }
  };

  const handleLoginSuccess = async () => {
    if (pendingCheckout) {
      // Add item to cart after login, then redirect to checkout
      await addToCart(pendingCheckout);
      window.location.href = '/checkout';
      setPendingCheckout(null);
    }
  };

  return (
    <>
      <ScrollToTopOnRouteChange />
      {isLoading && <PageLoader />}
      
      <Header onUserClick={() => setShowAuth(true)} />
      
      <Routes>
        <Route path="/" element={<HomePage onBuyNow={handleBuyNow} />} />
        <Route path="/bestseller" element={<BestSellerPage onBuyNow={handleBuyNow} />} />
        <Route path="/metal-mirror" element={<MetalMirrorPage onBuyNow={handleBuyNow} />} />
        <Route path="/about" element={<AboutUsPage onBuyNow={handleBuyNow} />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/company-profile" element={<CompanyProfilePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/products/:category" element={<ProductCategoryPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/category/:slug" element={<CategoryPage onBuyNow={handleBuyNow} />} />
        <Route path="/become-dealer" element={<BecomeDealerPage />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/order/:orderId" element={<OrderDetailPage />} />
        <Route path="/all-products" element={<AllProductsPage onBuyNow={handleBuyNow} />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/why-choose-espezo" element={<WhyChooseEspezoPage />} />
        <Route path="/return-policy" element={<ReturnPolicyPage />} />
        <Route path="/search" element={<SearchPage onBuyNow={handleBuyNow} />} />
        <Route path="/wishlist" element={<WishlistPage onBuyNow={handleBuyNow} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Footer onLoginClick={() => setShowAuth(true)} />
      
      <CustomLoader />
      <ScrollToTopButton />
      
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
