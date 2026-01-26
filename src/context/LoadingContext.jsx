import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

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
}