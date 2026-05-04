import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingCart, Search, Filter, Heart, Building2, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';
import { toast } from 'react-toastify';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  numReviews: number;
  stock: number;
  weight: string;
}

interface ProductsResponse {
  products: Product[];
  page: number;
  pages: number;
}

interface Category {
  _id: string;
  name: string;
}

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { wishlist, addToWishlist, removeFromWishlist, fetchWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get<Category[]>('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        // Backend reads pageNumber, not page
        params.append('pageNumber', page.toString());

        if (searchQuery) params.append('keyword', searchQuery);
        if (selectedCategory) params.append('category', selectedCategory);

        const { data } = await api.get<ProductsResponse>(`/products?${params}`);
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    if (user) {
      fetchWishlist();
    }
  }, [page, searchQuery, selectedCategory, user, fetchWishlist]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    if (searchQuery) params.append('keyword', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    setSearchParams(params);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    const params = new URLSearchParams();
    if (searchQuery) params.append('keyword', searchQuery);
    if (category) params.append('category', category);
    setSearchParams(params);
  };

  const addToCart = async (productId: string) => {
    try {
      await api.post('/cart/add', { productId, quantity: 1 });
      toast.success('Added to cart successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      toast.info('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist(product._id)) {
        const wishlistItem = wishlist?.items?.find(item => item.product._id === product._id);
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem._id);
          toast.success('Removed from wishlist');
        }
      } else {
        await addToWishlist(product._id);
        toast.success('Added to wishlist!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wholesale Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm md:text-lg">Planning a Wedding, Event, or Need Retail Stock?</h3>
                <p className="text-green-100 text-xs md:text-sm">Get up to 40% off on bulk orders</p>
              </div>
            </div>
            <Link
              to="/wholesale"
              className="px-4 md:px-6 py-2.5 md:py-3 bg-white dark:bg-gray-800 text-green-700 dark:text-green-300 rounded-lg md:rounded-xl font-semibold text-sm md:text-base hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto"
            >
              Get Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">All Products</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for papad, aachar, masala, snacks..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center justify-center py-3 md:py-2"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-lg shadow-md mb-4 md:mb-6 border border-transparent dark:border-gray-700 transition-colors">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 md:mb-3 text-sm md:text-base">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-xs md:text-sm ${
                    !selectedCategory
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-xs md:text-sm ${
                      selectedCategory === category.name
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-40 md:h-48 mb-3 md:mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Products Grid */}
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="card group relative">
                      <Link to={`/product/${product._id}`} className="block">
                        <div className="relative">
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="w-full h-36 md:h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
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
                          {product.stock < 10 && (
                            <span className="absolute top-2 right-12 bg-red-500 text-white text-xs px-2 py-1 rounded">
                              Low Stock
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.rating)
                                      ? 'text-gold-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                              ({product.numReviews})
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">₹{product.price}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({product.weight})</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </Link>
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => handleWishlistToggle(e, product)}
                        className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-200 z-10 ${
                          isInWishlist(product._id)
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                      </button>
                      {/* Add to Cart Button */}
                      <div className="px-4 pb-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product._id);
                          }}
                          disabled={product.stock === 0}
                          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center mt-6 md:mt-12">
                    <div className="flex space-x-1 md:space-x-2 overflow-x-auto max-w-full px-2 py-2 hide-scrollbar">
                      {[...Array(pages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setPage(index + 1)}
                          className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base flex-shrink-0 ${
                            page === index + 1
                              ? 'bg-primary-600 text-white'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
