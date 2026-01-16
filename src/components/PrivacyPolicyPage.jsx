import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const PrivacyPolicyPage = () => {
  const { isDark } = useTheme();
  const [active, setActive] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: '🛡️' },
    { id: 'collect', title: 'Information We Collect', icon: '📊' },
    { id: 'usage', title: 'How We Use Your Information', icon: '🔧' },
    { id: 'security', title: 'Data Protection & Security', icon: '🔒' },
    { id: 'sharing', title: 'Third-Party Sharing', icon: '🤝' },
    { id: 'rights', title: 'Your Rights', icon: '⚖️' },
    { id: 'cookies', title: 'Cookies', icon: '🍪' },
    { id: 'updates', title: 'Updates to This Policy', icon: '🔄' },
    { id: 'contact', title: 'Contact Us', icon: '📞' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} py-12 px-6`}>
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 pb-4 border-b-4" style={{color: '#862b2a', borderColor: '#862b2a'}}>Privacy Policy</h1>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Your privacy matters to us. Learn how we protect and handle your personal information.
          </p>
          <div className={`mt-6 inline-flex items-center px-4 py-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <span className="text-sm font-medium">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* SIDEBAR */}
          <aside className="lg:col-span-1">
            <div className={`sticky top-24 p-6 rounded-xl border-l-4 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`} style={{borderLeftColor: '#862b2a'}}>
              <h3 className="font-semibold mb-6 text-lg" style={{color: '#862b2a'}}>Table of Contents</h3>
              <ul className="space-y-3">
                {sections.map((sec, index) => (
                  <li
                    key={sec.id}
                    onClick={() => setActive(sec.id)}
                    className={`cursor-pointer px-4 py-3 rounded-lg text-sm transition-all duration-200 flex items-center space-x-3 ${
                        active === sec.id
                          ? 'text-white font-semibold shadow-lg transform scale-105'
                          : isDark
                          ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-700 hover:bg-white hover:shadow-md'
                      }`}
                    style={active === sec.id ? {backgroundColor: '#862b2a'} : {}}
                  >
                    <span className="text-lg">{sec.icon}</span>
                    <span>{index + 1}. {sec.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* CONTENT */}
          <main className="lg:col-span-3">

            {active === 'introduction' && (
              <Section isDark={isDark} title="1. Introduction" icon="🛡️">
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg mb-6`}>
                  Welcome to <span className="font-semibold" style={{color: '#862b2a'}}>ESPEJO</span>. We respect your privacy and are committed to protecting the personal information you share with us through our website, communication channels, and services.
                </p>
                <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} p-6 rounded-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                  <h4 className="font-semibold mb-3" style={{color: '#862b2a'}}>Our Commitment</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    This Privacy Policy explains how ESPEJO collects, uses, discloses, and safeguards your information when you interact with us. We are committed to transparency and giving you control over your personal data.
                  </p>
                </div>
              </Section>
            )}

            {active === 'collect' && (
              <Section isDark={isDark} title="2. Information We Collect" icon="📊">
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg mb-6`}>
                  We collect information to provide you with the best possible service and shopping experience.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">👤</span>
                      <h4 className="font-semibold" style={{color: '#862b2a'}}>Personal Information</h4>
                    </div>
                    <ul className={`${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-2 text-sm`}>
                      <li>• Name and contact details</li>
                      <li>• Email address and phone number</li>
                      <li>• Billing and shipping addresses</li>
                      <li>• Account preferences</li>
                    </ul>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">💳</span>
                      <h4 className="font-semibold" style={{color: '#862b2a'}}>Transaction Data</h4>
                    </div>
                    <ul className={`${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-2 text-sm`}>
                      <li>• Order and payment information</li>
                      <li>• Purchase history</li>
                      <li>• Shipping preferences</li>
                      <li>• Customer support interactions</li>
                    </ul>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">🖥️</span>
                      <h4 className="font-semibold" style={{color: '#862b2a'}}>Technical Information</h4>
                    </div>
                    <ul className={`${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-2 text-sm`}>
                      <li>• IP address and browser type</li>
                      <li>• Device information</li>
                      <li>• Website usage patterns</li>
                      <li>• Cookies and tracking data</li>
                    </ul>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">📝</span>
                      <h4 className="font-semibold" style={{color: '#862b2a'}}>Communication Data</h4>
                    </div>
                    <ul className={`${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-2 text-sm`}>
                      <li>• Contact form submissions</li>
                      <li>• Customer service inquiries</li>
                      <li>• Feedback and reviews</li>
                      <li>• Newsletter subscriptions</li>
                    </ul>
                  </div>
                </div>
              </Section>
            )}

            {active === 'usage' && (
              <Section isDark={isDark} title="3. How We Use Your Information" icon="🔧">
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg mb-6`}>
                  We use your information to provide excellent service and continuously improve your experience.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-4xl mb-4">🛒</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Order Processing</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Process and fulfill your orders efficiently
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-4xl mb-4">🎧</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Customer Support</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Respond to inquiries and provide assistance
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-4xl mb-4">📈</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Service Improvement</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Enhance products and website experience
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-4xl mb-4">📧</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Communication</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Send order updates and service notifications
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-4xl mb-4">🎯</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Personalization</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Customize your shopping experience
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-4xl mb-4">⚖️</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Legal Compliance</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Meet legal and regulatory requirements
                    </p>
                  </div>
                </div>
              </Section>
            )}

            {active === 'security' && (
              <Section isDark={isDark} title="4. Data Protection & Security" icon="🔒">
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg mb-6`}>
                  Your data security is our top priority. We implement multiple layers of protection to keep your information safe.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#28a745'}}>
                    <div className="text-4xl mb-4">🛡️</div>
                    <h4 className="font-semibold mb-2 text-green-600">Encryption</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      SSL encryption for all data transmission
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#007bff'}}>
                    <div className="text-4xl mb-4">🔐</div>
                    <h4 className="font-semibold mb-2 text-blue-600">Access Control</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Restricted access to authorized personnel only
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#ffc107'}}>
                    <div className="text-4xl mb-4">📊</div>
                    <h4 className="font-semibold mb-2 text-yellow-600">Monitoring</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Continuous security monitoring and updates
                    </p>
                  </div>
                </div>
                <div className={`mt-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} p-6 rounded-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                  <h4 className="font-semibold mb-3" style={{color: '#862b2a'}}>Security Measures</h4>
                  <ul className={`${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
                    <li>• Industry-standard encryption protocols</li>
                    <li>• Regular security audits and assessments</li>
                    <li>• Secure payment processing through trusted gateways</li>
                    <li>• Employee training on data protection practices</li>
                  </ul>
                </div>
              </Section>
            )}

            {active === 'sharing' && (
              <Section isDark={isDark} title="5. Third-Party Sharing" icon="🤝">
                <div className={`${isDark ? 'bg-red-900/20' : 'bg-red-50'} p-6 rounded-lg border-l-4 border-red-500 mb-6`}>
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🚫</span>
                    <h4 className="font-semibold text-red-600">We Never Sell Your Data</h4>
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    ESPEJO does not sell, rent, or trade your personal information to third parties for marketing purposes.
                  </p>
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg mb-6`}>
                  We only share information with trusted partners when necessary to provide our services:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">🚚</span>
                      <h4 className="font-semibold" style={{color: '#862b2a'}}>Logistics Partners</h4>
                    </div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Shipping and delivery information shared with courier services for order fulfillment
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">💳</span>
                      <h4 className="font-semibold" style={{color: '#862b2a'}}>Payment Processors</h4>
                    </div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Payment information processed through secure, PCI-compliant payment gateways
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">⚖️</span>
                      <h4 className="font-semibold" style={{color: '#862b2a'}}>Legal Requirements</h4>
                    </div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Information disclosed when required by law or to protect our rights and safety
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">🔧</span>
                      <h4 className="font-semibold" style={{color: '#862b2a'}}>Service Providers</h4>
                    </div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Technical service providers who help us operate and improve our website
                    </p>
                  </div>
                </div>
              </Section>
            )}

            {active === 'rights' && (
              <Section isDark={isDark} title="6. Your Rights" icon="⚖️">
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg mb-6`}>
                  You have full control over your personal information. Here are your rights:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-4xl mb-4">👁️</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Access</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Request a copy of your personal data
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-4xl mb-4">✏️</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Correction</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Update or correct inaccurate information
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-4xl mb-4">🗑️</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Deletion</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Request deletion of your personal data
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-4xl mb-4">📤</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Portability</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Export your data in a portable format
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-4xl mb-4">⛔</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Restriction</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Limit how we process your data
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-4xl mb-4">🚫</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Objection</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Object to certain data processing
                    </p>
                  </div>
                </div>
                <div className={`mt-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} p-6 rounded-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                  <h4 className="font-semibold mb-3" style={{color: '#862b2a'}}>How to Exercise Your Rights</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                    To exercise any of these rights, please contact us through our Contact Us page or email us directly. We will respond to your request within 30 days.
                  </p>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                    Note: Some requests may require identity verification for security purposes.
                  </p>
                </div>
              </Section>
            )}

            {active === 'cookies' && (
              <Section isDark={isDark} title="7. Cookies" icon="🍪">
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg mb-6`}>
                  We use cookies to enhance your browsing experience and provide personalized services.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#28a745'}}>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">⚡</span>
                      <h4 className="font-semibold text-green-600">Essential Cookies</h4>
                    </div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>
                      Required for basic website functionality
                    </p>
                    <ul className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs space-y-1`}>
                      <li>• Shopping cart functionality</li>
                      <li>• User authentication</li>
                      <li>• Security features</li>
                    </ul>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#007bff'}}>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">📊</span>
                      <h4 className="font-semibold text-blue-600">Analytics Cookies</h4>
                    </div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>
                      Help us understand website usage
                    </p>
                    <ul className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs space-y-1`}>
                      <li>• Page views and traffic</li>
                      <li>• User behavior patterns</li>
                      <li>• Performance optimization</li>
                    </ul>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#ffc107'}}>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">🎯</span>
                      <h4 className="font-semibold text-yellow-600">Preference Cookies</h4>
                    </div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>
                      Remember your preferences
                    </p>
                    <ul className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs space-y-1`}>
                      <li>• Language settings</li>
                      <li>• Theme preferences</li>
                      <li>• Display options</li>
                    </ul>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#dc3545'}}>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">📢</span>
                      <h4 className="font-semibold text-red-600">Marketing Cookies</h4>
                    </div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>
                      Personalize advertising content
                    </p>
                    <ul className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs space-y-1`}>
                      <li>• Targeted advertisements</li>
                      <li>• Social media integration</li>
                      <li>• Campaign effectiveness</li>
                    </ul>
                  </div>
                </div>
                <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} p-6 rounded-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                  <h4 className="font-semibold mb-3" style={{color: '#862b2a'}}>Cookie Control</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                    You can control cookie settings through your browser preferences. Note that disabling certain cookies may affect website functionality.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>Chrome Settings</span>
                    <span className={`px-3 py-1 rounded-full text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>Firefox Preferences</span>
                    <span className={`px-3 py-1 rounded-full text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>Safari Settings</span>
                  </div>
                </div>
              </Section>
            )}

            {active === 'updates' && (
              <Section isDark={isDark} title="8. Updates to This Policy" icon="🔄">
                <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 text-center`} style={{borderColor: '#862b2a'}}>
                  <div className="text-4xl mb-4">📋</div>
                  <h4 className="font-semibold mb-4" style={{color: '#862b2a'}}>Policy Updates</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-3xl mb-3">📢</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Notification</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      We'll notify you of significant changes via email or website notice
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-3xl mb-3">📅</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Effective Date</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Changes become effective on the date posted on this page
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg text-center border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-3xl mb-3">👀</div>
                    <h4 className="font-semibold mb-2" style={{color: '#862b2a'}}>Review</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Please review this policy periodically for updates
                    </p>
                  </div>
                </div>
              </Section>
            )}

            {active === 'contact' && (
              <Section isDark={isDark} title="9. Contact Us" icon="📞">
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg mb-6 text-center`}>
                  Have questions about our Privacy Policy? We're here to help!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Email Support */}
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#862b2a'}}>
                        <span className="text-white text-2xl">📧</span>
                      </div>
                      <h4 className="text-xl font-semibold" style={{color: '#862b2a'}}>Email Support</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Privacy Inquiries:</span>
                        <a href="mailto:privacy@espejo.com" className="text-sm break-all" style={{color: '#862b2a'}}>privacy@espejo.com</a>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>General Support:</span>
                        <a href="mailto:support@espejo.com" className="text-sm break-all" style={{color: '#862b2a'}}>support@espejo.com</a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Phone Support */}
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-lg border-l-4`} style={{borderColor: '#862b2a'}}>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#862b2a'}}>
                        <span className="text-white text-2xl">📞</span>
                      </div>
                      <h4 className="text-xl font-semibold" style={{color: '#862b2a'}}>Phone Support</h4>
                    </div>
                    <div className="space-y-4 text-center">
                      <div>
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm block mb-2`}>Customer Service:</span>
                        <a href="tel:+919876543210" className="text-lg font-semibold" style={{color: '#862b2a'}}>+91 98765 43210</a>
                      </div>
                      <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                        <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
                        <p>Sunday: 10:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`mt-8 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} p-6 rounded-lg border-l-4 text-center`} style={{borderColor: '#862b2a'}}>
                  <h4 className="font-semibold mb-3" style={{color: '#862b2a'}}>Response Time</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    We aim to respond to all privacy-related inquiries within <span className="font-semibold" style={{color: '#862b2a'}}>48 hours</span>. 
                    For urgent matters, please call our customer service line.
                  </p>
                </div>
              </Section>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

/* SECTION CARD */
const Section = ({ title, children, isDark, icon }) => (
  <section className={`rounded-xl border-l-4 p-8 mb-8 shadow-lg ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`} style={{borderLeftColor: '#862b2a'}}>
    <div className="flex items-center mb-6">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#862b2a'}}>
        <span className="text-white text-2xl">{icon}</span>
      </div>
      <h2 className="text-3xl font-bold" style={{color: '#862b2a'}}>{title}</h2>
    </div>
    <div className="leading-relaxed">{children}</div>
  </section>
);

export default PrivacyPolicyPage;
