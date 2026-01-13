import React, { createContext, useContext, useEffect, useState } from "react";
import { showInfo, showSuccess, showError } from "../components/CustomLoader";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlistItems');
    if (savedWishlist) {
      try {
        const items = JSON.parse(savedWishlist);
        setWishlistItems(Array.isArray(items) ? items : []);
      } catch (error) {
        // console.error('Error loading wishlist from localStorage:', error);
        setWishlistItems([]);
      }
    }
    
    // Also try to fetch from API
    if (getToken()) {
      fetchWishlist();
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // FETCH WISHLIST FROM API
  const fetchWishlist = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch("https://glassadminpanelapi.onrender.com/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      // console.log('✅ Wishlist API response:', data);
      
      if (response.ok && data.products) {
        const formattedItems = data.products.map(product => ({
          id: product._id,
          productId: product._id,
          title: product.name || product.title,
          name: product.name || product.title,
          price: `₹${product.finalPrice || product.price}`,
          img: product.mainImage?.url || product.img || product.image || product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image',
          video: product.video,
          oldPrice: product.discountPercent ? `₹${product.price}` : null,
          discountPercent: product.discountPercent,
          ...product
        }));
        
        setWishlistItems(formattedItems);
        // console.log('📦 Wishlist items loaded:', formattedItems.length);
      }
    } catch (error) {
      // console.error("Wishlist fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ADD TO WISHLIST
  const addToWishlist = async (product) => {
    const productId = product._id || product.id;
    
    // Check if already in wishlist
    if (isInWishlist(productId)) {
      showInfo("Item already in wishlist");
      return false;
    }

    // Format product for wishlist
    const wishlistItem = {
      id: productId,
      productId: productId,
      title: product.name || product.title,
      name: product.name || product.title,
      price: product.price || product.newPrice,
      img: product.mainImage?.url || product.img || product.image || product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image',
      video: product.video,
      ...product
    };

    // Add to local state immediately
    setWishlistItems(prev => [...prev, wishlistItem]);
    showSuccess(`${product.name || product.title} added to wishlist!`);

    // Try to sync with API
    const token = getToken();
    if (token) {
      try {
        const response = await fetch("https://glassadminpanelapi.onrender.com/api/wishlist/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId })
        });

        if (!response.ok) {
          // console.error('API sync failed, but item added locally');
        }
      } catch (error) {
        // console.error("API sync error:", error);
      }
    }

    return true;
  };

  // REMOVE FROM WISHLIST
  const removeFromWishlist = async (productId) => {
    // Remove from local state immediately
    setWishlistItems(prev => prev.filter(item => 
      item.id !== productId && item.productId !== productId && item._id !== productId
    ));
    showInfo("Item removed from wishlist");

    // Try to sync with API
    const token = getToken();
    if (token) {
      try {
        await fetch(`https://glassadminpanelapi.onrender.com/api/wishlist/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        // console.error("API sync error:", error);
      }
    }

    return true;
  };

  // CLEAR WISHLIST
  const clearWishlist = async () => {
    setWishlistItems([]);
    showSuccess("Wishlist cleared!");

    // Try to sync with API
    const token = getToken();
    if (token) {
      try {
        await fetch("https://glassadminpanelapi.onrender.com/api/wishlist/clear", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        // console.error("API sync error:", error);
      }
    }
  };

  // CHECK IF ITEM IS IN WISHLIST
  const isInWishlist = (productId) => {
    return Array.isArray(wishlistItems) && wishlistItems.some(item => 
      item.id === productId || item.productId === productId || item._id === productId
    );
  };

  // GET WISHLIST COUNT
  const getWishlistCount = () => {
    return Array.isArray(wishlistItems) ? wishlistItems.length : 0;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        getWishlistCount,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};