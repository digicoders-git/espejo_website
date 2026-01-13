import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaHeart, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';

const CustomLoader = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (type, message, icon = null) => {
    const id = Date.now();
    const notification = {
      id,
      type,
      message,
      icon,
      isVisible: false
    };

    setNotifications(prev => [...prev, notification]);

    setTimeout(() => {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isVisible: true } : n)
      );
    }, 100);

    setTimeout(() => {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isVisible: false } : n)
      );
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 300);
    }, 3000);
  };

  useEffect(() => {
    window.showCustomNotification = showNotification;
    return () => {
      delete window.showCustomNotification;
    };
  }, []);

  const getIcon = (type, customIcon) => {
    if (customIcon) return customIcon;

    switch (type) {
      case 'success':
        return <FaCheck className="text-white" size={20} />;
      case 'error':
        return <FaTimes className="text-white" size={20} />;
      case 'info':
        return <FaUser className="text-white" size={20} />;
      default:
        return <FaCheck className="text-white" size={20} />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return 'from-green-500 to-green-600';
      case 'error':
        return 'from-red-500 to-red-600';
      case 'info':
        return 'from-blue-500 to-blue-600';
      case 'wishlist':
        return 'from-pink-500 to-red-500';
      case 'cart':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-green-500 to-green-600';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border border-white/20 backdrop-blur-sm transform transition-all duration-300 ${
            notification.isVisible
              ? 'translate-x-0 opacity-100 scale-100'
              : 'translate-x-full opacity-0 scale-95'
          } bg-gradient-to-r ${getColors(notification.type)}`}
          style={{ minWidth: '300px' }}
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              {getIcon(notification.type, notification.icon)}
            </div>
          </div>

          <div className="flex-1">
            <p className="text-white font-medium text-sm leading-relaxed">
              {notification.message}
            </p>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-white/30 rounded-b-xl overflow-hidden">
            <div
              className="h-full bg-white/60"
              style={{ animation: 'shrink 3s linear forwards' }}
            />
          </div>
        </div>
      ))}

      {/* ✅ FIXED: no jsx */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

/* helper functions */

export const showSuccess = (message, icon = null) => {
  window.showCustomNotification?.('success', message, icon);
};

export const showError = (message, icon = null) => {
  window.showCustomNotification?.('error', message, icon);
};

export const showInfo = (message, icon = null) => {
  window.showCustomNotification?.('info', message, icon);
};

export const showWishlist = (message) => {
  window.showCustomNotification?.(
    'wishlist',
    message,
    <FaHeart className="text-white" size={20} />
  );
};

export const showCart = (message) => {
  window.showCustomNotification?.(
    'cart',
    message,
    <FaShoppingCart className="text-white" size={20} />
  );
};

export const showLogout = (message) => {
  window.showCustomNotification?.(
    'info',
    message,
    <FaSignOutAlt className="text-white" size={20} />
  );
};

export default CustomLoader;
