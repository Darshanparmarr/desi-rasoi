import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { Star, ShoppingCart, ArrowLeft, Heart, Building2, Minus, Plus } from 'lucide-react';
import SocialShareButtons from '../components/SocialShareButtons';
import RecentlyViewedProducts from '../components/RecentlyViewedProducts';
import CompareButton from '../components/CompareButton';
import { toast } from 'react-toastify';
import { Product } from '../types';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
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
        setSelectedImage(0);
        // Add to recently viewed
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
    if (product) {
      setIsWishlisted(isInWishlist(product._id));
    }
  }, [product, isInWishlist]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart(product._id, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
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
        const wishlistItem = wishlist?.items?.find((item: any) => item.product._id === product._id);
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem._id);
          toast.success('Removed from wishlist');
        }
      } else {
        await addToWishlist(product._id);
        toast.success('Added to wishlist!');
      }
      setIsWishlisted(!isWishlisted);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded w-full max-w-2xl"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h2>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-4 md:mb-6 transition-colors text-sm md:text-base"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </button>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-3 md:mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md"
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
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[product.image].map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden transition-colors ${
                    selectedImage === index
                      ? 'border-primary-600'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
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
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-3 md:mb-4">
              <span className="inline-block bg-primary-100 text-primary-800 text-xs md:text-sm px-2.5 md:px-3 py-1 rounded-full mb-2">
                {product.category}
              </span>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-3 md:mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 md:h-5 md:w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-gold-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400 ml-2 text-sm md:text-base">
                  {product.rating} ({product.numReviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline mb-4 md:mb-6">
                <span className="text-2xl md:text-3xl font-bold text-primary-600">₹{product.price}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm md:text-base">per {product.weight}</span>
              </div>

              {/* Stock Status */}
              <div className="mb-4 md:mb-6">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium text-sm md:text-base">
                    {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left in stock`}
                  </span>
                ) : (
                  <span className="text-red-600 font-medium text-sm md:text-base">Out of Stock</span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">{product.description}</p>

              {/* Ingredients */}
              <div className="mb-4 md:mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm md:text-base">Ingredients:</h3>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity:
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg w-fit">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-4 py-3 md:py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-14 md:w-16 text-center border-0 focus:ring-0 text-base"
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="px-4 py-3 md:py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center py-3 md:py-2"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                  <button 
                    onClick={handleWishlistToggle}
                    className={`flex-1 btn-outline flex items-center justify-center transition-colors py-3 md:py-2 text-sm md:text-base ${
                      isWishlisted ? 'text-red-500 border-red-500 hover:bg-red-50' : ''
                    }`}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                    {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                  {product && (
                    <SocialShareButtons
                      title={`Check out ${product.name} on Mukhwas!`}
                      description={`${product.description.substring(0, 100)}...`}
                      variant="compact"
                      className="btn-outline px-4 py-3 md:py-2"
                    />
                  )}
                </div>
                
                {/* Compare Button */}
                {product && <CompareButton product={product} />}
                
                {/* Bulk Order Link */}
                {product && (
                  <Link
                    to={`/wholesale?product=${product._id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 border-2 border-green-200 text-green-700 dark:text-green-300 rounded-lg font-medium text-sm md:text-base hover:bg-green-50 dark:bg-green-900/20 transition-colors"
                  >
                    <Building2 className="w-5 h-5" />
                    Need this in bulk? Get wholesale pricing
                  </Link>
                )}
              </div>
            </div>

            {/* Product Features */}
            <div className="border-t pt-4 md:pt-6 mt-6 md:mt-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 md:mb-4 text-sm md:text-base">Product Features:</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  100% Natural Ingredients
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Traditional Recipe
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  No Preservatives
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Helps in Digestion
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Fresh Breath Guaranteed
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Recently Viewed Products */}
        <RecentlyViewedProducts />
      </div>
    </div>
  );
};

export default ProductDetailPage;
