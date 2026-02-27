import React, { createContext, useContext, useEffect, useState } from "react";
import { showCart, showInfo } from "../components/CustomLoader";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://glassadminpanelapi.onrender.com/api";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    // console.log('🔑 Token check:', storedToken ? 'Found' : 'Not found');
    
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp < currentTime) {
          // console.warn('⚠️ Token is EXPIRED!');
          localStorage.removeItem('token');
          return;
        } else {
          // console.log('✅ Token is valid');
          setToken(storedToken);
        }
      } catch (error) {
        // console.error('🚨 Token parsing error:', error);
        localStorage.removeItem('token');
        return;
      }
    }
  }, []);

  // 🔄 Load cart from backend and sync with local state
  const loadCartFromBackend = async () => {
    try {
      if (!token) {
        // console.warn('⚠️ No token found - loading from localStorage');
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
          // console.log('📦 Cart loaded from localStorage');
        }
        return;
      }

      // console.log('📡 Loading cart from backend...');
      const response = await fetch(
        `${API_BASE_URL}/cart`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();
      
      if (response.ok) {
        // console.log('✅ Cart Load Success:', responseData);
        
        // Handle nested cart structure
        const cartData = responseData.cart || responseData;
        
        // Sync backend cart with local state
        if (cartData.items && Array.isArray(cartData.items)) {
          const formattedItems = await Promise.all(
            cartData.items.map(async (item) => {
              // console.log('🔍 Raw item:', item);
              const product = item.product || {};
              
              // If product details are missing, fetch from products API
              let fullProduct = product;
              if (!product.img && !product.image && item.productId) {
                try {
                  const productRes = await fetch(
                    `${API_BASE_URL}/products/${item.productId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  if (productRes.ok) {
                    const productData = await productRes.json();
                    fullProduct = productData.product || productData;
                    // console.log('📦 Fetched product:', fullProduct);
                  }
                } catch (err) {
                  // console.error('❌ Product fetch error:', err);
                }
              }
              
              return {
                id: item.productId || fullProduct._id || item._id,
                title: fullProduct.title || fullProduct.name || 'Product',
                price: fullProduct.finalPrice || fullProduct.price || fullProduct.newPrice || '₹0',
                img: fullProduct.mainImage?.url || fullProduct.img || fullProduct.image || fullProduct.images?.[0] || 'https://via.placeholder.com/400x300',
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                addOnName: item.addOnName,
                addOnPrice: item.addOnPrice
              };
            })
          );
          
          // console.log('📦 Formatted items with images:', formattedItems);
          setCartItems(formattedItems);
          localStorage.setItem('cartItems', JSON.stringify(formattedItems));
          // console.log('🔄 Cart synced:', formattedItems.length, 'items');
        } else {
          // console.log('📦 Backend cart is empty');
          setCartItems([]);
          localStorage.removeItem('cartItems');
        }
      } else {
        console.error('❌ Cart Load Error:', {
          status: response.status,
          data: responseData
        });
        
        // Fallback to localStorage if backend fails
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
          console.log('📦 Fallback: Cart loaded from localStorage');
        }
      }
    } catch (error) {
      console.error('🚨 Cart Load Error:', error.message);
      
      // Fallback to localStorage on network error
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
        console.log('📦 Fallback: Cart loaded from localStorage');
      }
    }
  };

  // Load cart on mount and when token changes
  useEffect(() => {
    if (token) {
      loadCartFromBackend();
    }
  }, [token]);

  //  ADD TO CART (LOCAL + API)
  const addToCart = async (product, options = {}) => {
    //  backend-safe productId
    const productId = product._id || product.id;
    const { quantity = 1, size, color, addOnName, addOnPrice } = options;

    console.log('🛒 Adding to cart:', {
      product: product.name || product.title,
      productId,
      quantity,
      size,
      color,
      addOnName,
      addOnPrice,
      token: token ? 'Present' : 'Missing'
    });

    //  Backend sync FIRST (to ensure persistence)
    try {
      if (!token) {
        console.warn('⚠️ No token found - only local storage');
        // Still update local for immediate UI feedback
        updateLocalCart(product, productId, quantity, size, color, addOnName, addOnPrice);
        return;
      }

      const payload = {
        productId,
        quantity,
        ...(size && { size }),
        ...(color && { color }),
        ...(addOnName && { addOnName }),
        ...(addOnPrice && { addOnPrice })
      };

      console.log('📡 Making API call to backend...');
      console.log('📦 Request payload:', payload);
      
      const response = await fetch(
        `${API_BASE_URL}/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();
      
      if (response.ok) {
        console.log('✅ API Success:', responseData);
        
        // Reload cart from backend to get updated state
        await loadCartFromBackend();
        
        showCart(`${product.name || product.title} added to cart!`);
      } else {
        console.error('❌ API Error:', {
          status: response.status,
          data: responseData
        });
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          setToken(null);
          showInfo('Session expired. Please login again.');
        } else {
          // Fallback to local update if API fails
          updateLocalCart(product, productId, quantity, size, color, addOnName, addOnPrice);
        }
      }
    } catch (error) {
      console.error('🚨 Network/API Error:', error.message);
      // Fallback to local update on network error
      updateLocalCart(product, productId, quantity, size, color, addOnName, addOnPrice);
    }
  };

  // Helper function for local cart updates
  const updateLocalCart = (product, productId, quantity, size, color, addOnName, addOnPrice) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === productId && item.size === size && item.color === color
      );

      let updatedItems;
      if (existingItem) {
        showCart("Item quantity updated in cart!");
        updatedItems = prevItems.map((item) =>
          item.id === productId && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        showCart(`${product.name || product.title} added to cart!`);
        updatedItems = [
          ...prevItems,
          { 
            ...product, 
            id: productId, 
            quantity,
            size,
            color,
            addOnName,
            addOnPrice
          },
        ];
      }
      
      // Save to localStorage for persistence
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  //  REMOVE FROM CART (LOCAL + API)
  const removeFromCart = async (productId) => {
    console.log('🗑️ Removing from cart:', { productId, token: token ? 'Present' : 'Missing' });
    
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== productId);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
    showInfo("Item removed from cart");

    // Backend sync
    try {
      if (!token) {
        console.warn('⚠️ No token found - skipping remove API call');
        return;
      }

      console.log('📡 Making remove API call...');
      const response = await fetch(
        `${API_BASE_URL}/cart/item/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();
      
      if (response.ok) {
        console.log('✅ Remove API Success:', responseData);
      } else {
        console.error('❌ Remove API Error:', {
          status: response.status,
          data: responseData
        });
      }
    } catch (error) {
      console.error('🚨 Remove API Error:', error.message);
    }
  };

  //  UPDATE QUANTITY (LOCAL + API)
  const updateQuantity = async (productId, quantity) => {
    console.log('🔄 Updating quantity:', { productId, quantity, token: token ? 'Present' : 'Missing' });
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });

    // Backend sync
    try {
      if (!token) {
        console.warn('⚠️ No token found - skipping update API call');
        return;
      }

      console.log('📡 Making update quantity API call...');
      const response = await fetch(
        `${API_BASE_URL}/cart/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            quantity,
          }),
        }
      );

      const responseData = await response.json();
      
      if (response.ok) {
        // console.log('✅ Update API Success:', responseData);
      } else {
        console.error('❌ Update API Error:', {
          status: response.status,
          data: responseData
        });
      }
    } catch (error) {
      console.error('🚨 Update API Error:', error.message);
    }
  };
  
  // 🗑️ CLEAR ALL CART ITEMS
  const clearCart = async () => {
    console.log('🗑️ Clearing entire cart:', { token: token ? 'Present' : 'Missing' });
    
    setCartItems([]);
    localStorage.removeItem('cartItems');
    showInfo("Cart cleared successfully");

    // Backend sync
    try {
      if (!token) {
        console.warn('⚠️ No token found - skipping clear cart API call');
        return;
      }

      console.log('📡 Making clear cart API call...');
      const response = await fetch(
        `${API_BASE_URL}/cart/clear`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();
      
      if (response.ok) {
        console.log('✅ Clear Cart API Success:', responseData);
      } else {
        console.error('❌ Clear Cart API Error:', {
          status: response.status,
          data: responseData
        });
      }
    } catch (error) {
      console.error('🚨 Clear Cart API Error:', error.message);
    }
  };

  //  TOTAL ITEMS
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  //  TOTAL PRICE
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      let price = 0;
      const priceStr = item.price || item.newPrice || "0";

      if (typeof priceStr === "string") {
        price = parseFloat(priceStr.replace(/[₹,]/g, "")) || 0;
      } else {
        price = priceStr;
      }

      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
