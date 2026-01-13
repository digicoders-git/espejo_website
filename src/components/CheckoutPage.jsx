import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import { showError, showSuccess } from "../components/CustomLoader";
import { toast } from "react-toastify";
import PaymentService from "../services/PaymentService";

const ADDRESS_API = "https://glassadminpanelapi.onrender.com/api/users/addresses";
const ORDER_API = "https://glassadminpanelapi.onrender.com/api/user-orders/place";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrder();

  const token = localStorage.getItem("token");
  
  // Get buy now item from navigation state
  const buyNowItem = location.state?.buyNowItem;
  
  // Determine items to checkout (either cart items or single buy now item)
  const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;

  // Helper function to safely parse price
  const parsePrice = (priceValue) => {
    if (typeof priceValue === 'number') return priceValue;
    if (typeof priceValue === 'string') {
      return parseFloat(priceValue.replace(/[₹,]/g, '')) || 0;
    }
    return 0;
  };

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [offerCode, setOfferCode] = useState('');
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [offerLoading, setOfferLoading] = useState(false);
  const [notes, setNotes] = useState('');

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    addressType: "home",
    isDefault: false,
  });

  /* ================= APPLY OFFER CODE ================= */
  const applyOfferCode = async () => {
    if (!offerCode.trim()) {
      showError('Please enter an offer code');
      return;
    }

    setOfferLoading(true);
    try {
      const res = await fetch(`https://glassadminpanelapi-zvz4.onrender.com/api/offers/code/${offerCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (res.ok && data) {
        const subtotal = calculateTotal();
        // console.log('📊 Offer data:', data);
        // console.log('📊 Subtotal:', subtotal);
        
        // Check minimum order amount
        if (subtotal < Number(data.minOrderAmount)) {
          showError(`Minimum order amount of ₹${data.minOrderAmount} required for this offer`);
          setOfferLoading(false);
          return;
        }
        
        // Calculate discount
        let discountAmount = 0;
        if (data.discountType === 'percentage') {
          discountAmount = (subtotal * Number(data.discountValue)) / 100;
          if (data.maxDiscountAmount && discountAmount > Number(data.maxDiscountAmount)) {
            discountAmount = Number(data.maxDiscountAmount);
          }
        } else {
          discountAmount = Number(data.discountValue) || 0;
        }
        
        // Ensure discountAmount is a valid number
        discountAmount = isNaN(discountAmount) ? 0 : Math.round(discountAmount);
        
        // console.log('📊 Calculated discount:', discountAmount);
        
        setAppliedOffer({
          ...data,
          discountAmount: discountAmount
        });
        
        showSuccess(`Offer applied! You saved ₹${discountAmount}`);
      } else {
        showError(data?.message || 'Invalid offer code');
      }
    } catch (error) {
      // console.error('Offer validation error:', error);
      showError('Failed to validate offer code');
    } finally {
      setOfferLoading(false);
    }
  };

  /* ================= REMOVE OFFER ================= */
  const removeOffer = () => {
    setAppliedOffer(null);
    setOfferCode('');
    showSuccess('Offer removed');
  };

  /* ================= DELETE ADDRESS ================= */
  const deleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const res = await fetch(`${ADDRESS_API}/${addressId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        setAddresses(addresses.filter(addr => addr._id !== addressId));
        if (selectedAddressId === addressId) setSelectedAddressId(null);
        showSuccess('Address deleted successfully');
      } else {
        showError('Failed to delete address');
      }
    } catch {
      showError('Network error');
    }
  };

  /* ================= UPDATE ADDRESS ================= */
  const updateAddress = async (addressId, updatedData) => {
    try {
      const res = await fetch(`${ADDRESS_API}/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      
      if (res.ok) {
        setAddresses(addresses.map(addr => 
          addr._id === addressId ? { ...addr, ...updatedData } : addr
        ));
        setEditingAddress(null);
        showSuccess('Address updated successfully');
      } else {
        showError('Failed to update address');
      }
    } catch {
      showError('Network error');
    }
  };

  /* ================= FETCH ADDRESSES ================= */
  const fetchAddresses = async () => {
    try {
      const res = await fetch(ADDRESS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setAddresses(data.addresses || []);
        const def = data.addresses?.find((a) => a.isDefault);
        if (def) setSelectedAddressId(def._id);
      }
    } catch (err) {
      // console.error("Address fetch error", err);
    }
  };

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  /* ================= ADD ADDRESS ================= */
  const handleAddAddress = async () => {
    const requiredFields = [
      "name",
      "phone",
      "addressLine1",
      "city",
      "state",
      "pincode",
    ];

    for (let field of requiredFields) {
      if (!newAddress[field]) {
        showError("All address fields are required");
        return;
      }
    }

    try {
      const res = await fetch(ADDRESS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess("Address added successfully");
        setAddresses(data.addresses || []);
        setShowAddForm(false);
        setNewAddress({
          name: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
          addressType: "home",
          isDefault: false,
        });
      } else {
        showError(data.message || "Address add failed");
      }
    } catch {
      showError("Network error");
    }
  };

  /* ================= CALCULATE TOTAL ================= */
  const calculateTotal = () => {
    return checkoutItems.reduce((total, item) => {
      const price = parsePrice(item.price || item.newPrice || 0);
      return total + (price * item.quantity);
    }, 0);
  };

  /* ================= CALCULATE FINAL TOTAL WITH DISCOUNT ================= */
  const calculateFinalTotal = () => {
    const subtotal = calculateTotal();
    const discount = Number(appliedOffer?.discountAmount) || 0;
    const finalTotal = subtotal - discount;
    return Math.max(0, isNaN(finalTotal) ? subtotal : finalTotal);
  };

  /* ================= PLACE ORDER WITH PAYMENT ================= */
  const placeOrder = async () => {
    if (!token) {
      toast.error("Please login first to place an order!");
      return;
    }

    if (!selectedAddressId) {
      showError("Please select a shipping address");
      return;
    }

    if (checkoutItems.length === 0) {
      showError("No items to checkout. Please add items to cart first.");
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
    if (!selectedAddress) {
      showError("Selected address not found");
      return;
    }

    const totalAmount = calculateFinalTotal();
    
    if (paymentMethod === 'online') {
      setLoading(true);
      
      try {
        // IMPORTANT: Sync checkout items with backend cart before payment
        // console.log('🔄 Syncing items to backend cart before payment...');
        for (const item of checkoutItems) {
          try {
            await fetch('https://glassadminpanelapi.onrender.com/api/cart/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                productId: item.id,
                quantity: item.quantity
              })
            });
            // console.log(`✅ Synced item to cart: ${item.title || item.name}`);
          } catch (syncError) {
            // console.warn('⚠️ Failed to sync item:', item.title || item.name, syncError);
          }
        }
        
        // Process online payment with Razorpay
        const orderData = {
          amount: totalAmount,
          notes: notes,
          offerCode: appliedOffer?.code || ''
        };

        const shippingAddress = {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          email: selectedAddress.email || 'customer@espejo.in',
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2 || '',
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode
        };
        
        await PaymentService.processPayment(
          orderData,
          shippingAddress,
          (result) => {
            // Payment success
            showSuccess("🎉 Payment successful! Order placed.");
            if (result?.order) addOrder(result.order);
            
            // Clear cart only if we're checking out cart items (not buy now)
            if (!buyNowItem) {
              clearCart();
            }
            
            navigate("/profile");
            setLoading(false);
          },
          (error) => {
            // Payment failure
            // console.error('Payment failed:', error);
            setLoading(false);
          }
        );
        
      } catch (error) {
        // console.error('🚨 Error syncing items to cart:', error);
        showError('Failed to prepare order. Please try again.');
        setLoading(false);
      }
    } else {
      // Process COD order
      await processCODOrder();
    }
  };

  /* ================= PROCESS COD ORDER ================= */
  const processCODOrder = async () => {
    setLoading(true);

    try {
      // Sync checkout items with backend before placing order
      for (const item of checkoutItems) {
        try {
          await fetch('https://glassadminpanelapi.onrender.com/api/cart/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              productId: item.id,
              quantity: item.quantity
            })
          });
        } catch (syncError) {
          // console.warn('⚠️ Failed to sync item:', item.title);
        }
      }
      
      // Place COD order
      const orderPayload = {
        addressId: selectedAddressId,
        paymentMethod: "COD",
        offerCode: appliedOffer?.code || '',
        notes: notes
      };

      const response = await fetch(ORDER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess("🎉 Order placed successfully");
        if (data?.order) addOrder(data.order);
        
        // Clear cart only if we're checking out cart items (not buy now)
        if (!buyNowItem) {
          clearCart();
        }
        
        navigate("/profile");
      } else {
        showError(data.message || `Order failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      // console.error('🚨 Order API error:', error);
      showError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className={`${isDark ? "bg-black text-white" : "bg-gray-100 text-black"} min-h-screen`}>
      <div className="max-w-5xl mx-auto p-3 sm:p-6">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <button onClick={() => navigate(-1)} className="text-lg sm:text-xl">
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold">Checkout</h1>
        </div>

        {/* CART SUMMARY */}
        <div className={`${isDark ? "bg-gray-900" : "bg-white"} rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow mb-4 sm:mb-6`}>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Order Summary</h2>
          
          {checkoutItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">{buyNowItem ? 'Item not found' : 'Your cart is empty'}</p>
              <button
                onClick={() => navigate('/')}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {buyNowItem && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-blue-800 text-sm font-medium">🛒 Buy Now Checkout</p>
                </div>
              )}
              {checkoutItems.map((item) => {
                const numericPrice = parsePrice(item.price || item.newPrice || 0);
                return (
                  <div key={item.id} className={`p-3 sm:p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex gap-3 sm:gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                        <img
                          src={item.img || item.image || 'https://via.placeholder.com/80x80'}
                          alt={item.title || item.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/80x80'}
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs sm:text-sm mb-1 line-clamp-2">{item.title || item.name}</h4>
                        <p className="text-xs text-[#862b2a] font-medium mb-2">ESPEJO</p>
                        
                        {/* Product Features */}
                        <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3">
                          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span className="font-medium">Warranty:</span> 5 Years
                          </div>
                          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span className="font-medium">Material:</span> Premium Glass
                          </div>
                          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span className="font-medium">Installation:</span> Free
                          </div>
                          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span className="font-medium">Delivery:</span> 7-10 Days
                          </div>
                        </div>
                        
                        {/* Quantity and Price */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Qty:</span>
                            <span className="text-xs sm:text-sm font-semibold bg-[#862b2a] text-white px-2 py-1 rounded">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm sm:text-lg font-bold text-[#862b2a]">
                              ₹{(numericPrice * item.quantity).toLocaleString()}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              ₹{numericPrice.toLocaleString()} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Benefits */}
                    <div className={`mt-2 sm:mt-3 pt-2 sm:pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex flex-wrap gap-1 sm:gap-2 text-xs">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          ✓ Free Shipping
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          ✓ Professional Installation
                        </span>
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          ✓ 30-Day Returns
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="border-t pt-3 sm:pt-4 space-y-2">
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span>Subtotal ({checkoutItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
                
                {appliedOffer && (
                  <div className="flex justify-between items-center text-green-600 text-sm sm:text-base">
                    <span>Discount ({appliedOffer.title}):</span>
                    <span>-₹{(Number(appliedOffer.discountAmount) || 0).toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-base sm:text-lg font-bold border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="text-orange-600">₹{calculateFinalTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PAYMENT METHOD */}
        <div className={`${isDark ? "bg-gray-900" : "bg-white"} rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow mb-4 sm:mb-6`}>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Payment Method</h2>
          <div className="space-y-2 sm:space-y-3">
            <label className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer transition ${
              paymentMethod === 'online' 
                ? 'border-orange-500 bg-orange-50 text-black' 
                : isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="accent-orange-500"
              />
              <FaCreditCard className="text-orange-500 text-lg sm:text-xl" />
              <div>
                <p className="font-semibold text-sm sm:text-base">Online Payment</p>
                <p className="text-xs sm:text-sm opacity-70">Pay securely with Razorpay (Cards, UPI, Wallets)</p>
              </div>
            </label>
            
            <label className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer transition ${
              paymentMethod === 'cod' 
                ? 'border-orange-500 bg-orange-50 text-black' 
                : isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="accent-orange-500"
              />
              <FaMoneyBillWave className="text-green-500 text-lg sm:text-xl" />
              <div>
                <p className="font-semibold text-sm sm:text-base">Cash on Delivery</p>
                <p className="text-xs sm:text-sm opacity-70">Pay when your order is delivered</p>
              </div>
            </label>
          </div>
        </div>

        {/* ORDER DETAILS */}
        <div className={`${isDark ? "bg-gray-900" : "bg-white"} rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow mb-4 sm:mb-6`}>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Order Details</h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Offer Code (Optional)</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={offerCode}
                  onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                  placeholder="Enter offer code (e.g., WELCOME10)"
                  disabled={appliedOffer}
                  className={`flex-1 p-3 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} ${appliedOffer ? 'opacity-50' : ''}`}
                />
                {appliedOffer ? (
                  <button
                    onClick={removeOffer}
                    className="w-full sm:w-auto px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
                  >
                    Remove Offer
                  </button>
                ) : (
                  <button
                    onClick={applyOfferCode}
                    disabled={offerLoading || !offerCode.trim()}
                    className={`w-full sm:w-auto px-4 py-3 rounded-lg font-semibold ${
                      offerLoading || !offerCode.trim()
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {offerLoading ? 'Applying...' : 'Apply Code'}
                  </button>
                )}
              </div>
              
              {appliedOffer && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-green-800 font-semibold">{appliedOffer.title}</p>
                      <p className="text-green-600 text-sm">Code: {appliedOffer.code}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-green-800 font-bold text-lg">-₹{(Number(appliedOffer.discountAmount) || 0).toLocaleString()}</p>
                      <p className="text-green-600 text-xs">You saved!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Special Instructions (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for delivery..."
                rows={3}
                className={`w-full p-3 border rounded-lg text-sm ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
              />
            </div>
          </div>
        </div>
        <div className={`${isDark ? "bg-gray-900" : "bg-white"} rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow mb-4 sm:mb-6`}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Shipping Address</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center justify-center sm:justify-start gap-2 text-orange-500 font-medium text-sm sm:text-base"
            >
              <FaPlus /> Add Address
            </button>
          </div>

          {/* ADDRESS LIST */}
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No shipping addresses found. Please add an address to continue.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              addresses.map((addr) => (
                <div key={addr._id}>
                  {editingAddress === addr._id ? (
                    <EditAddressForm 
                      address={addr}
                      onSave={(data) => updateAddress(addr._id, data)}
                      onCancel={() => setEditingAddress(null)}
                      isDark={isDark}
                    />
                  ) : (
                    <label
                      className={`block border rounded-xl p-3 sm:p-4 cursor-pointer transition ${
                        selectedAddressId === addr._id
                          ? "border-orange-500 bg-orange-50 text-black"
                          : isDark
                          ? "border-gray-700 hover:border-gray-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="flex gap-2 sm:gap-3 flex-1">
                          <input
                            type="radio"
                            checked={selectedAddressId === addr._id}
                            onChange={() => {
                              setSelectedAddressId(addr._id);
                            }}
                            className="mt-1 accent-orange-500 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm sm:text-base">
                              {addr.name} ({addr.phone})
                            </p>
                            <p className="text-xs sm:text-sm opacity-80 break-words">
                              {addr.addressLine1}
                              {addr.addressLine2 && `, ${addr.addressLine2}`}
                              <br />
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setEditingAddress(addr._id);
                            }}
                            className="p-1.5 sm:p-2 text-orange-500 hover:bg-orange-100 rounded-lg"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              deleteAddress(addr._id);
                            }}
                            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-100 rounded-lg"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </label>
                  )}
                </div>
              ))
            )}
          </div>

          {/* ADD ADDRESS FORM */}
          {showAddForm && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "name",
                "phone",
                "addressLine1",
                "addressLine2",
                "city",
                "state",
                "pincode",
              ].map((field) => (
                <input
                  key={field}
                  placeholder={field}
                  value={newAddress[field]}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, [field]: e.target.value })
                  }
                  className="border rounded-lg p-3 text-black"
                />
              ))}

              <button
                onClick={handleAddAddress}
                className="md:col-span-2 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold"
              >
                Save Address
              </button>
            </div>
          )}
        </div>

        {/* PLACE ORDER */}
        <button
          onClick={placeOrder}
          disabled={loading || checkoutItems.length === 0 || !selectedAddressId}
          className={`w-full py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold shadow transition-colors ${
            loading || checkoutItems.length === 0 || !selectedAddressId
              ? 'bg-gray-400 cursor-not-allowed text-gray-600'
              : 'bg-orange-600 hover:bg-orange-700 text-white'
          }`}
        >
          {loading ? "Processing..." : 
           checkoutItems.length === 0 ? "No Items" :
           !selectedAddressId ? "Select Address" :
           paymentMethod === 'online' ? `Pay ₹${calculateFinalTotal().toLocaleString()}` :
           `Place Order (₹${calculateFinalTotal().toLocaleString()})`}
        </button>
      </div>
    </div>
  );
};

const EditAddressForm = ({ address, onSave, onCancel, isDark }) => {
  const [formData, setFormData] = useState({
    name: address.name || "",
    phone: address.phone || "",
    addressLine1: address.addressLine1 || "",
    addressLine2: address.addressLine2 || "",
    city: address.city || "",
    state: address.state || "",
    pincode: address.pincode || "",
    country: address.country || "India",
    addressType: address.addressType || "home",
    isDefault: address.isDefault || false
  });

  const handleSave = () => {
    const requiredFields = ["name", "phone", "addressLine1", "city", "state", "pincode"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        showError("All address fields are required");
        return;
      }
    }
    onSave(formData);
  };

  return (
    <div className={`border rounded-xl p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[
          "name",
          "phone",
          "addressLine1",
          "addressLine2",
          "city",
          "state",
          "pincode",
        ].map((field) => (
          <input
            key={field}
            placeholder={field}
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            className={`border rounded-lg p-3 ${isDark ? "bg-gray-900 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
