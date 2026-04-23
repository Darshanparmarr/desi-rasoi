import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Leaf, 
  Truck, 
  Package, 
  CreditCard, 
  RotateCcw,
  Sparkles,
  Search,
  MessageCircle
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // General Questions
  {
    question: "What products do you offer?",
    answer: "We offer a wide range of authentic homemade Indian products including Papads (crispy lentil wafers), Aachar (traditional pickles), Masala (fresh ground spices), Mouth Fresheners (mukhwas), Snacks (homemade namkeen), and Sweets (traditional mithai). All products are made using traditional family recipes with 100% natural ingredients.",
    category: "general"
  },
  {
    question: "What is Mukhwas?",
    answer: "Mukhwas is a traditional Indian after-meal mouth freshener and digestive aid. It's a blend of various seeds, nuts, spices, and herbs that are commonly consumed after meals to freshen breath and aid digestion. Our Mukhwas varieties are made from premium ingredients sourced directly from India's finest spice regions.",
    category: "general"
  },
  {
    question: "What are your Papads made of?",
    answer: "Our papads are made from various lentils and pulses like urad dal, moong dal, and chana dal. They're seasoned with authentic spices like black pepper, cumin, and ajwain, then sun-dried to achieve that perfect crispy texture when roasted or fried.",
    category: "general"
  },
  {
    question: "How are your pickles (Aachar) prepared?",
    answer: "Our pickles are prepared using traditional methods passed down through generations. We use farm-fresh vegetables and fruits, premium mustard oil, and hand-ground spices. Each batch is carefully aged to develop that authentic tangy, spicy flavor that homemade pickles are known for.",
    category: "general"
  },
  {
    question: "Are your masalas freshly ground?",
    answer: "Yes! All our masalas are freshly ground in small batches to ensure maximum freshness and aroma. We source whole spices directly from farms and grind them using traditional methods. This ensures you get the authentic taste and full nutritional benefits of the spices.",
    category: "general"
  },
  {
    question: "Are your products 100% natural?",
    answer: "Yes! All our products - whether it's papads, pickles, masalas, or mukhwas - are made with 100% natural ingredients. We use no artificial colors, flavors, or preservatives. Our products are prepared using traditional family recipes passed down through generations.",
    category: "general"
  },
  {
    question: "Are homemade products healthier than store-bought?",
    answer: "Absolutely! Homemade products are prepared in small batches with carefully selected ingredients, without the additives and preservatives commonly found in mass-produced items. Our papads are sun-dried not machine-dried, pickles are naturally fermented, and spices are freshly ground - all preserving maximum nutrition and authentic taste.",
    category: "general"
  },
  {
    question: "Is Mukhwas good for health?",
    answer: "Mukhwas has several health benefits. Fennel seeds aid digestion and reduce bloating. Sesame seeds are rich in calcium and minerals. Cardamom helps freshen breath and aids digestion. Many of our herbal varieties also contain ingredients known for their medicinal properties.",
    category: "general"
  },
  {
    question: "Do you have sugar-free options?",
    answer: "Yes! We offer several sugar-free and low-sugar varieties. Look for our 'Herbal' and 'Medicinal' categories which contain options sweetened naturally with ingredients like stevia or are unsweetened.",
    category: "general"
  },

  // Shipping Questions
  {
    question: "How long does shipping take?",
    answer: "We deliver within 3-5 business days across India. Metro cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad) typically receive orders within 2-3 days. Remote areas may take 5-7 business days.",
    category: "shipping"
  },
  {
    question: "What are the shipping charges?",
    answer: "We offer FREE shipping on all orders above ₹500. For orders below ₹500, a flat shipping fee of ₹50 is charged. Wholesale and bulk orders always enjoy free shipping.",
    category: "shipping"
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within India. We are working on expanding our services to international markets soon. Follow us on social media for updates!",
    category: "shipping"
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you'll receive an email with a tracking link. You can also track your order on our website using the 'Track Order' feature. Guest users can track orders using their order ID and email on the Order Lookup page.",
    category: "shipping"
  },
  {
    question: "What if I'm not home when the delivery arrives?",
    answer: "Our delivery partners will attempt delivery up to 3 times. If you're not available, they'll leave a notification. You can also provide an alternate delivery address or authorize a neighbor to receive the package.",
    category: "shipping"
  },

  // Orders & Payment
  {
    question: "What payment methods do you accept?",
    answer: "We accept multiple payment methods including: Cash on Delivery (COD), Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Wallets. All online payments are processed through secure, encrypted channels.",
    category: "orders"
  },
  {
    question: "Is Cash on Delivery available?",
    answer: "Yes, Cash on Delivery (COD) is available for all orders across India. However, some high-value orders may require partial or full online payment for security reasons.",
    category: "orders"
  },
  {
    question: "Can I modify or cancel my order?",
    answer: "Orders can be modified or cancelled within 2 hours of placing them, or before they are processed for shipping (whichever comes first). Once shipped, orders cannot be cancelled but can be returned after delivery.",
    category: "orders"
  },
  {
    question: "Do I need an account to place an order?",
    answer: "No, you can checkout as a guest! However, creating an account gives you benefits like faster checkout, order history, exclusive offers, and easy reordering.",
    category: "orders"
  },

  // Products & Packaging
  {
    question: "What is the shelf life of your Mukhwas?",
    answer: "Our Mukhwas typically has a shelf life of 6-12 months from the date of manufacture, depending on the variety. Each package displays the 'Best Before' date. Store in a cool, dry place away from direct sunlight for maximum freshness.",
    category: "products"
  },
  {
    question: "How should I store Mukhwas?",
    answer: "Store Mukhwas in an airtight container in a cool, dry place away from direct sunlight and moisture. Refrigeration is not necessary but can extend freshness in humid climates.",
    category: "products"
  },
  {
    question: "Do you offer gift packaging?",
    answer: "Yes! We offer beautiful gift packaging options including decorative boxes, custom labels, and personalized messages. Perfect for weddings, festivals, and corporate gifting. Contact us for custom gift packaging.",
    category: "products"
  },
  {
    question: "Are your products vegetarian/vegan?",
    answer: "All our Mukhwas products are 100% vegetarian. Most are also vegan, but some traditional varieties may contain honey or ghee. Please check individual product descriptions or contact us for specific dietary requirements.",
    category: "products"
  },

  // Wholesale & Bulk
  {
    question: "Do you offer wholesale pricing?",
    answer: "Yes! We offer special wholesale pricing for bulk orders. Whether you're a retailer, event planner, or need bulk quantities for weddings/corporate events, we have customized solutions. Submit a wholesale inquiry on our Bulk Orders page.",
    category: "wholesale"
  },
  {
    question: "What is the minimum order quantity for wholesale?",
    answer: "Our wholesale pricing starts at orders worth ₹5,000. The exact minimum quantity varies by product. Contact our wholesale team for specific product pricing and MOQs.",
    category: "wholesale"
  },
  {
    question: "Can I get custom packaging for events?",
    answer: "Absolutely! We specialize in custom packaging for weddings, corporate events, and festivals. Options include personalized labels, gift boxes, individual sachets, and branded packaging. Contact us to discuss your requirements.",
    category: "wholesale"
  },
  {
    question: "Do you provide samples before bulk orders?",
    answer: "Yes, we can provide samples for evaluation before large bulk orders. Sample costs are adjusted against your final bulk order. Contact our wholesale team to request samples.",
    category: "wholesale"
  },

  // Returns & Refunds
  {
    question: "What is your return policy?",
    answer: "We accept returns within 7 days of delivery for damaged, defective, or incorrect items. For quality issues, we offer full refunds or replacements. Food products that have been opened cannot be returned for hygiene reasons unless defective.",
    category: "returns"
  },
  {
    question: "How do I request a refund?",
    answer: "To request a refund, contact our customer support with your order ID and reason for return. Once approved, refunds are processed within 5-7 business days to your original payment method.",
    category: "returns"
  },
  {
    question: "What if I receive a damaged product?",
    answer: "If you receive a damaged product, please take photos and contact us within 48 hours of delivery. We'll arrange a replacement or full refund at no extra cost.",
    category: "returns"
  }
];

const categories = [
  { id: 'all', name: 'All Questions', icon: HelpCircle },
  { id: 'general', name: 'General', icon: Sparkles },
  { id: 'shipping', name: 'Shipping', icon: Truck },
  { id: 'orders', name: 'Orders & Payment', icon: CreditCard },
  { id: 'products', name: 'Products', icon: Package },
  { id: 'wholesale', name: 'Wholesale', icon: Leaf },
  { id: 'returns', name: 'Returns', icon: RotateCcw },
];

const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-800 via-green-700 to-orange-600 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Find answers to common questions about our homemade papads, pickles, masalas, snacks, and sweets
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50 dark:bg-gray-800" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all shadow-lg"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                    {openItems.has(index) ? (
                      <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openItems.has(index) && (
                    <div className="px-6 pb-4">
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search or browse all categories</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                View All Questions
              </button>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
            <p className="text-green-100 mb-6">
              Can't find what you're looking for? Our team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-3 bg-white dark:bg-gray-800 text-green-700 dark:text-green-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 transition-colors"
              >
                Contact Us
              </Link>
              <a
                href="tel:+919876543210"
                className="px-8 py-3 bg-green-50 dark:bg-green-900/200 text-white rounded-xl font-semibold hover:bg-green-400 transition-colors"
              >
                Call Us: +91 98765 43210
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
          <Link to="/products" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <Package className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Browse Products</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Explore our range of premium Mukhwas varieties</p>
          </Link>
          <Link to="/wholesale" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <Leaf className="w-10 h-10 text-orange-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Bulk Orders</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get special pricing for events and wholesale</p>
          </Link>
          <Link to="/order-lookup" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <Truck className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Track Order</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Check the status of your recent order</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
