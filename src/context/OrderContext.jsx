import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within OrderProvider");
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  
  // Initialize isCleared from localStorage
  const [isCleared, setIsCleared] = useState(() => {
    return localStorage.getItem('ordersCleared') === 'true';
  });

  // FETCH ORDERS with caching
  const fetchOrders = async (force = false) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // If orders were manually cleared, don't fetch unless forced
    if (isCleared && !force) {
      return;
    }

    // Prevent repeated calls within 30 seconds
    const now = Date.now();
    if (!force && lastFetch && (now - lastFetch) < 30000) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "https://glassadminpanelapi.onrender.com/api/user-orders?page=1&limit=10",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log('📊 Orders API Response:', data);
      if (res.ok) {
        setOrders(data.orders || data.data || data || []);
        setLastFetch(now);
        setIsCleared(false); // Reset cleared flag when new data is fetched
        localStorage.removeItem('ordersCleared'); // Remove from localStorage
      } else {
        console.error("Order fetch error:", data);
      }
    } catch (err) {
      console.error("Order API error:", err);
    } finally {
      setLoading(false);
    }
  };

  // CANCEL ORDER
  const cancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      console.log('🚫 Cancelling order:', orderId);
      const res = await fetch(
        `https://glassadminpanelapi.onrender.com/api/user-orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log('📊 Cancel response:', { status: res.status, data });

      if (res.ok) {
        // Update order status immediately in UI
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "Cancelled" } : o
          )
        );
        console.log('✅ Order cancelled successfully');
        return true;
      } else {
        console.error('❌ Cancel failed:', data);
        return false;
      }
    } catch (err) {
      console.error("🚨 Cancel order error:", err);
      return false;
    }
  };

  // TRACK ORDER
  const trackOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      console.log('📍 Tracking order:', orderId);
      const res = await fetch(
        `https://glassadminpanelapi.onrender.com/api/user-orders/${orderId}/track`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log('📊 Track response:', { status: res.status, data });

      if (res.ok) {
        return data;
      } else {
        console.error('❌ Track failed:', data);
        return null;
      }
    } catch (err) {
      console.error("🚨 Track order error:", err);
      return null;
    }
  };

  // CLEAR ALL ORDERS
  const clearOrders = async () => {
    try {
      setOrders([]);
      setIsCleared(true); // Mark as manually cleared
      localStorage.setItem('ordersCleared', 'true'); // Persist in localStorage
      setLastFetch(null); // Reset fetch timestamp
      console.log('✅ Order history cleared');
      return true;
    } catch (err) {
      console.error("🚨 Clear orders error:", err);
      return false;
    }
  };

  // ADD ORDER (after successful placement)
  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        fetchOrders,
        cancelOrder,
        trackOrder,
        addOrder,
        clearOrders,
        isCleared, // Expose cleared state
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
