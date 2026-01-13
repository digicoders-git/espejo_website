import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaHandshake, FaChartLine, FaUsers, FaAward, FaShieldAlt, FaGlobe } from 'react-icons/fa';

const BecomeDealerPage = () => {
  const { isDark } = useTheme();

  const benefits = [
    {
      icon: <FaChartLine className="text-3xl" style={{color: '#862b2a'}} />,
      title: "Competitive Wholesale Pricing",
      description: "Get the best rates in the market with attractive profit margins"
    },
    {
      icon: <FaUsers className="text-3xl" style={{color: '#862b2a'}} />,
      title: "Marketing Support",
      description: "Complete marketing materials and promotional support"
    },
    {
      icon: <FaAward className="text-3xl" style={{color: '#862b2a'}} />,
      title: "Product Training",
      description: "Comprehensive training on all our premium mirror products"
    },
    {
      icon: <FaShieldAlt className="text-3xl" style={{color: '#862b2a'}} />,
      title: "Exclusive Territories",
      description: "Protected dealer territories for your business growth"
    },
    {
      icon: <FaGlobe className="text-3xl" style={{color: '#862b2a'}} />,
      title: "Regular Updates",
      description: "Stay updated with new product launches and innovations"
    },
    {
      icon: <FaHandshake className="text-3xl" style={{color: '#862b2a'}} />,
      title: "Dedicated Support",
      description: "24/7 customer service and technical support"
    }
  ];

  const requirements = [
    "Valid business license and registration",
    "Retail showroom or display space",
    "Minimum order commitments",
    "Customer service capabilities",
    "Financial stability and creditworthiness",
    "Commitment to brand standards"
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} transition-colors duration-200`}>
      {/* Hero Section */}
      <div className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-200'} py-20`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6" style={{color: '#862b2a'}}>Become a Dealer</h1>
          <div className="flex justify-center mb-6">
            <div className="w-24 h-1 rounded" style={{backgroundColor: '#862b2a'}}></div>
          </div>
          <p className={`text-xl leading-relaxed max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Join the Espejo family and become an authorized dealer. Partner with us to expand your business 
            with our premium mirror collection and grow your success in the home décor industry.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12" style={{color: '#862b2a'}}>Why Partner With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'} p-6 rounded-xl border hover:shadow-lg transition-all duration-300`}>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>{benefit.title}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Requirements Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{color: '#862b2a'}}>Dealer Requirements</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-6 leading-relaxed`}>
                To ensure the best partnership experience, we have established certain criteria for our dealer network.
              </p>
              <ul className="space-y-4">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{backgroundColor: '#862b2a'}}></div>
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} p-8 rounded-xl`}>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#862b2a'}}>Ready to Get Started?</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
                Contact our dealer relations team to learn more about partnership opportunities and start your journey with Espejo.
              </p>
              <div className="space-y-4">
                <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="font-semibold">Email:</span>
                  <span>info@espejo.in || support@espejo.in </span>
                </div>
                <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="font-semibold">Phone:</span>
                  <span>+91 9687444002</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BecomeDealerPage;