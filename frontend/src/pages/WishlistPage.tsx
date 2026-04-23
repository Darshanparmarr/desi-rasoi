import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Package } from 'lucide-react';
import { toast } from 'react-toastify';

const WishlistPage: React.FC = () => {
  const { wishlist, fetchWishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [user, navigate, fetchWishlist]);

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      await removeFromWishlist(itemId);
      toast.success('Removed from wishlist');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (productId: string, name: string) => {
    try {
      await addToCart(productId, 1);
      toast.success(`${name} added to cart!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading && !wishlist) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded w-full max-w-2xl"></div>
        </div>
      </div>
    );
  }

  const wishlistItems = wishlist?.items || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Heart className="h-8 w-8 mr-3 text-red-500 fill-current" />
              My Wishlist
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Save your favorite products to your wishlist and come back to them anytime.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Package className="h-5 w-5 mr-2" />
              Browse Products
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="relative">
                  <Link to={`/product/${item.product._id}`}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                  </Link>
                  {item.product.stock < 10 && item.product.stock > 0 && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      Low Stock
                    </span>
                  )}
                  {item.product.stock === 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Out of Stock
                    </span>
                  )}
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="absolute top-2 left-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/product/${item.product._id}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {item.product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-primary-600">
                      ₹{item.product.price}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {item.product.category}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item.product._id, item.product.name)}
                    disabled={item.product.stock === 0}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {item.product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
