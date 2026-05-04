import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingCart, Search, Heart, Building2, ArrowRight, SlidersHorizontal, X } from 'lucide-react';
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

const FALLBACKS = [
  '/images/products/product-1.webp',
  '/images/products/product-2.webp',
  '/images/products/product-3.webp',
  '/images/products/product-4.webp',
  '/images/products/product-5.webp',
  '/images/products/product-6.webp',
];

const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Most popular', value: 'popular' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
];

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
  const [sort, setSort] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api
      .get<Category[]>('/categories')
      .then(({ data }) => setCategories(data))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
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
    if (user) fetchWishlist();
  }, [page, searchQuery, selectedCategory, user, fetchWishlist]);

  const sortedProducts = React.useMemo(() => {
    const list = [...products];
    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'newest':
        return list;
      default:
        return list.sort((a, b) => b.rating - a.rating);
    }
  }, [products, sort]);

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
      toast.success('Added to cart');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
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
        const item = wishlist?.items?.find((i) => i.product._id === product._id);
        if (item) {
          await removeFromWishlist(item._id);
          toast.success('Removed from wishlist');
        }
      } else {
        await addToWishlist(product._id);
        toast.success('Added to wishlist');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const activeFilters = [selectedCategory, searchQuery].filter(Boolean);

  return (
    <div className="container-page py-8 sm:py-12 space-y-6 sm:space-y-8">
      {/* Wholesale banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white p-5 sm:p-8">
        <div className="absolute inset-0 bg-hero-radial opacity-50" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-secondary-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-secondary-300 font-semibold">Bulk & wholesale</p>
              <h2 className="font-display text-lg sm:text-2xl font-bold">Plan a wedding, event or retail line?</h2>
              <p className="text-sm text-primary-100/85">Get up to 40% off on bulk orders.</p>
            </div>
          </div>
          <Link to="/wholesale" className="btn-secondary btn-md whitespace-nowrap">
            Get a quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Catalog</span>
          <h1 className="heading-section mt-1">All products</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {loading ? 'Loading…' : `${products.length} ${products.length === 1 ? 'item' : 'items'} found`}
        </p>
      </div>

      {/* Search + sort + filter trigger */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papad, aachar, masala…"
            className="input-field pl-11"
          />
        </form>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field sm:w-56"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className="btn-outline btn-md justify-center"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active</span>
          {selectedCategory && (
            <button onClick={() => handleCategoryChange('')} className="chip-orange hover:bg-secondary-100">
              {selectedCategory}
              <X className="h-3 w-3" />
            </button>
          )}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPage(1);
                const p = new URLSearchParams();
                if (selectedCategory) p.append('category', selectedCategory);
                setSearchParams(p);
              }}
              className="chip-navy hover:bg-primary-100"
            >
              "{searchQuery}"
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-[16rem_1fr] gap-6 lg:gap-10">
        {/* Sidebar filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="card p-5 sticky top-24">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleCategoryChange('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !selectedCategory
                    ? 'bg-primary-50 text-primary-800 font-semibold dark:bg-primary-900/30 dark:text-primary-100'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
                }`}
              >
                All products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.name
                      ? 'bg-primary-50 text-primary-800 font-semibold dark:bg-primary-900/30 dark:text-primary-100'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-3 sm:p-4 animate-pulse">
                  <div className="aspect-square rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="mt-3 h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="mt-2 h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="card p-12 text-center">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">No products found</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Try a different keyword or category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {sortedProducts.map((product) => (
                  <article key={product._id} className="card card-hover relative flex flex-col overflow-hidden">
                    <Link to={`/product/${product._id}`} className="block relative">
                      <div className="aspect-square overflow-hidden bg-stone-100 dark:bg-slate-800">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
                          }}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      {product.stock > 0 && product.stock < 10 && (
                        <span className="absolute top-3 left-3 chip-red">Only {product.stock} left</span>
                      )}
                      {product.stock === 0 && (
                        <span className="absolute top-3 left-3 chip">Out of stock</span>
                      )}
                    </Link>

                    <button
                      onClick={(e) => handleWishlistToggle(e, product)}
                      aria-label="Toggle wishlist"
                      className={`absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full shadow-soft transition-all ${
                        isInWishlist(product._id)
                          ? 'bg-secondary-600 text-white'
                          : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:bg-secondary-50 hover:text-secondary-600'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                    </button>

                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{product.category}</p>
                      <Link to={`/product/${product._id}`} className="block mt-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 hover:text-primary-700 dark:hover:text-secondary-400 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} />
                          ))}
                        </div>
                        <span className="text-slate-500 dark:text-slate-400">({product.numReviews})</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <span className="font-display text-xl font-bold text-primary-900 dark:text-white">₹{product.price}</span>
                          {product.weight && <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/ {product.weight}</span>}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product._id);
                        }}
                        disabled={product.stock === 0}
                        className="btn-secondary btn-sm mt-4 w-full justify-center disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {product.stock === 0 ? 'Sold out' : 'Add to cart'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="mt-10 flex justify-center">
                  <div className="inline-flex flex-wrap items-center gap-1 sm:gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 shadow-soft border border-slate-100 dark:border-slate-800">
                    {[...Array(pages)].map((_, idx) => (
                      <button
                        key={idx + 1}
                        onClick={() => setPage(idx + 1)}
                        className={`min-w-[2.25rem] h-9 px-3 rounded-xl text-sm font-medium transition-colors ${
                          page === idx + 1
                            ? 'bg-primary-600 text-white shadow-glow-navy'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
