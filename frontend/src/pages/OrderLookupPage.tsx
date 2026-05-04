import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Home,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalPrice: number;
  paymentMethod: string;
  isPaid: boolean;
  createdAt: string;
}

const OrderLookupPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${apiUrl}/orders/guest-lookup`, {
        orderId,
        email
      });
      setOrder(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to find order. Please check your order ID and email.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    return steps.indexOf(status);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Shipped':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'Processing':
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:text-green-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-orange-100 text-orange-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Track Your Order</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enter your order ID and email to check the status of your order
          </p>
        </div>

        {/* Lookup Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <form onSubmit={handleLookup} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Order ID *
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g., 64a1b2c3d4e5f6g7h8i9j0k1"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Found in your order confirmation email
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  The email used when placing the order
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Looking up...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-green-100 text-sm">Order ID</p>
                  <p className="text-xl font-bold">{order._id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    <span className="ml-2">{order.orderStatus}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            {order.orderStatus !== 'Cancelled' && (
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
                    const currentStep = getStatusStep(order.orderStatus);
                    const isActive = index <= currentStep;
                    const isCurrent = index === currentStep;

                    return (
                      <div key={step} className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          isActive ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}>
                          {index === 0 && <Package className="w-5 h-5" />}
                          {index === 1 && <Clock className="w-5 h-5" />}
                          {index === 2 && <Truck className="w-5 h-5" />}
                          {index === 3 && <CheckCircle className="w-5 h-5" />}
                        </div>
                        <span className={`text-xs font-medium ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                          {step}
                        </span>
                        {index < 3 && (
                          <div className={`hidden md:block absolute h-1 w-16 mt-5 ml-16 ${
                            index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid md:grid-cols-2 gap-6 p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Shipping Address</h3>
                <div className="text-gray-600 dark:text-gray-400 space-y-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>PIN: {order.shippingAddress.pincode}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Order Date</span>
                    <span className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Payment Status</span>
                    <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-600">₹{order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Need help with your order?{' '}
                  <a
                    href="https://wa.me/9867008801"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline font-medium"
                  >
                    Chat on WhatsApp
                  </a>
                </p>
                <div className="flex gap-3">
                  <Link
                    to="/products"
                    className="px-6 py-2 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 dark:bg-green-900/20 transition-colors"
                  >
                    Shop More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!order && (
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Continue Shopping</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Browse our collection of premium Mukhwas</p>
              <Link to="/products" className="text-green-600 font-medium hover:underline inline-flex items-center">
                Shop Now <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Create Account</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Sign up to track all your orders easily</p>
              <Link to="/register" className="text-green-600 font-medium hover:underline inline-flex items-center">
                Register <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Need Help?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Can't find your order? Get in touch</p>
              <a
                href="https://wa.me/9867008801"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 font-medium hover:underline inline-flex items-center"
              >
                WhatsApp Us <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderLookupPage;
