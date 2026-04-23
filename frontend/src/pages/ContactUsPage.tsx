import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await axios.post(`${apiUrl}/contact`, formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-800 via-green-700 to-orange-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
            We'd love to hear from you. Get in touch with us for any queries, feedback, or bulk orders.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </div>

      {/* Contact Info Cards */}
      <section className="py-16 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Email */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Email Us</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">support@mukhwas.com</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">orders@mukhwas.com</p>
            </div>

            {/* Phone */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Call Us</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">+91 98765 43210</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">+91 98765 43211</p>
            </div>

            {/* Address */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Visit Us</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">123 Spice Market</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Ahmedabad, Gujarat, India</p>
            </div>

            {/* Hours */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Working Hours</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Mon - Sat: 9AM - 8PM</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Sunday: 10AM - 6PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 dark:from-green-900/20 to-orange-50 dark:to-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Form Side */}
                <div className="lg:w-3/5 p-8 md:p-12">
                  <div className="mb-8">
                    <span className="text-orange-600 font-semibold uppercase tracking-wide text-sm">Get In Touch</span>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-2">Send Us a Message</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Have questions about our products or need bulk orders? Fill out the form below.</p>
                  </div>

                  {success && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <p className="text-green-800 dark:text-green-200">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
                    </div>
                  )}

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      <p className="text-red-800">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                          placeholder="John Doe"
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
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject *</label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white dark:bg-gray-800"
                        >
                          <option value="">Select a subject</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Order Status">Order Status</option>
                          <option value="Bulk Order">Bulk/Wholesale Order</option>
                          <option value="Product Feedback">Product Feedback</option>
                          <option value="Return/Refund">Return/Refund</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Info Side */}
                <div className="lg:w-2/5 bg-gradient-to-br from-green-700 to-green-800 p-8 md:p-12 text-white">
                  <h3 className="text-2xl font-bold mb-6">Why Choose Our Mukhwas?</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Premium Quality</h4>
                        <p className="text-green-100 text-sm">Handpicked ingredients sourced directly from India's finest spice regions.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Traditional Recipes</h4>
                        <p className="text-green-100 text-sm">Authentic recipes passed down through generations of Mukhwas makers.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Bulk Orders</h4>
                        <p className="text-green-100 text-sm">Special pricing for weddings, events, and corporate gifting.</p>
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
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-orange-600 font-semibold uppercase tracking-wide text-sm">FAQ</span>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-2">Frequently Asked Questions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">What is Mukhwas?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Mukhwas is a traditional Indian after-meal mouth freshener made from various seeds, nuts, and spices. It aids digestion and freshens breath naturally.</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Do you offer bulk orders?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Yes! We offer special pricing for bulk orders for weddings, corporate events, and festivals. Contact us for customized packages.</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">How long does shipping take?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">We deliver within 3-5 business days across India. Express delivery options are available for select cities.</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Are your products natural?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Absolutely! All our Mukhwas varieties are 100% natural with no artificial colors, flavors, or preservatives.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
