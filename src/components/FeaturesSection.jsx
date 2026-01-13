import React from "react";
import { FaCarAlt } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { SiAdguard } from "react-icons/si";
import { useTheme } from '../context/ThemeContext';

const features = [
  {
    icon: <FaCarAlt className="w-12 h-12" style={{color: '#862b2a'}} />,
    title: "100% CUSTOMIZATION",
    desc: "All products we offer are tailored made for you",
  },
  {
    icon: <MdSupportAgent className="w-12 h-12" style={{color: '#862b2a'}} />,
    title: "SUPPORT 24/7",
    desc: "Contact us 24 hours a day, 7 days a week",
  },
  {
    icon: <TbTruckDelivery className="w-12 h-12" style={{color: '#862b2a'}} />,
    title: "100% SAFE DELIVERY",
    desc: "All products comes with free transportation insurance",
  },
  {
    icon: <SiAdguard className="w-12 h-12" style={{color: '#862b2a'}} />,
    title: "5 YEAR WARRANTY",
    desc: "We are the only brand to provide 5 years of warranty",
  },
];

const FeaturesSection = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`w-full ${isDark ? 'bg-black border-[#2a2a2a]' : 'bg-white border-gray-300'} py-16 border-y transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
        {features.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-4">
            {item.icon}
            <h3 className={`${isDark ? 'text-white' : 'text-black'} font-semibold text-[18px] tracking-wide`}>
              {item.title}
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[16px] leading-relaxed`}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
