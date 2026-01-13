import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useOrder } from '../context/OrderContext';
import { FaArrowLeft, FaBoxOpen, FaCalendarAlt, FaCreditCard, FaMapMarkerAlt, FaPhone, FaUser, FaShoppingCart } from 'react-icons/fa';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { orders } = useOrder();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundOrder = orders.find(o => o._id === orderId);
    console.log('🔍 Looking for order:', orderId);
    console.log('📦 Available orders:', orders);
    console.log('✅ Found order:', foundOrder);
    
    if (foundOrder) {
      setOrder(foundOrder);
      setLoading(false);
    } else if (orders.length === 0) {
      // If no orders loaded yet, try to fetch individual order
      fetchSingleOrder();
    } else {
      setLoading(false);
    }
  }, [orderId, orders]);

  const fetchSingleOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`https://glassadminpanelapi.onrender.com/api/user-orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('📊 Single order response:', data);
      
      if (response.ok && data) {
        setOrder(data.order || data);
      }
    } catch (error) {
      console.error('Error fetching single order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-100 text-black'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a76665]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-100 text-black'} flex items-center justify-center`}>
        <div className="text-center">
          <FaBoxOpen className="mx-auto text-6xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-400 mb-4">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-[#a76665] hover:bg-[#8f5654] text-white px-6 py-3 rounded-lg"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-100 text-black'} py-8 px-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/profile')}
            className={`p-3 rounded-full ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow-lg transition-all`}
          >
            <FaArrowLeft className="text-[#a76665]" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-gray-400">Order #{order._id.slice(-8)}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaBoxOpen className="text-[#a76665]" />
                Order Status
              </h2>
              <div className="flex items-center justify-between">
                <span className={`px-6 py-3 rounded-full text-lg font-medium ${
                  order.status === 'Delivered' ? 
                  (isDark ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700') :
                  order.status === 'Cancelled' ? 
                  (isDark ? 'bg-red-800 text-red-300' : 'bg-red-100 text-red-700') :
                  order.status === 'Processing' ? 
                  (isDark ? 'bg-blue-800 text-blue-300' : 'bg-blue-100 text-blue-700') :
                  (isDark ? 'bg-[#a76665]/30 text-[#a76665]' : 'bg-[#a76665]/20 text-[#a76665]')
                }`}>
                  {order.status}
                </span>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaShoppingCart className="text-[#a76665]" />
                Order Items
              </h2>
              <div className="space-y-4">
                {(order.items || order.products || order.orderItems)?.map((item, index) => {
                  const itemData = {
                    name: item.name || item.productName || item.title || 'Product',
                    image: item.image || item.productImage || item.img || '/placeholder-product.jpg',
                    price: item.price || item.productPrice || item.amount || 0,
                    quantity: item.quantity || item.qty || 1
                  };
                  
                  return (
                    <div key={index} className={`flex items-center gap-4 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <img
                        src={itemData.image}
                        alt={itemData.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.svg';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{itemData.name}</h3>
                        <p className="text-sm text-gray-400">Quantity: {itemData.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#a76665]">₹{itemData.price}</p>
                        <p className="text-sm text-gray-400">₹{itemData.price * itemData.quantity} total</p>
                      </div>
                    </div>
                  );
                }) || (
                  <div className="text-center py-8 text-gray-400">
                    <p>No items details available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#a76665]" />
                  Shipping Address
                </h2>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="text-gray-400">{order.shippingAddress.street}</p>
                  <p className="text-gray-400">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p className="text-gray-400">{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="text-gray-400 flex items-center gap-2 mt-2">
                      <FaPhone className="text-sm" />
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Payment Info */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaCreditCard className="text-[#a76665]" />
                Payment Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod || 'Online'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Status</span>
                  <span className={`font-medium ${
                    order.paymentStatus === 'Paid' ? 'text-green-500' : 
                    order.paymentStatus === 'Failed' ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {order.paymentStatus || 'Pending'}
                  </span>
                </div>
                {order.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transaction ID</span>
                    <span className="font-medium text-sm">{order.transactionId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{order.subtotal || order.totalAmount || order.total || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span>₹{order.shippingCost || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span>₹{order.tax || '0'}</span>
                </div>
                {order.discount && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <hr className={`${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
                <div className="flex justify-between text-xl font-bold text-[#a76665]">
                  <span>Total</span>
                  <span>₹{order.totalAmount || order.total || '0'}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            {order.customerInfo && (
              <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaUser className="text-[#a76665]" />
                  Customer Info
                </h2>
                <div className="space-y-2">
                  <p><span className="text-gray-400">Name:</span> {order.customerInfo.name}</p>
                  <p><span className="text-gray-400">Email:</span> {order.customerInfo.email}</p>
                  {order.customerInfo.phone && (
                    <p><span className="text-gray-400">Phone:</span> {order.customerInfo.phone}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;