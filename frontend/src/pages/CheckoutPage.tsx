import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ChevronRight, Truck, ShieldCheck, CreditCard, User, Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUrl';

interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

const FALLBACKS = [
  '/images/products/product-1.webp',
  '/images/products/product-2.webp',
  '/images/products/product-3.webp',
  '/images/products/product-4.webp',
];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isGuest, setIsGuest] = useState(!user);

  useEffect(() => {
    if (!cart || cart.items.length === 0) navigate('/cart');
  }, [cart, navigate]);

  useEffect(() => {
    setIsGuest(!user);
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ['name', 'email', 'address', 'city', 'state', 'pincode', 'phone'] as const;
    for (const f of required) {
      if (!shippingAddress[f].trim()) {
        toast.error('Please fill in all required fields');
        return false;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(shippingAddress.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !cart) return;
    setLoading(true);
    try {
      const orderData: any = {
        orderItems: cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: cart.totalAmount,
        shippingPrice: 0,
        totalPrice: cart.totalAmount,
      };
      if (isGuest || !user) {
        orderData.isGuest = true;
        orderData.guestEmail = shippingAddress.email;
      }
      const { data } = await api.post('/orders', orderData);
      toast.success('Order placed successfully');
      await clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) return null;

  return (
    <div className="container-page py-6 sm:py-10 space-y-6">
      <nav className="flex items-center gap-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-primary-700 dark:hover:text-secondary-400">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/cart" className="hover:text-primary-700 dark:hover:text-secondary-400">Cart</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-700 dark:text-slate-200">Checkout</span>
      </nav>

      <div>
        <span className="eyebrow">Almost there</span>
        <h1 className="heading-section mt-1">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_24rem] gap-6 lg:gap-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!user && (
            <div className="rounded-2xl bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-900/40 p-4 flex items-start gap-3">
              <User className="h-5 w-5 text-secondary-600 mt-0.5" />
              <p className="text-sm text-secondary-900 dark:text-secondary-100">
                You're checking out as a <strong>guest</strong>.{' '}
                <Link to="/login" className="underline font-semibold">Login</Link> for faster checkout and order tracking.
              </p>
            </div>
          )}

          {/* Shipping */}
          <section className="card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <Truck className="h-5 w-5 text-primary-600" />
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Shipping address</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Full name</label>
                <input type="text" name="name" value={shippingAddress.name} onChange={handleInputChange} className="input-field" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={shippingAddress.email}
                    onChange={handleInputChange}
                    placeholder="you@email.com"
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Street address</label>
                <input type="text" name="address" value={shippingAddress.address} onChange={handleInputChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">City</label>
                <input type="text" name="city" value={shippingAddress.city} onChange={handleInputChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">State</label>
                <input type="text" name="state" value={shippingAddress.state} onChange={handleInputChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Pincode</label>
                <input type="text" name="pincode" value={shippingAddress.pincode} onChange={handleInputChange} className="input-field" maxLength={6} required />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Phone</label>
                <input type="tel" name="phone" value={shippingAddress.phone} onChange={handleInputChange} className="input-field" maxLength={10} required />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="h-5 w-5 text-primary-600" />
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Payment method</h2>
            </div>
            <div className="space-y-3">
              <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                paymentMethod === 'COD'
                  ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Cash on delivery</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pay when you receive your order.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed">
                <input type="radio" disabled className="mt-1" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Online payment</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Card / UPI · coming soon.</p>
                </div>
              </label>
            </div>
          </section>

          <button type="submit" disabled={loading} className="btn-secondary btn-lg w-full justify-center">
            <Lock className="h-4 w-4" />
            {loading ? 'Placing order…' : isGuest ? 'Place order as guest' : 'Place order'}
          </button>

          {isGuest && (
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              You can track your order with your order ID + email on the{' '}
              <Link to="/order-lookup" className="text-primary-700 dark:text-secondary-400 underline">
                order lookup page
              </Link>
              .
            </p>
          )}
        </form>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="card p-5 sm:p-6 space-y-5">
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Your order</h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-stone-100 dark:bg-slate-800">
                    <img
                      src={getImageUrl(item.product.image) || item.product.image}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
                      }}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-primary-700 text-white text-[10px] font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.product.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.product.weight}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <span className="font-medium">₹{cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Shipping</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">Total</span>
                <span className="font-display text-2xl font-bold text-primary-900 dark:text-white">
                  ₹{cart.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Secure & encrypted checkout
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
