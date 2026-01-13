import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Show loader on route change
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading time (minimum 800ms for smooth UX)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Manual loading control
  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  const value = {
    isLoading,
    showLoader,
    hideLoader
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};