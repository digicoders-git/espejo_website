import React from 'react';
import { FaAward, FaShieldAlt, FaUsers, FaStar, FaTools, FaLeaf } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import BestSeller from './BestSeller';


const AboutUsPage = ({ onBuyNow }) => {
  const { isDark } = useTheme();
  
  const features = [
    {
      icon: <FaAward className="text-4xl" style={{color: '#862b2a'}} />,
      title: "Premium Quality",
      description: "Crafted with the finest materials and cutting-edge technology for lasting beauty."
    },
    {
      icon: <FaShieldAlt className="text-4xl" style={{color: '#862b2a'}} />,
      title: "5 Year Warranty",
      description: "Comprehensive warranty coverage on all products for complete peace of mind."
    },
    {
      icon: <FaUsers className="text-4xl" style={{color: '#862b2a'}} />,
      title: "Expert Craftsmanship",
      description: "Designed by skilled artisans with years of experience in mirror manufacturing."
    },
    {
      icon: <FaStar className="text-4xl" style={{color: '#862b2a'}} />,
      title: "Customer Satisfaction",
      description: "Over 10,000+ happy customers trust Espejo for their mirror needs."
    },
    {
      icon: <FaTools className="text-4xl" style={{color: '#862b2a'}} />,
      title: "Easy Installation",
      description: "Professional installation support and detailed guides for hassle-free setup."
    },
    {
      icon: <FaLeaf className="text-4xl" style={{color: '#862b2a'}} />,
      title: "Eco-Friendly",
      description: "Sustainable manufacturing processes and environmentally conscious materials."
    }
  ];

  return (
    <div className={`${isDark ? 'bg-black' : 'bg-white'} min-h-screen transition-colors duration-200`}>
      {/* Page Title */}
      <div className="pt-8 pb-4">
        <h1 className={`text-4xl md:text-5xl font-bold text-center ${isDark ? 'text-white' : 'text-black'}`} style={{color: '#862b2a'}}>About Us</h1>
        <div className="flex justify-center mt-4">
          <div className="w-24 h-1 rounded" style={{backgroundColor: '#862b2a'}}></div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="pt-4 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop" 
                alt="Modern bathroom with premium mirrors" 
                className="rounded-lg shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h1 className={`text-3xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-4`}>Premium Mirrors & Bathroom Solutions for Modern Interiors</h1>
              <p className={`text-xl md:text-2xl mb-8 font-semibold`} style={{color: '#862b2a'}}>
                Redefining Spaces with Style, Clarity & Craftsmanship
              </p>
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-4`}>
                <p className="text-lg leading-relaxed">
                  At ESPEJO, we create premium mirrors and bathroom solutions that blend modern design, superior quality, and everyday functionality. Our thoughtfully crafted collection enhances residential and commercial interiors with elegant reflections, durable materials, and timeless aesthetics.
                </p>
                <p className="text-lg leading-relaxed">
                  From sophisticated bathroom mirrors and LED mirrors to stylish vanity, wall, and standing mirrors, ESPEJO offers solutions designed to elevate your space and your lifestyle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

     

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <h2 className={`text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-black'} mb-12`}>Why Choose Espejo?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`${isDark ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'} p-6 rounded-lg text-center transition-colors`}>
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-black'} mb-3`}>{feature.title}</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} py-16`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`${isDark ? 'text-white' : 'text-black'}`}>
                  <h2 className="text-3xl font-bold mb-6" style={{color: '#862b2a'}}>Our Mission</h2>
                  <p className="text-lg leading-relaxed mb-6">
                    To revolutionize the mirror industry by delivering innovative, high-quality products that enhance the beauty and functionality of every space. We are committed to excellence in design, manufacturing, and customer service.
                  </p>
                  <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#862b2a'}}></span>
                      Premium quality materials and craftsmanship
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#862b2a'}}></span>
                      Innovative LED technology integration
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#862b2a'}}></span>
                      Exceptional customer service and support
                    </li>
                  </ul>
                </div>
                <div className={`${isDark ? 'text-white' : 'text-black'}`}>
                  <h2 className="text-3xl font-bold mb-6" style={{color: '#862b2a'}}>Our Vision</h2>
                  <p className="text-lg leading-relaxed mb-6">
                    To become the most trusted and preferred mirror brand globally, known for our commitment to quality, innovation, and customer satisfaction. We envision a world where every space reflects beauty and functionality.
                  </p>
                  <div className={`${isDark ? 'bg-black' : 'bg-white'} p-6 rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                    <h3 className="text-xl font-semibold mb-4" style={{color: '#862b2a'}}>Our Values</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>✨ Innovation</div>
                      <div>🎯 Quality</div>
                      <div>🤝 Integrity</div>
                      <div>💚 Sustainability</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <img 
                src="https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=500&fit=crop" 
                alt="Elegant mirror collection" 
                className="rounded-lg shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={`text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-black'} mb-12`}>Our Achievements</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className={`${isDark ? 'text-white' : 'text-black'}`}>
              <div className="text-4xl font-bold mb-2" style={{color: '#862b2a'}}>10,000+</div>
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Happy Customers</div>
            </div>
            <div className={`${isDark ? 'text-white' : 'text-black'}`}>
              <div className="text-4xl font-bold mb-2" style={{color: '#862b2a'}}>50+</div>
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Product Variants</div>
            </div>
            <div className={`${isDark ? 'text-white' : 'text-black'}`}>
              <div className="text-4xl font-bold mb-2" style={{color: '#862b2a'}}>5</div>
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Years Experience</div>
            </div>
            <div className={`${isDark ? 'text-white' : 'text-black'}`}>
              <div className="text-4xl font-bold mb-2" style={{color: '#862b2a'}}>99%</div>
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Showcase */}
      <div className="pb-16">
        <h2 className={`text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-black'} mb-12`}>Our Featured Products</h2>
        <BestSeller onBuyNow={onBuyNow} />
      </div>
    </div>
  );
};

export default AboutUsPage;