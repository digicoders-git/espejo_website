import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-black z-[9999] flex items-center justify-center">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #862b2a 2px, transparent 2px),
                              radial-gradient(circle at 75% 75%, #862b2a 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Loader */}
      <div className="relative flex flex-col items-center">
        
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/Logo/PNG/esj2.png"
            alt="ESPEJO"
            className="h-32 w-auto object-contain animate-pulse"
          />
        </div>

        {/* Spinning Mirror */}
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-700" />
          <div
            className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent animate-spin"
            style={{
              borderTopColor: '#862b2a',
              borderRightColor: '#862b2a'
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-300 to-gray-100 dark:from-gray-600 dark:to-gray-800 animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Loading ESPEJO
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
            Preparing your mirror experience...
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex space-x-2 mt-6">
          {[0, 150, 300].map((delay, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full animate-bounce"
              style={{
                backgroundColor: '#862b2a',
                animationDelay: `${delay}ms`
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-8 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              backgroundColor: '#862b2a',
              animation: 'loading 2s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      {/* ✅ FIXED STYLE (NO jsx) */}
      <style>{`
        @keyframes loading {
          0% {
            width: 0%;
            transform: translateX(-100%);
          }
          50% {
            width: 100%;
            transform: translateX(0%);
          }
          100% {
            width: 0%;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
