import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ShoppingBag, MapPin, Calendar, ChevronRight, Clock, CheckCircle, Truck, Box, FileDown } from 'lucide-react';
import SocialShareButtons from '../components/SocialShareButtons';
import { toast } from 'react-toastify';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
  };
}

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-brand-green-600" />;
      case 'Shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'Processing':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Box className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  const downloadInvoice = async (orderId: string) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId.slice(-8).toUpperCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to download invoice');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-brand-green-100 text-brand-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-green-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-brand-green-500 mx-auto mb-4 animate-pulse" />
          <p className="text-brand-green-700 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-green-50">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12">
            <div className="w-32 h-32 bg-brand-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="h-16 w-16 text-brand-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Please Login</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">You need to be logged in to view your orders.</p>
            <Link to="/login" className="inline-flex items-center bg-brand-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-green-700 transition-all transform hover:scale-105">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-brand-green-50">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12">
            <div className="w-32 h-32 bg-brand-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="h-16 w-16 text-brand-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No Orders Yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <Link to="/products" className="inline-flex items-center bg-brand-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-green-700 transition-all transform hover:scale-105">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-green-50">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-brand-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage your orders</p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center bg-brand-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-green-700 transition-colors"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shop More
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-brand-green-100">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-brand-green-100">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Delivered</p>
            <p className="text-2xl font-bold text-brand-green-600">
              {orders.filter(o => o.orderStatus === 'Delivered').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-brand-green-100">
            <p className="text-gray-500 dark:text-gray-400 text-sm">In Transit</p>
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.orderStatus === 'Shipped').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-brand-green-100">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Processing</p>
            <p className="text-2xl font-bold text-amber-600">
              {orders.filter(o => o.orderStatus === 'Processing').length}
            </p>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-brand-green-100 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Order Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Order ID</p>
                    <p className="font-bold text-gray-900 dark:text-white">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SocialShareButtons
                      title={`I just placed an order at Akshar E-Commerce! Order #${order._id.slice(-8).toUpperCase()}`}
                      description={`Ordered ${order.orderItems.length} items for ₹${order.totalPrice.toFixed(2)}`}
                      variant="compact"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 transition-colors"
                    />
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      <span>{order.orderStatus}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {order.shippingAddress?.city || 'Unknown'}
                  </div>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  {order.orderItems.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex-1">
                      <div className="bg-brand-green-50 rounded-lg p-3">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.name}</p>
                        <p className="text-brand-green-600 font-semibold">₹{item.price}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">+{order.orderItems.length - 3}</span>
                    </div>
                  )}
                </div>

                {order.orderItems.length === 1 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="text-gray-400">{order.orderItems[0].quantity} items</span>
                  </div>
                )}
              </div>

              {/* Order Footer */}
              <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                    <p className="text-xl font-bold text-brand-green-600">₹{order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadInvoice(order._id)}
                      className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-brand-green-600 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700"
                      title="Download Invoice"
                    >
                      <FileDown className="h-4 w-4" />
                      <span className="text-sm">Invoice</span>
                    </button>
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="flex items-center text-brand-green-600 font-medium hover:text-brand-green-700 transition-colors"
                    >
                      Details
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
