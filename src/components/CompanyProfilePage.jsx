import React from 'react';
import { useTheme } from '../context/ThemeContext';

const CompanyProfilePage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} py-12 px-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 pb-4 border-b-4" style={{color: '#862b2a', borderColor: '#862b2a'}}>Company Profile</h1>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Discover the story behind Espejo - Your trusted partner in premium mirror solutions
          </p>
        </div>
        
        <div className="space-y-12">
          {/* About Section */}
          <section className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-50 to-gray-100'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-2xl">🏢</span>
              </div>
              <h2 className="text-3xl font-bold" style={{color: '#862b2a'}}>About Espejo</h2>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-lg mb-4`}>
              Espejo is a leading manufacturer and supplier of premium quality mirrors and bathroom accessories. 
              We specialize in creating innovative mirror solutions that combine functionality with aesthetic appeal.
            </p>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              With years of expertise in the industry, we have established ourselves as a trusted name in delivering 
              exceptional quality products that transform spaces and enhance lifestyles.
            </p>
          </section>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <h2 className="text-2xl font-bold" style={{color: '#862b2a'}}>Our Mission</h2>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                To provide high-quality, innovative mirror solutions that enhance the beauty and functionality of every space, 
                while maintaining the highest standards of craftsmanship and customer satisfaction.
              </p>
            </section>
            
            <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                  <span className="text-white text-2xl">👁️</span>
                </div>
                <h2 className="text-2xl font-bold" style={{color: '#862b2a'}}>Our Vision</h2>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                To become the most trusted and preferred brand in the mirror industry, known for innovation, 
                quality, and exceptional customer service across India and beyond.
              </p>
            </section>
          </div>

          {/* Company Stats */}
          <section className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-50'} p-8 rounded-xl border-2`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-3xl font-bold text-center mb-8" style={{color: '#862b2a'}}>📊 Company at a Glance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg text-center shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                <div className="text-3xl font-bold mb-2" style={{color: '#862b2a'}}>2020</div>
                <h3 className="font-semibold mb-1">Founded</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Year of Establishment</p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg text-center shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                <div className="text-3xl font-bold mb-2" style={{color: '#862b2a'}}>500+</div>
                <h3 className="font-semibold mb-1">Happy Customers</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Satisfied Clients</p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg text-center shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                <div className="text-3xl font-bold mb-2" style={{color: '#862b2a'}}>50+</div>
                <h3 className="font-semibold mb-1">Product Range</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Mirror Varieties</p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg text-center shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                <div className="text-3xl font-bold mb-2" style={{color: '#862b2a'}}>24/7</div>
                <h3 className="font-semibold mb-1">Support</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Customer Service</p>
              </div>
            </div>
          </section>

          {/* Products Section */}
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-2xl">🪞</span>
              </div>
              <h2 className="text-3xl font-bold" style={{color: '#862b2a'}}>Our Product Range</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {name: 'Bathroom Mirrors', icon: '🚿', desc: 'Water-resistant & stylish'},
                {name: 'LED Mirrors', icon: '💡', desc: 'Smart lighting solutions'},
                {name: 'Metal Mirrors', icon: '⚡', desc: 'Durable & elegant frames'},
                {name: 'Vanity Mirrors', icon: '💄', desc: 'Perfect for grooming'},
                {name: 'Wall Mirrors', icon: '🖼️', desc: 'Decorative & functional'},
                {name: 'Standing Mirrors', icon: '🪞', desc: 'Full-length solutions'}
              ].map((product, index) => (
                <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition-shadow border-l-4`} style={{borderColor: '#862b2a'}}>
                  <div className="text-4xl mb-3">{product.icon}</div>
                  <h3 className="font-bold text-lg mb-2" style={{color: '#862b2a'}}>{product.name}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{product.desc}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Why Choose Us */}
          <section className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-50'} p-8 rounded-xl border-2`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-3xl font-bold text-center mb-8" style={{color: '#862b2a'}}>✨ Why Choose Espejo?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {title: 'Premium Quality', icon: '⭐', desc: 'High-grade materials'},
                {title: 'Expert Craftsmanship', icon: '🔨', desc: 'Skilled artisans'},
                {title: 'Innovative Designs', icon: '🎨', desc: 'Modern aesthetics'},
                {title: 'Customer First', icon: '❤️', desc: 'Your satisfaction matters'}
              ].map((feature, index) => (
                <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg text-center shadow-lg`}>
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold mb-2" style={{color: '#862b2a'}}>{feature.title}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Contact CTA */}
          <section className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-50'} p-8 rounded-xl border-2 text-center`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-3xl font-bold mb-4" style={{color: '#862b2a'}}>Ready to Transform Your Space?</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg mb-6`}>
              Get in touch with our experts for personalized mirror solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+919687444002" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                📱 Call Now: +91 96874 44002
              </a>
              <a href="mailto:info@espejo.in" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                📧 Email: info@espejo.in
              </a>
            </div>
          </section>
        </div>
        
        {/* Footer
        <div className={`mt-12 p-6 text-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg`}>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            © 2024 Espejo - Reflecting Excellence in Every Mirror
          </p>
        </div> */}
        
      </div>
    </div>
  );
};

export default CompanyProfilePage;