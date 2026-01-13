import React from 'react';
import { useTheme } from '../context/ThemeContext';

const RefundPolicyPage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} py-12 px-6`}>
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 pb-4 border-b-4" style={{color: '#862b2a', borderColor: '#862b2a'}}>Refund Policy</h1>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Your satisfaction is our priority. Learn about our transparent refund and return policies.
          </p>
        </div>
        
        <div className="space-y-10">


          {/* Payment Methods */}
          <section className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-50 to-gray-100'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-2xl">💳</span>
              </div>
              <h2 className="text-3xl font-bold" style={{color: '#862b2a'}}>Payment Methods</h2>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-6 text-lg`}>
              ESPEJO accepts payments through secure and trusted payment gateways:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {name: 'Credit/Debit Cards', icon: '💳'},
                {name: 'Net Banking', icon: '🏦'},
                {name: 'UPI Payments', icon: '📱'},
                {name: 'Digital Wallets', icon: '💰'}
              ].map((method, index) => (
                <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg text-center shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                  <div className="text-3xl mb-2">{method.icon}</div>
                  <p className="font-semibold" style={{color: '#862b2a'}}>{method.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Refund Policy */}
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-2xl">💰</span>
              </div>
              <h2 className="text-3xl font-bold" style={{color: '#862b2a'}}>Refund Process</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center`}>
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-bold mb-2" style={{color: '#862b2a'}}>Quality Inspection</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Approved refunds processed after quality inspection
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center`}>
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="font-bold mb-2" style={{color: '#862b2a'}}>Original Method</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Refunds issued to original payment method
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center`}>
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="font-bold mb-2" style={{color: '#862b2a'}}>Processing Time</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  7-10 business days processing time
                </p>
              </div>
            </div>
          </section>

          {/* Cancellation Policy */}
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-2xl">❌</span>
              </div>
              <h2 className="text-3xl font-bold" style={{color: '#862b2a'}}>Cancellation Policy</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#28a745'}}>
                <div className="text-4xl mb-4">✅</div>
                <h3 className="font-bold mb-2 text-green-600">Before Dispatch</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Orders can be canceled within 2-3 days of placing order
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#dc3545'}}>
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="font-bold mb-2 text-red-600">After Dispatch</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Once dispatched, cancellations are not permitted
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#ffc107'}}>
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="font-bold mb-2 text-yellow-600">Custom Orders</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Cannot be canceled once production begins
                </p>
              </div>
            </div>
          </section>

          {/* Return Policy Overview */}
          <section className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-50'} p-8 rounded-xl border-2 text-center`} style={{borderColor: '#862b2a'}}>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-3xl">🔄</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{color: '#862b2a'}}>Product Return Policy</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg max-w-2xl mx-auto`}>
              At ESPEJO, customer satisfaction is our priority. We accept returns under specific conditions to ensure quality and fairness.
            </p>
          </section>

          {/* Return Eligibility */}
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-2xl">✅</span>
              </div>
              <h2 className="text-3xl font-bold" style={{color: '#862b2a'}}>Return Eligibility</h2>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-6 text-lg`}>
              Returns are accepted under the following conditions:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                <div className="text-4xl mb-4">📦</div>
                <h3 className="font-bold mb-2" style={{color: '#862b2a'}}>Damaged/Defective</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Product damaged, defective, or incorrect at delivery
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="font-bold mb-2" style={{color: '#862b2a'}}>48 Hours</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Return request within 48 hours of receiving
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                <div className="text-4xl mb-4">📋</div>
                <h3 className="font-bold mb-2" style={{color: '#862b2a'}}>Original Condition</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Unused, uninstalled, original packaging
                </p>
              </div>
            </div>
          </section>

          {/* Non-Returnable Items */}
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#dc3545'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#dc3545'}}>
                <span className="text-white text-2xl">🚫</span>
              </div>
              <h2 className="text-3xl font-bold text-red-600">Non-Returnable Items</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4 border-red-500`}>
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="font-bold mb-2 text-red-600">Custom Orders</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Customized or made-to-order mirrors and cabinets
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4 border-red-500`}>
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="font-bold mb-2 text-red-600">Misuse Damage</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Products damaged due to improper handling or installation
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4 border-red-500`}>
                <div className="text-4xl mb-4">🏷️</div>
                <h3 className="font-bold mb-2 text-red-600">Sale Items</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Clearance or discounted items (unless damaged on delivery)
                </p>
              </div>
            </div>
          </section>

          {/* Return Process */}
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-2xl">📋</span>
              </div>
              <h2 className="text-3xl font-bold" style={{color: '#862b2a'}}>Return Process</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#862b2a'}}>
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-bold mb-2" style={{color: '#862b2a'}}>Contact Support</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Reach out with order details
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#862b2a'}}>
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-bold mb-2" style={{color: '#862b2a'}}>Provide Images</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Submit supporting photos
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#862b2a'}}>
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-bold mb-2" style={{color: '#862b2a'}}>Get Approval</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Wait for return approval
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#862b2a'}}>
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-bold mb-2" style={{color: '#862b2a'}}>Follow Instructions</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Receive return guidelines
                </p>
              </div>
            </div>
          </section>



          {/* Contact Support */}
          <section className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-50'} p-8 rounded-xl border-2`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-3xl font-bold text-center mb-6" style={{color: '#862b2a'}}>📞 Need Help with Returns?</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-center text-lg mb-8`}>
              Our customer support team is here to assist you with any return or refund queries.
            </p>
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
              <h3 className="text-xl font-bold mb-6 text-center" style={{color: '#862b2a'}}>Espejo Customer Support</h3>
              
              {/* Email Section */}
              <div className="mb-6">
                <div className="flex items-center justify-center mb-3">
                  <span className="font-semibold text-lg">📧 Email Support</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center">
                  <a href="mailto:info@espejo.in" className="text-blue-600 hover:text-blue-800 underline cursor-pointer transition-colors text-sm sm:text-base break-all">info@espejo.in</a>
                  <span className="hidden sm:inline mx-2">|</span>
                  <a href="mailto:support@espejo.in" className="text-blue-600 hover:text-blue-800 underline cursor-pointer transition-colors text-sm sm:text-base break-all">support@espejo.in</a>
                </div>
              </div>
              
              {/* Phone Section */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <span className="font-semibold text-lg">📱 Phone Support</span>
                </div>
                <a href="tel:+919687444002" className="text-green-600 hover:text-green-800 underline cursor-pointer transition-colors font-semibold text-lg">+91 96874 44002</a>
              </div>
            </div>
          </section>
        </div>
        
        {/* Footer */}
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

export default RefundPolicyPage;