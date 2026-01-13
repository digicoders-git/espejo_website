import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaHeadset, FaQuestionCircle, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const ContactUsPage = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://glassadminpanelapi.onrender.com/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending enquiry:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-white text-black'} min-h-screen transition-colors duration-200`}>
      {/* Hero Section */}
      <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} py-16`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className={`text-5xl font-bold mb-4`} style={{ color: '#862b2a' }}>Contact Us</h1>
          <div className="flex justify-center mb-6">
            <div className="w-24 h-1 rounded" style={{ backgroundColor: '#862b2a' }}></div>
          </div>
          <p className={`text-xl opacity-90 max-w-2xl mx-auto ${isDark ? 'text-white' : 'text-black'}`}>
            Have questions about our mirrors? Need support? We're here to help you find the perfect mirror for your space.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700' : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'} rounded-xl p-6 border text-center hover:border-orange-500/50 transition-all duration-200 cursor-pointer`} onClick={() => window.open('tel:+919687444002')}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#862b2a20' }}>
              <FaPhone className="text-2xl" style={{ color: '#862b2a' }} />
            </div>
            <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Call Us</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>Mon-Sat 9AM-7PM</p>
            <p className="font-semibold" style={{ color: '#862b2a' }}>+91 9687444002</p>
          </div>

          <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700' : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'} rounded-xl p-6 border text-center hover:border-orange-500/50 transition-all duration-200 cursor-pointer`} onClick={() => window.open('https://wa.me/919687444002')}>
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaWhatsapp className="text-green-500 text-2xl" />
            </div>
            <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-black'}`}>WhatsApp</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>Quick Support</p>
            <p className="text-green-400 font-semibold">+91 9687444002</p>
          </div>

          <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700' : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'} rounded-xl p-6 border text-center hover:border-orange-500/50 transition-all duration-200 cursor-pointer`} onClick={() => window.open('mailto:info@espejo.in')}>
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-blue-500 text-2xl" />
            </div>
            <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Email Us</h3>
            {/* <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>24/7 Support</p> */}
            <p className="text-blue-400 font-semibold">info@espejo.in</p>
            <p className="text-blue-400 font-semibold">support@espejo.in</p>
          </div>

          <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700' : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'} rounded-xl p-6 border text-center hover:border-orange-500/50 transition-all duration-200 cursor-pointer`} onClick={() => window.open('https://maps.app.goo.gl/xd4eqT1yE4UuVCoh8?g_st=aw', '_blank')}>
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-purple-500 text-2xl" />
            </div>
            <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Visit Us</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>Showroom</p>
            <p className="text-purple-400 font-semibold text-sm">Block No 267, Prop. No 392R, vill. Vanessa, Bardoli, Gujarat 394350</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700' : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'} rounded-xl p-8 border`}>
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#862b2a' }}>Contact Information</h2>

              <div className="space-y-6">
                <div className={`flex items-start gap-4 p-4 ${isDark ? 'bg-gray-800/50' : 'bg-gray-200/50'} rounded-lg`}>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#862b2a20' }}>
                    <FaMapMarkerAlt style={{ color: '#862b2a' }} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Our Address</h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Block No 267, Prop. No 392R, vill. Vanessa, Bardoli

                    </p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Gujarat India 394350</p>
                    <button
                      onClick={() => window.open('https://maps.app.goo.gl/xd4eqT1yE4UuVCoh8?g_st=aw', '_blank')}
                      className="mt-3 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                      style={{ backgroundColor: '#862b2a' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#6b1f1e'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#862b2a'}
                    >
                      <FaMapMarkerAlt /> View on Google Maps
                    </button>
                  </div>
                </div>

                <div className={`flex items-start gap-4 p-4 ${isDark ? 'bg-gray-800/50' : 'bg-gray-200/50'} rounded-lg`}>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#862b2a20' }}>
                    <FaClock style={{ color: '#862b2a' }} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Business Hours</h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Monday - Saturday: 9:00 AM - 7:00 PM</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Sunday: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className={`flex items-start gap-4 p-4 ${isDark ? 'bg-gray-800/50' : 'bg-gray-200/50'} rounded-lg`}>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#862b2a20' }}>
                    <FaHeadset style={{ color: '#862b2a' }} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Customer Support</h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>24/7 Online Support Available</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Average Response Time: 2 hours</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Follow Us</h3>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                    <FaFacebookF className="text-white" />
                  </div>
                  <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
                    <FaTwitter className="text-white" />
                  </div>
                  <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-pink-700 transition-colors">
                    <FaInstagram className="text-white" />
                  </div>
                  <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors">
                    <FaLinkedinIn className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* enquari form */}

          <div>
            <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700' : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'} rounded-xl p-8 border`}>
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#862b2a' }}>Send Us a Message</h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>Have a question or need assistance? Fill out the form below and we'll get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 ${isDark ? 'bg-gray-800/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} border rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 ${isDark ? 'bg-gray-800/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} border rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-gray-800/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} border rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Message *</label>
                  <textarea
                    name="message"
                    placeholder="Tell us about your requirements..."
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-3 ${isDark ? 'bg-gray-800/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} border rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none transition-all duration-200`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: '#862b2a' }}
                  onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#6b1f1e')}
                  onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#862b2a')}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;