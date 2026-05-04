import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Heart,
  Sparkles,
  Sun,
  Moon,
  User as UserIcon,
  Package,
} from 'lucide-react';

const SHOP_CATEGORIES = [
  { name: 'Papad', image: '/images/products/product-1.webp' },
  { name: 'Aachar', image: '/images/products/product-2.webp' },
  { name: 'Masala', image: '/images/products/product-3.webp' },
  { name: 'Mouth Freshener', image: '/images/products/product-4.webp' },
  { name: 'Snacks', image: '/images/products/product-5.webp' },
  { name: 'Sweets', image: '/images/products/product-6.webp' },
];

const NAV_LINKS: { name: string; to: string }[] = [
  { name: 'Shop', to: '/products' },
  { name: 'Categories', to: '/categories' },
  { name: 'Bulk Orders', to: '/wholesale' },
  { name: 'Track Order', to: '/order-lookup' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsShopOpen(false);
    setIsUserOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
  const wishlistItemCount = wishlist?.items?.length || 0;

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl shadow-soft border-b border-slate-100 dark:border-slate-800'
            : 'bg-white dark:bg-slate-950 border-b border-transparent'
        }`}
      >
        {/* Main nav */}
        <div className="container-page">
          <div className="flex items-center justify-between gap-4 h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative">
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-glow-navy group-hover:scale-105 transition-transform">
                  <span className="text-white font-display font-bold text-xl">A</span>
                </div>
                <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-secondary-500 ring-2 ring-white dark:ring-slate-950" />
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="block font-display text-lg lg:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Akshar E-Commerce
                </span>
                <span className="block text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Homemade · Authentic
                </span>
              </div>
            </Link>

            {/* Search - desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papad, aachar, masala, mukhwas…"
                  className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-900 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-900 placeholder-slate-400 dark:text-white transition-all"
                />
              </div>
            </form>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Shop megamenu */}
              <div
                className="relative"
                onMouseEnter={() => setIsShopOpen(true)}
                onMouseLeave={() => setIsShopOpen(false)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary-700 dark:hover:text-secondary-400 transition-colors rounded-full">
                  Shop
                  <ChevronDown className={`h-4 w-4 transition-transform ${isShopOpen ? 'rotate-180' : ''}`} />
                </button>
                {isShopOpen && (
                  <div className="absolute top-full right-0 mt-1 w-[28rem] card overflow-hidden p-3 grid grid-cols-2 gap-2 animate-fade-up">
                    {SHOP_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.name}
                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-100 dark:ring-slate-800"
                        />
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{cat.name}</span>
                      </Link>
                    ))}
                    <Link
                      to="/products"
                      className="col-span-2 mt-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-200 font-semibold text-sm hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-colors"
                    >
                      Browse all products →
                    </Link>
                  </div>
                )}
              </div>

              {NAV_LINKS.slice(1).map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary-700 dark:hover:text-secondary-400 transition-colors rounded-full"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={toggleTheme}
                className="hidden sm:inline-flex items-center justify-center h-10 w-10 rounded-full text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <Link
                to="/wishlist"
                className="relative inline-flex items-center justify-center h-10 w-10 rounded-full text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-secondary-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-950">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative inline-flex items-center justify-center h-10 w-10 rounded-full text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-secondary-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-950">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Account - desktop */}
              {user ? (
                <div
                  className="relative hidden lg:block"
                  onMouseEnter={() => setIsUserOpen(true)}
                  onMouseLeave={() => setIsUserOpen(false)}
                >
                  <button className="flex items-center gap-2 pl-1 pr-3 py-1 ml-1 rounded-full bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-100 max-w-[6rem] truncate">
                      {user.name?.split(' ')[0]}
                    </span>
                  </button>
                  {isUserOpen && (
                    <div className="absolute right-0 top-full pt-2 w-64 animate-fade-up">
                      <div className="card overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                          <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          {(user.role === 'admin' || user.role === 'employee') && (
                            <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800">
                              <Sparkles className="h-4 w-4 text-secondary-500" />
                              {user.role === 'employee' ? 'Employee Dashboard' : 'Admin Dashboard'}
                            </Link>
                          )}
                          <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800">
                            <UserIcon className="h-4 w-4 text-primary-500" />
                            My Profile
                          </Link>
                          <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800">
                            <Package className="h-4 w-4 text-primary-500" />
                            My Orders
                          </Link>
                          <Link to="/wishlist" className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800">
                            <span className="flex items-center gap-3">
                              <Heart className="h-4 w-4 text-secondary-500" />
                              Wishlist
                            </span>
                            {wishlistItemCount > 0 && (
                              <span className="text-[10px] font-bold rounded-full bg-secondary-100 text-secondary-700 px-2 py-0.5">
                                {wishlistItemCount}
                              </span>
                            )}
                          </Link>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-t border-slate-100 dark:border-slate-800"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2 ml-1">
                  <Link to="/login" className="btn-ghost btn-sm">
                    Login
                  </Link>
                  <Link to="/register" className="btn-secondary btn-sm">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-in panel */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!isMenuOpen}
      >
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <span className="font-display text-lg font-bold text-slate-900 dark:text-white">Menu</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-5 space-y-5 overflow-y-auto h-[calc(100%-65px)]">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-11 pr-4 py-3 text-base bg-stone-100 dark:bg-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary-500 placeholder-slate-400 dark:text-white"
                />
              </div>
            </form>

            <div>
              <p className="eyebrow mb-2">Shop by category</p>
              <div className="grid grid-cols-2 gap-2">
                {SHOP_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.name}
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-stone-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-full object-cover" />
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-2">Quick links</p>
              <div className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-800 dark:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-900 transition-colors"
                  >
                    <span className="font-medium">{link.name}</span>
                    <ChevronDown className="-rotate-90 h-4 w-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-stone-100 dark:bg-slate-900 px-4 py-3">
              <span className="text-sm text-slate-600 dark:text-slate-300">Theme</span>
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDarkMode ? 'Light mode' : 'Dark mode'}
              </button>
            </div>

            {user ? (
              <div className="space-y-2">
                <p className="eyebrow">Account</p>
                <div className="card p-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {(user.role === 'admin' || user.role === 'employee') && (
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-100 dark:hover:bg-slate-900">
                      <Sparkles className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm font-medium">{user.role === 'employee' ? 'Employee' : 'Admin'} Dashboard</span>
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-100 dark:hover:bg-slate-900">
                    <UserIcon className="h-4 w-4 text-primary-500" />
                    <span className="text-sm font-medium">My Profile</span>
                  </Link>
                  <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-100 dark:hover:bg-slate-900">
                    <Package className="h-4 w-4 text-primary-500" />
                    <span className="text-sm font-medium">My Orders</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link to="/login" className="btn-outline btn-md w-full justify-center">
                  Login
                </Link>
                <Link to="/register" className="btn-secondary btn-md w-full justify-center">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Header;
