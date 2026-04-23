import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Download, FileText, MapPin, Package, Printer, User } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

interface OrderItem {
  _id?: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderDetails {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  itemsPrice: number;
  shippingPrice: number;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  isPaid: boolean;
  createdAt: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
}

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'products' | 'invoice'>('details');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const totalItems = useMemo(() => {
    if (!order) return 0;
    return order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [order]);

  const downloadInvoice = async () => {
    if (!order) return;
    try {
      const response = await api.get(`/orders/${order._id}/invoice`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${order._id.slice(-8).toUpperCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to download invoice');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-green-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-brand-green-600 animate-pulse mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-green-50 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">This order is unavailable or you do not have access.</p>
          <Link to="/orders" className="inline-flex items-center text-brand-green-600 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-green-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-brand-green-100 overflow-hidden">
        <div className="border-b px-6 pt-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link to="/orders" className="text-gray-500 dark:text-gray-400 hover:text-brand-green-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={downloadInvoice}
                className="px-3 py-2 text-sm rounded-lg bg-brand-green-600 text-white hover:bg-brand-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <button onClick={() => setActiveTab('details')} className={`pb-3 border-b-2 ${activeTab === 'details' ? 'border-brand-green-600 text-brand-green-700 font-medium' : 'border-transparent text-gray-500 dark:text-gray-400'}`}>Order Details</button>
            <button onClick={() => setActiveTab('products')} className={`pb-3 border-b-2 ${activeTab === 'products' ? 'border-brand-green-600 text-brand-green-700 font-medium' : 'border-transparent text-gray-500 dark:text-gray-400'}`}>Products</button>
            <button onClick={() => setActiveTab('invoice')} className={`pb-3 border-b-2 ${activeTab === 'invoice' ? 'border-brand-green-600 text-brand-green-700 font-medium' : 'border-transparent text-gray-500 dark:text-gray-400'}`}>Invoice</button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Customer</h3>
                <p className="text-gray-800 dark:text-gray-200">{order.shippingAddress.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{order.shippingAddress.phone}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" /> Order Info</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Status: {order.orderStatus}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Payment: {order.isPaid ? 'Paid' : 'Pending'}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Method: {order.paymentMethod}</p>
              </div>
              <div className="md:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Shipping Address</h3>
                <p className="text-gray-800 dark:text-gray-200">{order.shippingAddress.address}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-3">
              {order.orderItems.map((item, idx) => (
                <div key={`${item._id || item.name}-${idx}`} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-brand-green-700">INR {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'invoice' && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FileText className="w-4 h-4" /> Invoice Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Items ({totalItems})</span><span>INR {order.itemsPrice.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Shipping</span><span>INR {order.shippingPrice.toFixed(2)}</span></div>
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-base"><span>Total</span><span>INR {order.totalPrice.toFixed(2)}</span></div>
              </div>
              <button onClick={downloadInvoice} className="mt-5 px-4 py-2 bg-brand-green-600 text-white rounded-lg hover:bg-brand-green-700">
                Download Invoice PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
