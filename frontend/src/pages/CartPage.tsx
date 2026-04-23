import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, Tag, Truck, Shield, Gift, X } from 'lucide-react';
import { toast } from 'react-toastify';

const CartPage: React.FC = () => {
  const { cart, loading, fetchCart, updateCartItem, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(itemId, newQuantity);
      toast.success('Cart updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        toast.success('Cart cleared');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to clear cart');
      }
    }
  };

  // Clear cart button in the UI
  const ClearCartButton = () => (
    <button
      onClick={handleClearCart}
      className="flex items-center text-brand-red-500 hover:text-brand-red-600 font-medium transition-colors"
    >
      <X className="h-4 w-4 mr-1" />
      Clear Cart
    </button>
  );

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'mukhwas10') {
      setDiscount(cart?.totalAmount ? cart.totalAmount * 0.1 : 0);
      toast.success('10% discount applied!');
    } else {
      toast.error('Invalid promo code');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-green-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <ShoppingCart className="h-16 w-16 text-brand-green-500 mx-auto mb-4" />
          <p className="text-brand-green-700 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12">
            <div className="w-32 h-32 bg-brand-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingCart className="h-16 w-16 text-brand-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
              Looks like you haven't added any delicious mukhwas to your cart yet.
            </p>
            <Link 
              to="/products" 
              className="inline-flex items-center bg-brand-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-green-700 transition-all transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const finalTotal = cart.totalAmount - discount;

  return (
    <div className="min-h-screen bg-brand-green-50">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-brand-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-brand-green-600">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-brand-green-600 font-medium">Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">YOUR CART</h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Review your items and proceed to checkout</p>
          </div>
          <ClearCartButton />
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-brand-green-100 overflow-hidden">
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {cart.items.map((item, index) => (
                  <div 
                    key={item._id} 
                    className={`flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6 pb-4 md:pb-6 ${index !== cart.items.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    {/* Product Image & Remove Button */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-lg md:rounded-xl bg-gray-100 dark:bg-gray-700"
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
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-brand-red-500 text-white rounded-full flex items-center justify-center hover:bg-brand-red-600 transition-colors shadow-md"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product._id}`}
                        className="text-base md:text-lg font-semibold text-gray-900 dark:text-white hover:text-brand-green-600 transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-0.5 md:mt-1">Size: {item.product.weight || '200g'}</p>
                      <p className="text-gray-400 text-xs mt-0.5">Stock: {item.product.stock} available</p>
                      <p className="text-brand-green-600 font-bold text-base md:text-lg mt-1 md:mt-2">₹{item.price}</p>
                    </div>

                    {/* Quantity Controls & Total */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-2">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg md:rounded-xl overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-2.5 md:py-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="w-10 md:w-12 text-center font-semibold text-gray-900 dark:text-white text-sm md:text-base">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-3 py-2.5 md:py-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white text-base md:text-lg">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="mt-4 md:mt-6 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-brand-green-100 p-4 md:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <Tag className="h-4 w-4 md:h-5 md:w-5 text-brand-green-600" />
                <span className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Promo Code</span>
              </div>
              <div className="flex gap-2 md:gap-3">
                <input
                  type="text"
                  placeholder="Enter promo code (try: MUKHWAS10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 md:px-4 py-2.5 md:py-3 border border-gray-200 dark:border-gray-700 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green-500 focus:border-transparent text-sm md:text-base"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-4 md:px-6 py-2.5 md:py-3 bg-gray-900 text-white rounded-lg md:rounded-xl font-medium text-sm md:text-base hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-brand-green-100 p-4 md:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Order Summary</h2>
              
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  <span>Subtotal ({cart.items.reduce((total, item) => total + item.quantity, 0)} items)</span>
                  <span className="font-medium">₹{cart.totalAmount.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-brand-red-600 text-sm md:text-base">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  <span className="flex items-center gap-1.5 md:gap-2">
                    <Truck className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    Shipping
                  </span>
                  <span className="text-brand-green-600 font-medium">Free</span>
                </div>
                
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  <span className="flex items-center gap-1.5 md:gap-2">
                    <Shield className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    Tax
                  </span>
                  <span>₹0.00</span>
                </div>

                <div className="border-t-2 border-gray-100 pt-3 md:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl md:text-2xl font-bold text-brand-green-600">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-brand-green-600 text-white py-3.5 md:py-4 rounded-lg md:rounded-xl font-semibold text-base md:text-lg hover:bg-brand-green-700 transition-all transform active:scale-95 md:hover:scale-[1.02] shadow-lg shadow-brand-green-200 mb-3 md:mb-4 flex items-center justify-center gap-2"
              >
                Go to Checkout
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 rotate-180" />
              </button>

              <Link
                to="/products"
                className="w-full block text-center py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg md:rounded-xl font-medium text-sm md:text-base hover:border-brand-green-400 hover:text-brand-green-600 transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-4 md:gap-6 text-gray-400">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Shield className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="text-xs">Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Truck className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="text-xs">Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Gift className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="text-xs">Best Quality</span>
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

export default CartPage;
