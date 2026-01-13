import React from 'react';
import { useTheme } from '../context/ThemeContext';

const TermsOfServicePage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} py-12 px-6`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 pb-4 border-b-4" style={{color: '#862b2a', borderColor: '#862b2a'}}>Terms of Service</h1>
        <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-12`}>Please read these terms carefully before using our services</p>
        
        <div className="space-y-8">
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg border-l-4`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-2xl font-semibold mb-4" style={{color: '#862b2a'}}>1. Acceptance of Terms</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              By accessing or using Espejo's website and services, you agree to comply with these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
            </p>
          </section>

          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg border-l-4`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-2xl font-semibold mb-4" style={{color: '#862b2a'}}>2. Products & Services</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              All product descriptions, images, pricing, and availability are subject to change without prior notice. Espejo reserves the right to discontinue or modify products at any time. We strive to provide accurate information but cannot guarantee complete accuracy.
            </p>
          </section>

          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg border-l-4`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-2xl font-semibold mb-4" style={{color: '#862b2a'}}>3. Pricing & Payment</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              We strive to ensure accurate pricing and product information. In case of errors, Espejo reserves the right to cancel or modify orders. All prices are in Indian Rupees (INR) and include applicable taxes unless otherwise stated.
            </p>
          </section>

          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg border-l-4`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-2xl font-semibold mb-4" style={{color: '#862b2a'}}>4. Intellectual Property</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              All content including logos, images, designs, text, and trademarks are the property of Espejo and may not be used without written permission. Unauthorized use of our intellectual property may result in legal action.
            </p>
          </section>

          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg border-l-4`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-2xl font-semibold mb-4" style={{color: '#862b2a'}}>5. Limitation of Liability</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              Espejo shall not be liable for indirect, incidental, or consequential damages arising from the use of our products or services. Our liability is limited to the maximum extent permitted by law.
            </p>
          </section>

          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg border-l-4`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-2xl font-semibold mb-4" style={{color: '#862b2a'}}>6. Governing Law</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              These terms shall be governed and interpreted in accordance with the laws of India. Any disputes will be subject to the jurisdiction of Indian courts.
            </p>
          </section>

          <section className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-50'} p-8 rounded-lg border-2`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-2xl font-semibold mb-4" style={{color: '#862b2a'}}>📞 Contact Information</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-6`}>
              For any questions regarding these terms of service, please contact:
            </p>
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 sm:p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
              <h3 className="text-lg sm:text-xl font-bold mb-4" style={{color: '#862b2a'}}>Espejo Customer Support</h3>
              <div className="space-y-3">
                <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p className="font-semibold mb-2 flex items-center">
                    <span className="mr-2">📧</span>
                    <span>Email:</span>
                  </p>
                  <div className="ml-6 space-y-1">
                    <p>
                      <a href="mailto:info@espejo.in" className="text-blue-600 hover:text-blue-800 underline cursor-pointer transition-colors break-all">info@espejo.in</a>
                    </p>
                    <p>
                      <a href="mailto:support@espejo.in" className="text-blue-600 hover:text-blue-800 underline cursor-pointer transition-colors break-all">support@espejo.in</a>
                    </p>
                  </div>
                </div>
                <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p className="font-semibold mb-2 flex items-center">
                    <span className="mr-2">📱</span>
                    <span>Phone:</span>
                  </p>
                  <div className="ml-6">
                    <a href="tel:+919687444002" className="text-green-600 hover:text-green-800 underline cursor-pointer transition-colors font-semibold">+91 96874 44002</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        {/* <div className={`mt-12 p-6 text-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg`}>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-2`}>
            © 2024 Espejo. All rights reserved.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default TermsOfServicePage;