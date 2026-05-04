import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import {
  Star,
  ShoppingCart,
  ChevronRight,
  Heart,
  Building2,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  Leaf,
  RefreshCw,
} from 'lucide-react';
import SocialShareButtons from '../components/SocialShareButtons';
import RecentlyViewedProducts from '../components/RecentlyViewedProducts';
import CompareButton from '../components/CompareButton';
import { toast } from 'react-toastify';
import { Product } from '../types';
import { getImageUrl } from '../utils/imageUrl';

const FALLBACKS = [
  '/images/products/product-1.webp',
  '/images/products/product-2.webp',
  '/images/products/product-3.webp',
  '/images/products/product-4.webp',
  '/images/products/product-5.webp',
  '/images/products/product-6.webp',
];

const FEATURES = [
  '100% natural ingredients',
  'Traditional family recipe',
  'No preservatives or colours',
  'Aids digestion',
  'Freshly packed in small batches',
];

const TRUST_ROW = [
  { icon: Truck, label: 'Free shipping over ₹500' },
  { icon: ShieldCheck, label: '100% authentic & safe' },
  { icon: Leaf, label: 'No preservatives' },
  { icon: RefreshCw, label: '7-day easy returns' },
];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Product>(`/products/${id}`);
        setProduct(data);
        setActiveImageIdx(0);
        addToRecentlyViewed(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
      fetchWishlist();
    }
  }, [id, navigate, fetchWishlist, addToRecentlyViewed]);

  useEffect(() => {
    if (product) setIsWishlisted(isInWishlist(product._id));
  }, [product, isInWishlist]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product._id, quantity);
      toast.success(`${product.name} added to cart`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stock) setQuantity(newQuantity);
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    if (!user) {
      toast.info('Please login to add items to wishlist');
      navigate('/login');
      return;
    }
    try {
      if (isWishlisted) {
        const item = wishlist?.items?.find((i: any) => i.product._id === product._id);
        if (item) {
          await removeFromWishlist(item._id);
          toast.success('Removed from wishlist');
        }
      } else {
        await addToWishlist(product._id);
        toast.success('Added to wishlist');
      }
      setIsWishlisted(!isWishlisted);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="container-page py-12">
        <div className="grid lg:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-4">
            <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h2 className="font-display text-2xl font-bold">Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn-primary btn-md mt-4">Back to products</button>
      </div>
    );
  }

  const images = [product.image];

  return (
    <div className="container-page py-6 sm:py-10 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex-wrap">
        <Link to="/" className="hover:text-primary-700 dark:hover:text-secondary-400">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/products" className="hover:text-primary-700 dark:hover:text-secondary-400">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary-700 dark:hover:text-secondary-400">
          {product.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-700 dark:text-slate-200 truncate max-w-[40vw] sm:max-w-none">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-3xl bg-stone-100 dark:bg-slate-900 shadow-card">
            <img
              src={getImageUrl(images[activeImageIdx]) || images[activeImageIdx]}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
              }}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIdx(index)}
                  className={`aspect-square overflow-hidden rounded-xl border-2 transition-colors ${
                    activeImageIdx === index ? 'border-secondary-500' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <img src={getImageUrl(image) || image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust row */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TRUST_ROW.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-stone-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <Icon className="h-4 w-4 text-secondary-600" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <span className="chip-orange">{product.category}</span>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} />
                ))}
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{product.rating}</span>
              <span className="text-slate-500 dark:text-slate-400">({product.numReviews} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="rounded-2xl bg-gradient-to-r from-secondary-50 to-stone-50 dark:from-secondary-900/20 dark:to-slate-900 p-5 border border-secondary-100 dark:border-secondary-900/40">
            <div className="flex items-end gap-2">
              <span className="font-display text-4xl font-bold text-primary-900 dark:text-white">₹{product.price}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">per {product.weight}</span>
            </div>
            <div className="mt-2">
              {product.stock > 0 ? (
                <span className={`chip ${product.stock < 10 ? 'chip-orange' : 'chip-green'}`}>
                  {product.stock < 10 ? `Only ${product.stock} left` : 'In stock'}
                </span>
              ) : (
                <span className="chip-red">Out of stock</span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{product.description}</p>

          {/* Ingredients */}
          {product.ingredients?.length > 0 && (
            <div>
              <p className="eyebrow mb-2">Ingredients</p>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, idx) => (
                  <span key={idx} className="chip">{ing}</span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + CTA */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Quantity</span>
              <div className="inline-flex items-center rounded-full bg-stone-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="h-9 w-9 rounded-full inline-flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-semibold text-slate-800 dark:text-white">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="h-9 w-9 rounded-full inline-flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-secondary btn-lg flex-1 justify-center disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
              >
                <ShoppingCart className="h-5 w-5" />
                {product.stock === 0 ? 'Sold out' : 'Add to cart'}
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`btn-md justify-center inline-flex items-center gap-2 rounded-full border-2 transition-colors ${
                  isWishlisted
                    ? 'bg-secondary-50 border-secondary-200 text-secondary-700'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Secondary actions */}
          <div className="flex flex-wrap items-center gap-3">
            <SocialShareButtons
              title={`Check out ${product.name} on Akshar E-Commerce!`}
              description={`${product.description.substring(0, 100)}...`}
              variant="compact"
            />
            <CompareButton product={product} />
          </div>

          {/* Bulk order */}
          <Link
            to={`/wholesale?product=${product._id}`}
            className="flex items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-900/50 text-primary-800 dark:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
          >
            <span className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary-600 dark:text-secondary-400" />
              <span className="text-sm font-semibold">Need this in bulk? Get wholesale pricing.</span>
            </span>
            <ChevronRight className="h-5 w-5" />
          </Link>

          {/* Features */}
          <div className="card p-5">
            <p className="eyebrow mb-3">Why you'll love it</p>
            <ul className="grid sm:grid-cols-2 gap-2.5">
              {FEATURES.map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">✓</span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <RecentlyViewedProducts />
    </div>
  );
};

export default ProductDetailPage;
