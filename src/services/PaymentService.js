import { showSuccess, showError, showInfo } from '../components/CustomLoader';

const PAYMENT_API_BASE = 'https://glassadminpanelapi-zvz4.onrender.com/api/payment';

class PaymentService {

  static loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  static getHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🔑 Request headers:', { ...headers, Authorization: token ? 'Bearer [TOKEN]' : 'No token' });
    return headers;
  }

  // CREATE RAZORPAY ORDER
  static async createOrder(orderData) {
    try {
      console.log('🔄 Creating Razorpay order...', orderData);
      
      const payload = {
        amount: Math.round(orderData.amount), // Amount in rupees, not paise
        currency: 'INR',
        receipt: `espejo_${Date.now()}`,
        notes: orderData.notes || ''
      };
      
      console.log('📦 Sending payload:', payload);
      
      const res = await fetch(`${PAYMENT_API_BASE}/create-order`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      console.log('📊 Response status:', res.status, res.statusText);
      
      const data = await res.json();
      console.log('📊 Create order response:', data);
      
      if (!res.ok) {
        throw new Error(data.message || data.error || `Server error: ${res.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Payment order creation failed');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Create order error:', error);
      throw new Error(error.message || 'Failed to create payment order');
    }
  }

  // VERIFY PAYMENT AND CREATE ORDER
  static async verifyPayment(paymentData) {
    try {
      console.log('🔄 Verifying payment...', paymentData);
      
      const res = await fetch(`${PAYMENT_API_BASE}/verify`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(paymentData)
      });

      const data = await res.json();
      console.log('📊 Verify payment response:', data);
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Payment verification failed');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Payment verification error:', error);
      throw error;
    }
  }

  // LOG PAYMENT FAILURE
  static async logPaymentFailure(orderId, error) {
    try {
      console.log('🔄 Logging payment failure...', { orderId, error });
      
      const res = await fetch(`${PAYMENT_API_BASE}/failure`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          razorpay_order_id: orderId,
          error: {
            description: error?.description || error?.message || 'Payment failed',
            code: error?.code || 'PAYMENT_FAILED',
            source: error?.source || 'razorpay',
            step: error?.step || 'payment',
            reason: error?.reason || 'unknown'
          }
        })
      });

      const data = await res.json();
      console.log('📊 Failure log response:', data);
      
      return data;
    } catch (logError) {
      console.error('❌ Failed to log payment failure:', logError);
    }
  }

  // MAIN PAYMENT PROCESSING METHOD
  static async processPayment(orderData, shippingAddress, onSuccess, onFailure) {
    let razorpayOrderId = null;
    
    try {
      // Step 1: Load Razorpay SDK
      showInfo('Loading payment gateway...');
      const scriptLoaded = await this.loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
      }

      // Step 2: Create Razorpay Order
      showInfo('Creating payment order...');
      const orderResponse = await this.createOrder(orderData);
      const { order, key_id } = orderResponse;
      razorpayOrderId = order.id;

      // Step 3: Configure Razorpay Options
      const razorpayOptions = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'ESPEJO',
        description: 'Premium Mirror Collection',
        image: '/Logo/PNG/SLogo2.png',
        order_id: order.id,
        prefill: {
          name: shippingAddress?.name || '',
          email: shippingAddress?.email || '',
          contact: shippingAddress?.phone || ''
        },
        theme: {
          color: '#862b2a'
        },
        modal: {
          ondismiss: () => {
            console.log('💔 Payment cancelled by user');
            showInfo('Payment cancelled');
            this.logPaymentFailure(razorpayOrderId, {
              description: 'Payment cancelled by user',
              code: 'USER_CANCELLED',
              step: 'payment_modal'
            });
            onFailure?.({ 
              description: 'Payment was cancelled by user',
              code: 'USER_CANCELLED'
            });
          }
        },
        handler: async (response) => {
          try {
            console.log('✅ Payment successful, verifying...', response);
            showInfo('Verifying payment...');
            
            // Step 4: Verify Payment and Create Order
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress,
              notes: orderData.notes || '',
              offerCode: orderData.offerCode || ''
            };
            
            const verificationResult = await this.verifyPayment(verificationData);
            
            console.log('🎉 Payment verified and order created!');
            showSuccess('Payment successful! Order placed.');
            
            onSuccess?.(verificationResult);
            
          } catch (verificationError) {
            console.error('❌ Payment verification failed:', verificationError);
            showError('Payment verification failed. Please contact support.');
            
            await this.logPaymentFailure(response.razorpay_order_id, {
              description: verificationError.message,
              code: 'VERIFICATION_FAILED',
              step: 'payment_verification'
            });
            
            onFailure?.(verificationError);
          }
        }
      };

      // Step 5: Initialize Razorpay
      const razorpay = new window.Razorpay(razorpayOptions);

      // Handle payment failures
      razorpay.on('payment.failed', async (response) => {
        console.error('💥 Payment failed:', response.error);
        showError(`Payment failed: ${response.error.description}`);
        
        await this.logPaymentFailure(response.error.metadata?.order_id, {
          description: response.error.description,
          code: response.error.code,
          source: response.error.source,
          step: response.error.step,
          reason: response.error.reason
        });
        
        onFailure?.(response.error);
      });

      // Step 6: Open Payment Modal
      showInfo('Opening payment gateway...');
      razorpay.open();
      
    } catch (error) {
      console.error('🚨 Payment process error:', error);
      showError(error.message || 'Payment failed. Please try again.');
      
      if (razorpayOrderId) {
        await this.logPaymentFailure(razorpayOrderId, {
          description: error.message,
          code: 'PROCESS_ERROR',
          step: 'payment_initialization'
        });
      }
      
      onFailure?.(error);
    }
  }

  // UTILITY: Format amount for display
  static formatAmount(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // UTILITY: Validate payment data
  static validatePaymentData(orderData, shippingAddress) {
    const errors = [];
    
    if (!orderData?.amount || orderData.amount <= 0) {
      errors.push('Invalid order amount');
    }
    
    if (!shippingAddress?.name) errors.push('Shipping name is required');
    if (!shippingAddress?.phone) errors.push('Phone number is required');
    if (!shippingAddress?.addressLine1) errors.push('Address is required');
    if (!shippingAddress?.city) errors.push('City is required');
    if (!shippingAddress?.state) errors.push('State is required');
    if (!shippingAddress?.pincode) errors.push('Pincode is required');
    
    return errors;
  }
}

export default PaymentService;