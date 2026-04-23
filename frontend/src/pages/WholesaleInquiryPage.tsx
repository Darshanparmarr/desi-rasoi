import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  Users, 
  Package, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  Send,
  Gift,
  IndianRupee,
  Sparkles,
  Plus,
  X,
  Search
} from 'lucide-react';
import axios from 'axios';
import { Product } from '../types';

interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  eventType: string;
  eventDate: string;
  expectedGuests: string;
  budget: string;
  packaging: string;
  message: string;
}

interface SelectedProduct {
  productId: string;
  productName: string;
  quantity: number;
  notes: string;
}

const WholesaleInquiryPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedProductId = queryParams.get('product');

  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    eventType: '',
    eventDate: '',
    expectedGuests: '',
    budget: '',
    packaging: '',
    message: ''
  });

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [inquiryId, setInquiryId] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/products`);
      setAvailableProducts(response.data.data || response.data);
      
      // If product was preselected from URL
      if (preselectedProductId && response.data.data) {
        const product = response.data.data.find((p: Product) => p._id === preselectedProductId);
        if (product) {
          addProduct(product);
        }
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addProduct = (product: Product) => {
    if (!selectedProducts.find(p => p.productId === product._id)) {
      setSelectedProducts([...selectedProducts, {
        productId: product._id,
        productName: product.name,
        quantity: 1,
        notes: ''
      }]);
    }
    setShowProductSelector(false);
    setProductSearch('');
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    setSelectedProducts(selectedProducts.map(p => 
      p.productId === productId ? { ...p, quantity: Math.max(1, quantity) } : p
    ));
  };

  const updateProductNotes = (productId: string, notes: string) => {
    setSelectedProducts(selectedProducts.map(p => 
      p.productId === productId ? { ...p, notes } : p
    ));
  };

  const filteredProducts = availableProducts.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
    !selectedProducts.find(sp => sp.productId === p._id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmitSuccess(false);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${apiUrl}/wholesale`, {
        ...formData,
        products: selectedProducts
      });
      
      setSubmitSuccess(true);
      setInquiryId(response.data.inquiryId);
      setFormData({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        eventType: '',
        eventDate: '',
        expectedGuests: '',
        budget: '',
        packaging: '',
        message: ''
      });
      setSelectedProducts([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 dark:from-green-900/20 to-orange-50 dark:to-orange-900/20 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Inquiry Submitted Successfully!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you for your wholesale inquiry. Our team will review your requirements and contact you within 24 hours.
            </p>
            {inquiryId && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">Inquiry Reference ID</p>
                <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">{inquiryId}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Browse Products
              </Link>
              <Link
                to="/"
                className="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-800 via-green-700 to-orange-600 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/products" className="inline-flex items-center text-green-100 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Products
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bulk & Wholesale Inquiry</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Planning a wedding, corporate event, or need retail stock? Get special pricing for bulk orders of papads, pickles, masalas, snacks, sweets & more.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50 dark:bg-gray-800" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </div>

      {/* Benefits Bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-10 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
            <IndianRupee className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-800 dark:text-gray-200">Special Pricing</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Up to 40% off</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
            <Gift className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="font-semibold text-gray-800 dark:text-gray-200">Custom Packaging</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Branded solutions</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
            <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-800 dark:text-gray-200">Free Shipping</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">On orders above ₹10k</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
            <Sparkles className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="font-semibold text-gray-800 dark:text-gray-200">Premium Quality</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Guaranteed freshness</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 m-6 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row">
              {/* Form Side */}
              <div className="lg:w-3/5 p-6 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">1</span>
                  </div>
                  Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  Event Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Event Type *</label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white dark:bg-gray-800"
                    >
                      <option value="">Select event type</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Corporate Event">Corporate Event</option>
                      <option value="Festival">Festival</option>
                      <option value="Retail Store">Retail Store</option>
                      <option value="Hotel/Restaurant">Hotel/Restaurant</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Event Date</label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected Guests/Quantity</label>
                    <select
                      name="expectedGuests"
                      value={formData.expectedGuests}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white dark:bg-gray-800"
                    >
                      <option value="">Select quantity</option>
                      <option value="Less than 50">Less than 50</option>
                      <option value="50-100">50 - 100</option>
                      <option value="100-250">100 - 250</option>
                      <option value="250-500">250 - 500</option>
                      <option value="500-1000">500 - 1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Estimated Budget</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white dark:bg-gray-800"
                    >
                      <option value="">Select budget range</option>
                      <option value="Under ₹5,000">Under ₹5,000</option>
                      <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
                      <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
                      <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                      <option value="₹50,000+">₹50,000+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Packaging Preferences */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  Packaging Preferences
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['Standard', 'Gift Boxes', 'Custom Labels', 'Individual Packets', 'Not Sure'].map((option) => (
                    <label
                      key={option}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center ${
                        formData.packaging === option
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="packaging"
                        value={option}
                        checked={formData.packaging === option}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <Package className={`w-6 h-6 mx-auto mb-2 ${formData.packaging === option ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${formData.packaging === option ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Product Selection */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">4</span>
                  </div>
                  Products Interested
                </h2>

                {/* Selected Products */}
                {selectedProducts.length > 0 && (
                  <div className="mb-6 space-y-3">
                    {selectedProducts.map((product) => (
                      <div key={product.productId} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{product.productName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateProductQuantity(product.productId, product.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-semibold">{product.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateProductQuantity(product.productId, product.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700"
                          >
                            +
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Special notes (optional)"
                          value={product.notes}
                          onChange={(e) => updateProductNotes(product.productId, e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm w-48"
                        />
                        <button
                          type="button"
                          onClick={() => removeProduct(product.productId)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Product Button */}
                <button
                  type="button"
                  onClick={() => setShowProductSelector(true)}
                  className="w-full py-4 border-2 border-dashed border-green-300 rounded-xl text-green-600 font-semibold hover:bg-green-50 dark:bg-green-900/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Products to Inquiry
                </button>

                {/* Product Selector Modal */}
                {showProductSelector && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Products</h3>
                          <button
                            onClick={() => setShowProductSelector(false)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 rounded-lg"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="relative">
                          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto max-h-[50vh] p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {filteredProducts.map((product) => (
                            <button
                              key={product._id}
                              onClick={() => addProduct(product)}
                              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 dark:bg-green-900/20 transition-all text-left"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white truncate">{product.name}</p>
                                <p className="text-sm text-green-600">₹{product.price}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{product.weight}</p>
                              </div>
                              <Plus className="w-5 h-5 text-green-600" />
                            </button>
                          ))}
                        </div>
                        {filteredProducts.length === 0 && (
                          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No products found</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Message */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">5</span>
                  </div>
                  Additional Information
                </h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                    placeholder="Tell us more about your requirements, delivery preferences, or any special requests..."
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Wholesale Inquiry
                    </>
                  )}
                </button>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  By submitting, you agree to be contacted regarding your inquiry. We respect your privacy.
                </p>
              </div>
              </form>
              </div>

              {/* Info Side */}
              <div className="lg:w-2/5 bg-gradient-to-br from-green-700 to-green-800 p-8 md:p-12 text-white">
                <h3 className="text-2xl font-bold mb-6">Why Choose Our Homemade Products?</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Premium Quality</h4>
                      <p className="text-green-100 text-sm">Handcrafted in home kitchens using traditional recipes and fresh ingredients.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Authentic Taste</h4>
                      <p className="text-green-100 text-sm">Genuine homemade flavors of papads, pickles, masalas, snacks & sweets.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Bulk Orders</h4>
                      <p className="text-green-100 text-sm">Special pricing for weddings, events, retail stores, and corporate gifting.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Pan India Delivery</h4>
                      <p className="text-green-100 text-sm">Fast and reliable shipping to every corner of India.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/20">
                  <p className="text-green-100 text-sm mb-4">Follow us on social media</p>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WholesaleInquiryPage;
