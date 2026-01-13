import React from 'react';
import { useTheme } from '../context/ThemeContext';

const WhyChooseEspejoPage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} py-12 px-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 pb-4 border-b-4" style={{color: '#862b2a', borderColor: '#862b2a'}}>Why Choose Espejo?</h1>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Discover what makes Espejo the preferred choice for premium mirror solutions across India
          </p>
        </div>
        
        <div className="space-y-12">
          {/* Key Differentiators */}
          <section className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-50 to-gray-100'} p-8 rounded-xl border-2`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-4xl font-bold text-center mb-12" style={{color: '#862b2a'}}>✨ What Sets Us Apart</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {title: 'Premium Quality', icon: '⭐', desc: 'High-grade materials & superior craftsmanship', color: '#862b2a'},
                {title: 'Innovation', icon: '💡', desc: 'Smart LED technology & modern features', color: '#28a745'},
                {title: 'Durability', icon: '🛡️', desc: 'Long-lasting & moisture-resistant designs', color: '#007bff'},
                {title: 'Customer First', icon: '❤️', desc: '24/7 support & satisfaction guarantee', color: '#dc3545'}
              ].map((feature, index) => (
                <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow border-l-4`} style={{borderColor: feature.color}}>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-bold text-lg mb-3" style={{color: feature.color}}>{feature.title}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Product Excellence */}
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-2xl">🏆</span>
              </div>
              <h2 className="text-3xl font-bold" style={{color: '#862b2a'}}>Product Excellence</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🎨</span>
                  <h3 className="text-xl font-bold" style={{color: '#862b2a'}}>Modern & Timeless Designs</h3>
                </div>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Minimal, elegant, and contemporary designs that suit both classic and modern interiors. Our aesthetic philosophy blends functionality with beauty.
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🔬</span>
                  <h3 className="text-xl font-bold" style={{color: '#862b2a'}}>Premium Materials</h3>
                </div>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  High-grade glass and durable frames ensure clarity, safety, and longevity. Every mirror undergoes rigorous quality testing.
                </p>
              </div>
            </div>
          </section>

          {/* Innovation & Technology */}
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h2 className="text-3xl font-bold" style={{color: '#862b2a'}}>Innovation & Technology</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {title: 'LED Integration', icon: '💡', desc: 'Smart LED illumination with energy-efficient technology'},
                {title: 'Moisture Resistance', icon: '💧', desc: 'Special coatings protect against humidity and water damage'},
                {title: 'Anti-Fog Technology', icon: '🌫️', desc: 'Advanced anti-fog features for clear visibility always'}
              ].map((tech, index) => (
                <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                  <div className="text-4xl mb-4">{tech.icon}</div>
                  <h3 className="font-bold text-lg mb-3" style={{color: '#862b2a'}}>{tech.title}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{tech.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Applications */}
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-2xl">🏢</span>
              </div>
              <h2 className="text-3xl font-bold" style={{color: '#862b2a'}}>Perfect for Every Space</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {category: 'Residential', icon: '🏠', spaces: ['Bathrooms', 'Bedrooms', 'Living Areas', 'Dressing Rooms']},
                {category: 'Commercial', icon: '🏢', spaces: ['Hotels', 'Restaurants', 'Offices', 'Retail Stores']},
                {category: 'Professional', icon: '💼', spaces: ['Salons', 'Spas', 'Gyms', 'Medical Centers']}
              ].map((app, index) => (
                <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{app.icon}</span>
                    <h3 className="font-bold text-lg" style={{color: '#862b2a'}}>{app.category}</h3>
                  </div>
                  <ul className={`${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-2`}>
                    {app.spaces.map((space, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {space}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          
          {/* Customer Benefits */}
          <section className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-50'} p-8 rounded-xl border-2`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-3xl font-bold text-center mb-12" style={{color: '#862b2a'}}>🎯 Customer Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
                <h3 className="text-xl font-bold mb-4" style={{color: '#862b2a'}}>🛡️ Quality Assurance</h3>
                <ul className={`${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-2`}>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Rigorous quality testing</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Industry-standard certifications</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Warranty protection</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Defect-free guarantee</li>
                </ul>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
                <h3 className="text-xl font-bold mb-4" style={{color: '#862b2a'}}>🚀 Service Excellence</h3>
                <ul className={`${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-2`}>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Fast delivery nationwide</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Professional installation</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>24/7 customer support</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Easy return policy</li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Testimonials */}
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-2xl">💬</span>
              </div>
              <h2 className="text-3xl font-bold" style={{color: '#862b2a'}}>What Our Customers Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {name: 'Rajesh Kumar', rating: 5, text: 'Excellent quality mirrors! The LED lighting is perfect for our bathroom.'},
                {name: 'Priya Sharma', rating: 5, text: 'Professional service and beautiful designs. Highly recommended!'},
                {name: 'Amit Patel', rating: 5, text: 'Great value for money. The mirrors transformed our hotel lobby.'}
              ].map((review, index) => (
                <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4 italic`}>"{review.text}"</p>
                  <p className="font-semibold" style={{color: '#862b2a'}}>- {review.name}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Call to Action */}
          <section className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-50'} p-8 rounded-xl border-2 text-center`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-3xl font-bold mb-4" style={{color: '#862b2a'}}>Ready to Experience the Espejo Difference?</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg mb-8`}>
              Join thousands of satisfied customers who chose Espejo for their mirror needs
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
        
        {/* Footer */}
        {/* <div className={`mt-12 p-6 text-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg`}>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            © 2024 Espejo - Your Trusted Partner in Premium Mirror Solutions
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default WhyChooseEspejoPage;