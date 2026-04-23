import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Home, 
  ShoppingBag,
  Printer,
  Clock,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

interface Order {
  _id: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email?: string;
  };
  totalPrice: number;
  orderStatus: string;
  paymentMethod: string;
  isPaid: boolean;
  createdAt: string;
  guestInfo?: {
    isGuest: boolean;
    email?: string;
  };
}

const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${apiUrl}/orders/${id}`);
        setOrder(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Unable to load order details'}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/order-lookup"
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Track Your Order
              </Link>
              <Link
                to="/products"
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isGuestOrder = order.guestInfo?.isGuest;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thank you for your order. We've sent a confirmation email to <strong>{order.shippingAddress.email || order.guestInfo?.email}</strong>
          </p>
          
          {isGuestOrder && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Guest Checkout:</strong> Save your order ID to track your order status
              </p>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 inline-block">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Order ID</p>
            <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">{order._id}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Details</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                order.orderStatus === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800 dark:text-green-200' :
                'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Items Ordered</h3>
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

          {/* Shipping Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Shipping Address</h3>
            <div className="text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-gray-900 dark:text-white">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>PIN: {order.shippingAddress.pincode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Payment Status</span>
                <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                  {order.isPaid ? 'Paid' : 'Pending (Cash on Delivery)'}
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

        {/* What's Next */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Order Processing</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">We're preparing your order for shipment. You'll receive an email when it's on its way.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Delivery</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expected delivery within 3-5 business days. Track your order status anytime.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Need Help?</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Questions about your order?{' '}
                  <Link to="/contact" className="text-green-600 hover:underline">Contact our support team</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/products"
            className="flex-1 px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
          {isGuestOrder && (
            <Link
              to="/order-lookup"
              className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Track Order
            </Link>
          )}
          <button
            onClick={handlePrint}
            className="px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Print Receipt
          </button>
          <Link
            to="/"
            className="px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
        </div>

        {/* Guest Order Note */}
        {isGuestOrder && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> Create an account to easily track all your orders and get exclusive offers.{' '}
              <Link to="/register" className="underline hover:text-yellow-900">Register now</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSuccessPage;
