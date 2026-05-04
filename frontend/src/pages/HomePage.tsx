import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ShoppingBag, Star, ArrowRight, Leaf, Sparkles, Heart, Users, Quote, ShieldCheck, Truck, Clock, ChevronDown } from 'lucide-react';
import RecentlyViewedProducts from '../components/RecentlyViewedProducts';
import { getImageUrl } from '../utils/imageUrl';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  numReviews: number;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

const FALLBACK_IMAGES = [
  '/images/products/product-1.webp',
  '/images/products/product-2.webp',
  '/images/products/product-3.webp',
  '/images/products/product-4.webp',
  '/images/products/product-5.webp',
  '/images/products/product-6.webp',
];

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products/featured'),
          api.get<Category[]>('/categories'),
        ]);
        setFeaturedProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Brand story features for homemade Indian products
  const brandFeatures = [
    {
      icon: <Leaf className="h-10 w-10 text-brand-green-600" />,
      title: 'Homemade with Love',
      description: 'Every product is crafted in home kitchens using traditional family recipes passed down generations.',
    },
    {
      icon: <Sparkles className="h-10 w-10 text-brand-green-600" />,
      title: 'Authentic Taste',
      description: 'Experience the true flavors of India with our authentic homemade preparations.',
    },
    {
      icon: <Heart className="h-10 w-10 text-brand-green-600" />,
      title: '100% Natural',
      description: 'No artificial colors, no preservatives—just pure, wholesome homemade goodness.',
    },
    {
      icon: <Users className="h-10 w-10 text-brand-green-600" />,
      title: 'Support Local',
      description: 'Every purchase supports home-based entrepreneurs and traditional food makers across India.',
    },
  ];

  // Testimonials like Rosier Foods
  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      text: 'The authentic taste reminds me of my grandmother. Truly the best mukhwas I have ever tasted!',
      product: 'Traditional Saunf',
      image: '/images/products/product-1.webp',
    },
    {
      name: 'Rajesh Patel',
      location: 'Ahmedabad',
      text: 'Perfect after-meal treat. The quality is exceptional and the aroma is divine.',
      product: 'Herbal Mix',
      image: '/images/products/product-2.webp',
    },
    {
      name: 'Anita Gupta',
      location: 'Delhi',
      text: 'I serve this at all my dinner parties. Guests always ask where I get it from!',
      product: 'Sweet Rose Mix',
      image: '/images/products/product-3.webp',
    },
  ];  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 overflow-hidden">
      {/* Hero Section - Ultra Premium Glassmorphism Style */}
      <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center">
        {/* Background Image with slow zoom animation */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/products/banner.png"
            alt="Akshar E-Commerce Background"
            className="w-full h-full object-cover scale-105"
            style={{ animation: 'pulse 20s infinite alternate' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-gray-50 dark:to-gray-900"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center pt-16 md:pt-20 pb-24 md:pb-32">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* Glassmorphism Badge */}
            <div className="inline-flex items-center backdrop-blur-md bg-white/10 border border-white/20 text-white rounded-full px-6 py-2.5 text-sm md:text-base font-medium mb-6 md:mb-10 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-white/20 transition-all duration-300 cursor-default transform hover:-translate-y-1">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 mr-2 text-brand-green-300" />
              <span className="tracking-wide uppercase letter-spacing-2">Handcrafted with Heritage</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
              Taste the <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green-300 via-emerald-200 to-white">
                Soul of India
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl font-light drop-shadow-lg px-4">
              Discover the authentic taste of homemade Indian papads, pickles, masalas, 
              and traditional snacks crafted with love.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center w-full sm:w-auto px-4 sm:px-0">
              <Link 
                to="/products" 
                className="group relative inline-flex items-center justify-center bg-brand-green-600 text-white px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(5,150,105,0.6)] hover:scale-105 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 ease-out -skew-x-12 -ml-4 w-1/2"></div>
                <ShoppingBag className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Shop Collection
              </Link>
              <Link 
                to="/categories" 
                className="inline-flex items-center justify-center backdrop-blur-md bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] w-full sm:w-auto"
              >
                Explore Categories
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center animate-bounce text-white/70">
          <span className="text-xs font-bold tracking-[0.3em] uppercase mb-2">Scroll</span>
          <ChevronDown className="h-6 w-6" />
        </div>
      </section>

      {/* Trust Badges - Floating Glassmorphism strip */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 md:-mt-16 mb-16 md:mb-24">
        <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border border-white/50 dark:border-gray-700/50 rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-2 md:gap-0 md:divide-x divide-gray-100 dark:divide-gray-700/50">
          {[
            { icon: <ShieldCheck className="w-8 h-8 md:w-10 md:h-10" />, title: "Premium Quality", sub: "100% Authentic" },
            { icon: <Heart className="w-8 h-8 md:w-10 md:h-10" />, title: "Homemade", sub: "Made with Love" },
            { icon: <Truck className="w-8 h-8 md:w-10 md:h-10" />, title: "Fast Delivery", sub: "Across India" },
            { icon: <Clock className="w-8 h-8 md:w-10 md:h-10" />, title: "Freshly Made", sub: "In Small Batches" },
          ].map((badge, idx) => (
            <div key={idx} className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 justify-center py-2 md:py-0 group cursor-default text-center lg:text-left px-1 sm:px-2">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-green-50 to-brand-green-100 dark:from-brand-green-900/40 dark:to-brand-green-800/20 text-brand-green-600 dark:text-brand-green-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-inner">
                {badge.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base md:text-lg tracking-tight">{badge.title}</h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">{badge.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Large Category Cards - Immersive Cinematic Style */}
      <section className="py-12 md:py-20 relative">
        <div className="absolute inset-0 bg-brand-green-50/30 dark:bg-gray-900/50 skew-y-3 transform origin-bottom-left -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight drop-shadow-sm">
              Discover Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green-600 to-emerald-400 dark:from-brand-green-400 dark:to-emerald-300">Collections</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              A curated selection of India's finest homemade delicacies
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-[2rem] aspect-[4/5] bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {categories.map((category, index) => {
                const imgSrc = getImageUrl(category.image) || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                return (
                  <Link
                    key={category._id}
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    className="group relative overflow-hidden rounded-[2rem] aspect-[4/5] shadow-xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 bg-gray-100 dark:bg-gray-800"
                  >
                    <img
                      src={imgSrc}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="w-12 h-1 bg-brand-green-400 mb-4 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg tracking-tight">{category.name}</h3>
                      {category.description && (
                        <p className="text-white/90 mb-6 text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-medium leading-relaxed">{category.description}</p>
                      )}
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white group-hover:bg-brand-green-500 transition-colors duration-300">
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bestsellers Section - Premium Card Design */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute top-0 right-0 -mt-20 w-96 h-96 bg-brand-green-400/10 dark:bg-brand-green-900/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-900/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6">
            <div className="max-w-2xl">
              <span className="text-brand-green-600 dark:text-brand-green-400 font-bold tracking-[0.2em] uppercase text-sm mb-2 block">Top Rated</span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">Best Sellers</h2>
            </div>
            <Link 
              to="/products" 
              className="group inline-flex items-center text-brand-green-600 dark:text-brand-green-400 font-bold text-lg hover:text-brand-green-700 dark:hover:text-brand-green-300 transition-colors"
            >
              View entire collection
              <span className="ml-2 w-8 h-8 rounded-full bg-brand-green-50 dark:bg-brand-green-900/30 flex items-center justify-center group-hover:bg-brand-green-100 dark:group-hover:bg-brand-green-800/50 transition-colors">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-800 rounded-[2rem] h-80 mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group block"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-4 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 h-full flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-green-50/50 to-transparent dark:from-brand-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]"></div>
                    <div className="relative rounded-[1.5rem] overflow-hidden mb-5 aspect-[4/5] bg-gray-50 dark:bg-gray-900">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-brand-green-600 dark:text-brand-green-400 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg uppercase tracking-wide">
                        Hot
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="w-full bg-brand-green-600 text-white text-center py-3 rounded-xl font-bold shadow-lg hover:bg-brand-green-700">
                          Quick View
                        </div>
                      </div>
                    </div>
                    <div className="px-2 flex-1 flex flex-col justify-between relative z-10">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 dark:text-gray-400">{product.category}</span>
                          <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md">
                            <Star className="h-3 w-3 text-amber-500 fill-current mr-1" />
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{product.rating}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3 group-hover:text-brand-green-600 dark:group-hover:text-brand-green-400 transition-colors line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-2xl font-black text-brand-green-600 dark:text-brand-green-400">₹{product.price}</span>
                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-brand-green-50 dark:group-hover:bg-brand-green-900/50 transition-colors">
                          <ShoppingBag className="h-5 w-5 text-gray-400 dark:text-gray-400 group-hover:text-brand-green-600 dark:group-hover:text-brand-green-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Story Section - Masonry & Stats */}
      <section className="py-20 md:py-32 bg-gray-900 dark:bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: "url('/images/products/product-1.webp')" }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 rounded-full bg-brand-green-400 animate-pulse"></span>
                <span className="text-sm font-bold tracking-widest uppercase">The Heritage</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight tracking-tight">
                Authentic recipes <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green-400 to-emerald-200">passed down</span> <br/>
                generations.
              </h2>
              <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-xl font-light">
                We believe that the best flavors come from home kitchens. Every product is carefully handcrafted using traditional methods to preserve the true taste of India.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-4xl font-black text-white mb-2">50+</h4>
                  <p className="text-brand-green-400 font-medium">Homemade Products</p>
                </div>
                <div>
                  <h4 className="text-4xl font-black text-white mb-2">10k+</h4>
                  <p className="text-brand-green-400 font-medium">Happy Customers</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:gap-6 relative">
              <div className="space-y-4 md:space-y-6 mt-12 md:mt-24">
                <div className="rounded-[2rem] overflow-hidden aspect-square shadow-2xl transform transition duration-500 hover:scale-105 hover:-rotate-2 hover:shadow-[0_0_30px_rgba(5,150,105,0.3)]">
                  <img src="/images/products/product-2.webp" alt="Pickle Making" className="w-full h-full object-cover" />
                </div>
                <div className="bg-brand-green-800/80 backdrop-blur-md rounded-[2rem] p-6 shadow-2xl aspect-square flex flex-col justify-center items-center text-center transform transition duration-500 hover:scale-105 hover:bg-brand-green-700/80">
                  <Leaf className="w-12 h-12 text-brand-green-300 mb-4" />
                  <h4 className="text-xl font-bold mb-2">100% Natural</h4>
                  <p className="text-brand-green-100 text-sm">No preservatives, just pure ingredients.</p>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div className="bg-emerald-900/80 backdrop-blur-md rounded-[2rem] p-6 shadow-2xl aspect-square flex flex-col justify-center items-center text-center transform transition duration-500 hover:scale-105 hover:bg-emerald-800/80">
                  <Heart className="w-12 h-12 text-emerald-300 mb-4" />
                  <h4 className="text-xl font-bold mb-2">Made with Love</h4>
                  <p className="text-emerald-100 text-sm">Crafted by passionate home chefs.</p>
                </div>
                <div className="rounded-[2rem] overflow-hidden aspect-square shadow-2xl transform transition duration-500 hover:scale-105 hover:rotate-2 hover:shadow-[0_0_30px_rgba(5,150,105,0.3)]">
                  <img src="/images/products/product-4.webp" alt="Spices" className="w-full h-full object-cover" />
                </div>
              </div>
              
              {/* Decorative circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-green-500 rounded-full mix-blend-screen filter blur-[50px] opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Floating Cards */}
      <section className="py-20 md:py-32 relative bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              Voices of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green-500 to-emerald-400">Delight</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100 dark:border-gray-700 relative">
                <Quote className="absolute top-6 right-8 h-16 w-16 text-brand-green-100 dark:text-brand-green-900/30 -z-0 transform -rotate-12" />
                <div className="relative z-10">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl mb-8 leading-relaxed italic font-medium">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-5 mt-auto">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-gray-50 dark:border-gray-700 shadow-md"
                    />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</p>
                      <p className="text-brand-green-600 dark:text-brand-green-400 text-sm font-semibold">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Modern Gradient */}
      <section className="py-24 relative overflow-hidden m-4 sm:m-8 lg:m-12 rounded-[3rem] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green-900 via-brand-green-800 to-emerald-900 z-0"></div>
        <div className="absolute inset-0 mix-blend-overlay opacity-20 bg-cover bg-center z-0" style={{ backgroundImage: "url('/images/products/product-5.webp')" }}></div>
        
        {/* Dynamic blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green-500/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/30 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-2 mb-8 shadow-xl">
            <Sparkles className="h-5 w-5 mr-2 text-brand-green-300" />
            <span className="text-white font-semibold tracking-wide uppercase text-sm">Exclusive Offers</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight drop-shadow-md">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green-300 to-white">Family</span>
          </h2>
          <p className="text-lg md:text-2xl mb-12 text-brand-green-50/90 max-w-2xl mx-auto font-light leading-relaxed">
            Subscribe to receive exclusive deals, new product drops, and authentic recipes directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-8 py-5 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-brand-green-400 text-lg font-medium shadow-2xl transition-shadow bg-white/95 backdrop-blur-sm"
            />
            <button className="bg-brand-green-500 hover:bg-brand-green-400 text-white px-10 py-5 rounded-full text-lg font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-1">
              Subscribe
            </button>
          </div>
          <p className="text-brand-green-200 mt-8 font-medium">
            Join 50,000+ happy customers. You can unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
