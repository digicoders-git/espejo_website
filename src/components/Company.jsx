import React from "react";
import './Company.css';

const Company = () => {
  const logos = [
    "https://www.glazonoid.com/cdn/shop/files/emporio_icon_3668d83f-b189-417c-930c-433db18747e7.png?v=1674318466&width=400",
    "https://www.glazonoid.com/cdn/shop/files/Oyo.001.webp?v=1712307762&width=400",
    "https://www.glazonoid.com/cdn/shop/files/park_in_icon_92f0cebe-2398-4dd8-9ad4-fc39607a251d.png?v=1674318933&width=400",
    "https://www.glazonoid.com/cdn/shop/files/asian_icon_1910cf03-8184-4977-87cc-2ba1cddaa651.png?v=1674319725&width=400",
    "https://www.glazonoid.com/cdn/shop/files/wave_Icon_new.001-1.webp?v=1711089515&width=400",
    "https://www.glazonoid.com/cdn/shop/files/SBI_new.002-1.webp?v=1711089682&width=400",
  ];

  // Duplicate for infinite scrolling
  const allLogos = [...logos, ...logos];

  return (
    <div className="bg-black py-6 md:py-10 overflow-hidden -mt-1">
      <div className="whitespace-nowrap flex animate-slide">
        {allLogos.map((src, index) => (
          <img
            key={index}
            src={src}
            className="w-[120px] md:w-[160px] lg:w-[200px] mx-6 md:mx-10 object-contain"
            alt="company-logo"
          />
        ))}
      </div>
    </div>
  );
};

export default Company;
