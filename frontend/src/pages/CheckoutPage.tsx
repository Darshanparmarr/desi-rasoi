import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ArrowLeft, Truck, Shield, CreditCard, User, Mail } from 'lucide-react';
import { toast } from 'react-toastify';

interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isGuest, setIsGuest] = useState(!user);

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Update guest status when user changes
  useEffect(() => {
    setIsGuest(!user);
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'address', 'city', 'state', 'pincode', 'phone'];
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof ShippingAddress].trim()) {
        toast.error(`Please fill in all required fields`);
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingAddress.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(shippingAddress.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    // Validate pincode
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(shippingAddress.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!cart) return;

    setLoading(true);

    try {
      const orderData: any = {
        orderItems: cart.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: cart.totalAmount,
        shippingPrice: 0,
        totalPrice: cart.totalAmount,
      };

      // Add guest info if not logged in
      if (isGuest || !user) {
        orderData.isGuest = true;
        orderData.guestEmail = shippingAddress.email;
      }

      const { data } = await api.post('/orders', orderData);
      
      toast.success('Order placed successfully!');
      await clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Header */}
        <div className="flex items-center mb-4 md:mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="mr-3 md:mr-4 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors p-2 -ml-2 md:ml-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
              {/* Shipping Address */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
                {/* Guest/Logged In Indicator */}
              {!user && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs md:text-sm text-blue-800">
                        You're checking out as a <strong>guest</strong>. 
                        <Link to="/login" className="underline ml-1 hover:text-blue-900">Login</Link> for faster checkout and order tracking.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary-600" />
                  Shipping Address
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={shippingAddress.name}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={shippingAddress.email}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Order confirmation will be sent to this email
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleInputChange}
                      className="input-field"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary-600" />
                  Payment Method
                </h2>
                
                <div className="space-y-3 md:space-y-4">
                  <label className="flex items-center p-3 md:p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base">Cash on Delivery</p>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Pay when you receive your order</p>
                    </div>
                  </label>

                  <label className="flex items-center p-3 md:p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors opacity-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online"
                      checked={paymentMethod === 'Online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                      disabled
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base">Online Payment</p>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Pay now with card/UPI (Coming Soon)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 md:py-4 bg-green-600 text-white rounded-lg font-semibold text-base md:text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : (isGuest ? 'Place Order as Guest' : 'Place Order')}
              </button>
              
              {isGuest && (
                <p className="text-center text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-3">
                  As a guest, you can track your order using your order ID and email on the{' '}
                  <Link to="/order-lookup" className="text-green-600 hover:underline">order lookup page</Link>
                </p>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3 md:space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        const fallbackImages = [
                          '/images/products/product-1.webp',
                          '/images/products/product-2.webp',
                          '/images/products/product-3.webp',
                          '/images/products/product-4.webp',
                          '/images/products/product-5.webp',
                          '/images/products/product-6.webp',
                          '/images/products/product-7.webp'
                        ];
                        const randomIndex = Math.floor(Math.random() * fallbackImages.length);
                        e.currentTarget.src = fallbackImages[randomIndex];
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base truncate">{item.product.name}</p>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-3 md:pt-4 space-y-2 md:space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  <span>Subtotal</span>
                  <span>₹{cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  <span>Tax</span>
                  <span>₹0.00</span>
                </div>
                <div className="border-t pt-2 md:pt-3">
                  <div className="flex justify-between text-base md:text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-primary-600">₹{cart.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t">
                <div className="flex items-center justify-center space-x-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Secure & Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
