import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  ShoppingBag,
  Star,
  ArrowRight,
  Leaf,
  Sparkles,
  Heart,
  Quote,
  ShieldCheck,
  Truck,
  Award,
} from 'lucide-react';
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

const TRUST_BADGES = [
  { icon: ShieldCheck, title: 'Premium Quality', sub: '100% authentic' },
  { icon: Heart, title: 'Homemade', sub: 'Made with love' },
  { icon: Truck, title: 'Fast Delivery', sub: 'Across India' },
  { icon: Award, title: 'Small Batches', sub: 'Always fresh' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    text: 'The authentic taste reminds me of my grandmother. Truly the best mukhwas I have ever tasted!',
    image: '/images/products/product-1.webp',
  },
  {
    name: 'Rajesh Patel',
    location: 'Ahmedabad',
    text: 'Perfect after-meal treat. The quality is exceptional and the aroma is divine.',
    image: '/images/products/product-2.webp',
  },
  {
    name: 'Anita Gupta',
    location: 'Delhi',
    text: 'I serve this at all my dinner parties. Guests always ask where I get it from!',
    image: '/images/products/product-3.webp',
  },
];

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-hero-radial" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[80vh] bg-gradient-to-b from-primary-50/80 to-transparent dark:from-primary-900/20" />

        <div className="container-page pt-12 sm:pt-16 lg:pt-24 pb-12 lg:pb-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 max-w-2xl">
              <span className="eyebrow inline-flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Handcrafted with heritage
              </span>
              <h1 className="heading-display">
                Taste the <span className="gradient-text">soul of India</span>,
                made fresh at home.
              </h1>
              <p className="body-text">
                Authentic homemade papads, pickles, masalas and mukhwas — crafted in small batches by home kitchens
                across India and delivered fresh to your door.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/products" className="btn-secondary btn-lg">
                  <ShoppingBag className="h-5 w-5" />
                  Shop the collection
                </Link>
                <Link to="/categories" className="btn-outline btn-lg">
                  Explore categories
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-3 max-w-md pt-6 sm:pt-8 divide-x divide-slate-200 dark:divide-slate-800">
                <div className="pr-4">
                  <p className="font-display text-2xl font-bold text-primary-900 dark:text-white">10k+</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Happy customers</p>
                </div>
                <div className="px-4">
                  <p className="font-display text-2xl font-bold text-primary-900 dark:text-white">50+</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Homemade items</p>
                </div>
                <div className="pl-4">
                  <p className="font-display text-2xl font-bold text-primary-900 dark:text-white">4.9★</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Avg. rating</p>
                </div>
              </div>
            </div>

            {/* Hero collage */}
            <div className="lg:col-span-5 relative">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-3 sm:space-y-4 pt-8">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-card-hover">
                    <img src="/images/products/product-1.webp" alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="aspect-square rounded-3xl bg-gradient-to-br from-secondary-500 to-secondary-700 text-white p-5 flex flex-col justify-between shadow-glow-orange">
                    <Leaf className="h-7 w-7" />
                    <div>
                      <p className="font-display text-2xl font-bold leading-tight">100% Natural</p>
                      <p className="text-sm text-secondary-50/90">No preservatives. Just love.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary-700 to-primary-900 text-white p-5 flex flex-col justify-between shadow-glow-navy">
                    <Sparkles className="h-7 w-7 text-secondary-300" />
                    <div>
                      <p className="font-display text-2xl font-bold leading-tight">Heritage recipes</p>
                      <p className="text-sm text-primary-50/90">Passed down generations.</p>
                    </div>
                  </div>
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-card-hover">
                    <img src="/images/products/product-3.webp" alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 -z-10 h-32 w-32 rounded-full bg-secondary-200 blur-3xl opacity-60" />
              <div className="absolute -bottom-6 -left-6 -z-10 h-32 w-32 rounded-full bg-primary-200 blur-3xl opacity-50" />
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {TRUST_BADGES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-300 shrink-0">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">{title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container-page">
          <div className="flex items-end justify-between gap-6 mb-8 sm:mb-12">
            <div>
              <span className="eyebrow">Shop by category</span>
              <h2 className="heading-section mt-2">Curated, by craft</h2>
            </div>
            <Link to="/categories" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-secondary-400 hover:gap-3 transition-all">
              Browse all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl animate-pulse bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {(categories.length ? categories : []).slice(0, 6).map((category, index) => {
                const imgSrc = getImageUrl(category.image) || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                return (
                  <Link
                    key={category._id}
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-all"
                  >
                    <img
                      src={imgSrc}
                      alt={category.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                      }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-900/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="font-display text-lg font-bold text-white">{category.name}</h3>
                      <p className="text-xs text-white/70 mt-0.5 inline-flex items-center gap-1">
                        Shop now <ArrowRight className="h-3 w-3" />
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="section surface-muted">
        <div className="container-page">
          <div className="flex items-end justify-between gap-6 mb-8 sm:mb-12">
            <div>
              <span className="eyebrow">Top-rated picks</span>
              <h2 className="heading-section mt-2">Bestsellers this week</h2>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-secondary-400 hover:gap-3 transition-all">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-4">
                  <div className="aspect-square rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="card card-hover group p-3 sm:p-4 flex flex-col">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100 dark:bg-slate-800">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
                      }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute top-3 left-3 chip-orange">Hot</span>
                  </div>
                  <div className="pt-4 flex-1 flex flex-col">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{product.category}</p>
                    <h3 className="mt-1 font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary-700 dark:group-hover:text-secondary-400 transition-colors">
                      {product.name}
                    </h3>
                    <div className="mt-3 flex items-center gap-1 text-amber-500 text-sm">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="font-semibold">{product.rating}</span>
                      <span className="text-slate-400 text-xs">({product.numReviews})</span>
                    </div>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="font-display text-xl font-bold text-primary-900 dark:text-white">₹{product.price}</span>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary-50 text-secondary-600 group-hover:bg-secondary-600 group-hover:text-white transition-colors dark:bg-secondary-900/30 dark:text-secondary-300">
                        <ShoppingBag className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand story */}
      <section className="section">
        <div className="container-page">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-card">
                  <img src="/images/products/product-2.webp" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="aspect-square rounded-3xl bg-primary-900 text-white p-6 flex flex-col justify-between">
                  <Heart className="h-7 w-7 text-secondary-400" />
                  <div>
                    <p className="font-display text-xl font-bold">Made with love</p>
                    <p className="text-sm text-primary-100/80">By passionate home chefs.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 pt-8">
                <div className="aspect-square rounded-3xl bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300 p-6 flex flex-col justify-between border border-secondary-100 dark:border-secondary-900/40">
                  <Leaf className="h-7 w-7" />
                  <div>
                    <p className="font-display text-xl font-bold">Pure ingredients</p>
                    <p className="text-sm opacity-80">Sourced from trusted farms.</p>
                  </div>
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden shadow-card">
                  <img src="/images/products/product-4.webp" alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <span className="eyebrow">The Akshar story</span>
              <h2 className="heading-section">
                Recipes from real kitchens, <br className="hidden lg:block" />
                <span className="text-secondary-600">honoured by craft.</span>
              </h2>
              <p className="body-text">
                Akshar E-Commerce partners with home kitchens across India to bring you the exact taste of festive
                afternoons and grandmother's pantry. Every batch is small. Every ingredient is local. Every box ships
                with care.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="chip-navy">Family recipes</span>
                <span className="chip-orange">Small batches</span>
                <span className="chip-green">No preservatives</span>
                <span className="chip">India-wide shipping</span>
              </div>
              <div>
                <Link to="/products" className="btn-primary btn-md">
                  Start tasting
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section surface-muted">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="eyebrow">From our community</span>
            <h2 className="heading-section mt-2">Loved across India</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map((t) => (
              <article key={t.name} className="card p-6 sm:p-8 relative overflow-hidden">
                <Quote className="absolute -top-2 -right-2 h-20 w-20 text-secondary-100 dark:text-secondary-900/40 -rotate-12" aria-hidden />
                <div className="relative">
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">"{t.text}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <img src={t.image} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-900" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{t.name}</p>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400">{t.location}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RecentlyViewedProducts />
    </div>
  );
};

export default HomePage;
