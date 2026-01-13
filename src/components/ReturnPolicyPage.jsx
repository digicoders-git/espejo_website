import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ReturnPolicyPage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} py-12 px-6`}>
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 pb-4 border-b-4" style={{color: '#862b2a', borderColor: '#862b2a'}}>Return Policy</h1>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Your satisfaction is our commitment. Learn about our hassle-free return process and policies.
          </p>
        </div>
        
        <div className="space-y-12">
          {/* Return Policy Overview */}
          <section className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-50'} p-8 rounded-xl border-2 text-center`} style={{borderColor: '#862b2a'}}>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-3xl">🔄</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{color: '#862b2a'}}>Easy Returns, Happy Customers</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg max-w-2xl mx-auto mb-8`}>
              At Espejo, we believe in making returns as simple as possible. Our customer-friendly return policy ensures your complete satisfaction.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
                <div className="text-3xl mb-3">⏰</div>
                <h3 className="font-bold mb-2" style={{color: '#862b2a'}}>48 Hours</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Quick return window</p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
                <div className="text-3xl mb-3">📱</div>
                <h3 className="font-bold mb-2" style={{color: '#862b2a'}}>Easy Process</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Simple contact & return</p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="font-bold mb-2" style={{color: '#862b2a'}}>Full Protection</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Damage & defect coverage</p>
              </div>
            </div>
          </section>

          {/* Return Eligibility */}
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-2xl">✅</span>
              </div>
              <h2 className="text-3xl font-bold" style={{color: '#862b2a'}}>When Can You Return?</h2>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg mb-8`}>
              We accept returns under specific conditions to ensure fairness for all customers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#28a745'}}>
                <div className="text-4xl mb-4">📦</div>
                <h3 className="font-bold text-lg mb-3 text-green-600">Damaged/Defective Products</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Products that arrive damaged, defective, or incorrect at the time of delivery are eligible for immediate return.
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#007bff'}}>
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="font-bold text-lg mb-3 text-blue-600">48-Hour Window</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Return requests must be raised within 48 hours of receiving the product to qualify for return.
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                <div className="text-4xl mb-4">📋</div>
                <h3 className="font-bold text-lg mb-3" style={{color: '#862b2a'}}>Original Condition</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Products must be unused, uninstalled, and returned in original packaging with all accessories.
                </p>
              </div>
            </div>
          </section>

          {/* Non-Returnable Items */}
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#dc3545'}}>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#dc3545'}}>
                <span className="text-white text-2xl">🚫</span>
              </div>
              <h2 className="text-3xl font-bold text-red-600">Items We Cannot Accept for Return</h2>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg mb-8`}>
              For quality and hygiene reasons, certain items cannot be returned:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-red-500`}>
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="font-bold text-lg mb-3 text-red-600">Custom Orders</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Customized or made-to-order mirrors and cabinets designed specifically for your requirements.
                </p>
                <div className={`mt-4 p-3 rounded ${isDark ? 'bg-red-900' : 'bg-red-50'}`}>
                  <p className="text-red-600 text-xs font-semibold">Exception: Manufacturing defects covered</p>
                </div>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-red-500`}>
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="font-bold text-lg mb-3 text-red-600">Misuse Damage</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Products damaged due to improper handling, incorrect installation, or customer misuse.
                </p>
                <div className={`mt-4 p-3 rounded ${isDark ? 'bg-yellow-900' : 'bg-yellow-50'}`}>
                  <p className="text-yellow-600 text-xs font-semibold">Tip: Follow installation guidelines</p>
                </div>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-red-500`}>
                <div className="text-4xl mb-4">🏷️</div>
                <h3 className="font-bold text-lg mb-3 text-red-600">Sale Items</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Clearance, discounted, or promotional items (unless damaged upon delivery).
                </p>
                <div className={`mt-4 p-3 rounded ${isDark ? 'bg-green-900' : 'bg-green-50'}`}>
                  <p className="text-green-600 text-xs font-semibold">Exception: Delivery damage covered</p>
                </div>
              </div>
            </div>
          </section>

          {/* Return Process */}
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#862b2a'}}>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
                <span className="text-white text-2xl">📋</span>
              </div>
              <h2 className="text-3xl font-bold" style={{color: '#862b2a'}}>Simple Return Process</h2>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg mb-8`}>
              Follow these easy steps to initiate your return:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {step: '1', title: 'Contact Us', icon: '📱', desc: 'Call or email our support team'},
                {step: '2', title: 'Provide Details', icon: '📝', desc: 'Share order number and issue details'},
                {step: '3', title: 'Send Photos', icon: '📷', desc: 'Submit clear images of the product'},
                {step: '4', title: 'Get Approval', icon: '✅', desc: 'Receive return authorization'},
                {step: '5', title: 'Ship Back', icon: '📦', desc: 'Follow provided return instructions'}
              ].map((process, index) => (
                <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center relative`}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#862b2a'}}>
                    <span className="text-white font-bold">{process.step}</span>
                  </div>
                  <div className="text-3xl mb-3">{process.icon}</div>
                  <h3 className="font-bold text-lg mb-2" style={{color: '#862b2a'}}>{process.title}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{process.desc}</p>
                  {index < 4 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <div className="w-6 h-0.5" style={{backgroundColor: '#862b2a'}}></div>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent absolute -right-1 -top-1" style={{borderTopColor: '#862b2a'}}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
          
          {/* Return Timeline */}
          <section className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-50'} p-8 rounded-xl border-2`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-3xl font-bold text-center mb-8" style={{color: '#862b2a'}}>⏱️ Return Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {time: '48 Hours', desc: 'Report issues after delivery', color: '#dc3545'},
                {time: '24 Hours', desc: 'Response from our team', color: '#ffc107'},
                {time: '3-5 Days', desc: 'Product pickup arranged', color: '#007bff'},
                {time: '7-10 Days', desc: 'Refund processed', color: '#28a745'}
              ].map((timeline, index) => (
                <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: timeline.color}}>
                  <div className="text-2xl font-bold mb-2" style={{color: timeline.color}}>{timeline.time}</div>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{timeline.desc}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Important Notes */}
          <section className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8 rounded-xl border-l-4`} style={{borderColor: '#ffc107'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#ffc107'}}>
                <span className="text-black text-2xl">⚠️</span>
              </div>
              <h2 className="text-3xl font-bold text-yellow-600">Important Notes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
                <h3 className="font-bold text-lg mb-3" style={{color: '#862b2a'}}>📦 Packaging Requirements</h3>
                <ul className={`${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-2 text-sm`}>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Original packaging and boxes</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>All accessories and manuals</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Protective wrapping intact</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Invoice and warranty card</li>
                </ul>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
                <h3 className="font-bold text-lg mb-3" style={{color: '#862b2a'}}>📷 Photo Requirements</h3>
                <ul className={`${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-2 text-sm`}>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Clear, well-lit images</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Multiple angles of damage</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Packaging condition</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Serial number visible</li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Contact Support */}
          <section className={`${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-50'} p-8 rounded-xl border-2`} style={{borderColor: '#862b2a'}}>
            <h2 className="text-3xl font-bold text-center mb-6" style={{color: '#862b2a'}}>📞 Need to Return Something?</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-center text-lg mb-8`}>
              Our customer support team is ready to help you with your return request.
            </p>
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 sm:p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-center" style={{color: '#862b2a'}}>Espejo Customer Support</h3>
              <div className="space-y-4">
                <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p className="font-semibold mb-2 flex items-center justify-center sm:justify-start">
                    <span className="mr-2">📧</span>
                    <span>Email:</span>
                  </p>
                  <div className="text-center sm:text-left space-y-1">
                    <p>
                      <a href="mailto:returns@espejo.in" className="text-blue-600 hover:text-blue-800 underline cursor-pointer transition-colors break-all">returns@espejo.in</a>
                    </p>
                    <p>
                      <a href="mailto:support@espejo.in" className="text-blue-600 hover:text-blue-800 underline cursor-pointer transition-colors break-all">support@espejo.in</a>
                    </p>
                  </div>
                </div>
                <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p className="font-semibold mb-2 flex items-center justify-center sm:justify-start">
                    <span className="mr-2">📱</span>
                    <span>Phone:</span>
                  </p>
                  <div className="text-center sm:text-left">
                    <a href="tel:+919687444002" className="text-green-600 hover:text-green-800 underline cursor-pointer transition-colors font-semibold">+91 96874 44002</a>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  🕰️ Support Hours: Monday to Saturday, 9:00 AM - 7:00 PM
                </p>
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

export default ReturnPolicyPage;