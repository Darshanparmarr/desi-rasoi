import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ChevronRight,
  Tag,
  Truck,
  ShieldCheck,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUrl';

const FALLBACKS = [
  '/images/products/product-1.webp',
  '/images/products/product-2.webp',
  '/images/products/product-3.webp',
  '/images/products/product-4.webp',
];

const CartPage: React.FC = () => {
  const { cart, loading, fetchCart, updateCartItem, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Clear your entire cart?')) {
      try {
        await clearCart();
        toast.success('Cart cleared');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to clear cart');
      }
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'akshar10') {
      setDiscount(cart?.totalAmount ? cart.totalAmount * 0.1 : 0);
      toast.success('10% discount applied');
    } else {
      toast.error('Invalid promo code');
    }
  };

  if (loading) {
    return (
      <div className="container-page py-20 text-center">
        <ShoppingCart className="h-12 w-12 mx-auto text-primary-600 animate-pulse" />
        <p className="mt-3 text-slate-600 dark:text-slate-300">Loading your cart…</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-page py-16">
        <div className="card p-10 sm:p-14 text-center max-w-2xl mx-auto">
          <div className="mx-auto h-20 w-20 rounded-full bg-secondary-50 text-secondary-600 flex items-center justify-center">
            <ShoppingCart className="h-10 w-10" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-slate-900 dark:text-white">Your cart is empty</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Looks like you haven't added anything yet. Browse our handmade collection — every batch is fresh.
          </p>
          <Link to="/products" className="btn-secondary btn-lg mt-8">
            Start shopping <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.totalAmount;
  const shipping = subtotal >= 500 ? 0 : 49;
  const finalTotal = Math.max(0, subtotal - discount + shipping);

  return (
    <div className="container-page py-6 sm:py-10 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-primary-700 dark:hover:text-secondary-400">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-700 dark:text-slate-200">Cart</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="eyebrow">Your bag</span>
          <h1 className="heading-section mt-1">Cart</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} ready to ship
          </p>
        </div>
        <button
          onClick={handleClearCart}
          className="text-sm font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1.5"
        >
          <Trash2 className="h-4 w-4" />
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_24rem] gap-6 lg:gap-10">
        {/* Items */}
        <div className="space-y-4">
          <div className="card divide-y divide-slate-100 dark:divide-slate-800">
            {cart.items.map((item) => (
              <div key={item._id} className="p-4 sm:p-5 flex gap-4 sm:gap-6">
                <Link to={`/product/${item.product._id}`} className="shrink-0">
                  <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-2xl overflow-hidden bg-stone-100 dark:bg-slate-800">
                    <img
                      src={getImageUrl(item.product.image) || item.product.image}
                      alt={item.product.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product._id}`} className="block">
                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 hover:text-primary-700 dark:hover:text-secondary-400 transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Size: {item.product.weight || '—'}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-full bg-stone-100 dark:bg-slate-800 p-1">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 rounded-full inline-flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-slate-800 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="h-8 w-8 rounded-full inline-flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-bold text-primary-900 dark:text-white">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">₹{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveItem(item._id)}
                  aria-label="Remove"
                  className="self-start text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Promo */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-secondary-600" />
              <span className="font-semibold text-slate-900 dark:text-white">Have a promo code?</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Try AKSHAR10"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="input-field flex-1"
              />
              <button onClick={handleApplyPromo} className="btn-primary btn-md whitespace-nowrap">
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="card p-5 sm:p-6 space-y-5">
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Order summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal ({cart.items.reduce((t, i) => t + i.quantity, 0)} items)</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-medium">−₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5"><Truck className="h-4 w-4" /> Shipping</span>
                <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : ''}`}>
                  {shipping === 0 ? 'Free' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Tax</span>
                <span className="font-medium">Included</span>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                <span className="font-semibold text-slate-900 dark:text-white">Total</span>
                <span className="font-display text-2xl font-bold text-primary-900 dark:text-white">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn-secondary btn-lg w-full justify-center">
              Continue to checkout <ArrowRight className="h-5 w-5" />
            </button>
            <Link to="/products" className="block text-center text-sm font-semibold text-primary-700 dark:text-secondary-400 hover:underline">
              Continue shopping
            </Link>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-primary-600" />
                <span>Secure</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-4 w-4 text-primary-600" />
                <span>Fast delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Gift className="h-4 w-4 text-primary-600" />
                <span>Best quality</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
