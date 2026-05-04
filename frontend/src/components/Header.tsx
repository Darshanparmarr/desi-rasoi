import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingCart, Search, Menu, X, LogOut, ChevronDown, Heart, Sparkles, Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
  const wishlistItemCount = wishlist?.items?.length || 0;

  const shopCategories = [
    { name: 'Papad', image: '/images/products/product-1.webp', desc: 'Crispy homemade papads' },
    { name: 'Aachar', image: '/images/products/product-2.webp', desc: 'Traditional pickles' },
    { name: 'Masala', image: '/images/products/product-3.webp', desc: 'Fresh ground spices' },
    { name: 'Mouth Freshener', image: '/images/products/product-4.webp', desc: 'Authentic mukhwas' },
    { name: 'Snacks', image: '/images/products/product-5.webp', desc: 'Homemade namkeen' },
    { name: 'Sweets', image: '/images/products/product-6.webp', desc: 'Traditional mithai' },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      {/* Top Bar */}
      <div className="bg-brand-green-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center text-sm">
          <span className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Free shipping on orders above ₹500 | Premium Quality Guaranteed
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-green-600 rounded-xl flex items-center justify-center group-hover:bg-brand-green-700 transition-colors">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Akshar E-Commerce</span>
              <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">Homemade Indian Products</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for papad, aachar, masala, mukhwas..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-700 dark:text-white border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-green-500 focus:bg-white dark:bg-gray-800 dark:focus:bg-gray-600 transition-all placeholder-gray-500 dark:placeholder-gray-400"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-300" />
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Shop Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-brand-green-600 dark:hover:text-brand-green-400 font-medium transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700">
                Shop
                <ChevronDown className={`h-4 w-4 transition-transform ${isShopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isShopDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 grid grid-cols-2 gap-3">
                    {shopCategories.map((cat) => (
                      <Link
                        key={cat.name}
                        to={`/products?category=${cat.name}`}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsShopDropdownOpen(false)}
                      >
                        <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-lg object-cover" />
                        <span className="font-medium text-gray-700 dark:text-gray-200">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 p-4">
                    <Link 
                      to="/products" 
                      className="block text-center text-brand-green-600 dark:text-brand-green-400 font-medium hover:text-brand-green-700 dark:hover:text-brand-green-300"
                      onClick={() => setIsShopDropdownOpen(false)}
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/categories"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-brand-green-600 dark:hover:text-brand-green-400 font-medium transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700"
            >
              Categories
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center p-2 text-gray-700 dark:text-gray-300 hover:text-brand-green-600 dark:hover:text-brand-green-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 mx-1"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Wishlist */}
            <Link 
              to="/wishlist"
              className="relative inline-flex items-center justify-center p-2 text-gray-700 dark:text-gray-300 hover:text-brand-green-600 dark:hover:text-brand-green-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 mx-1"
            >
              <Heart className="h-5 w-5" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {wishlistItemCount}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative inline-flex items-center justify-center p-2 text-gray-700 dark:text-gray-300 hover:text-brand-green-600 dark:hover:text-brand-green-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 mx-1"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group ml-2">
                <button className="flex items-center gap-2 pl-2 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <div className="w-8 h-8 bg-brand-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200 hidden lg:block">{user.name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                  {(user.role === 'admin' || user.role === 'employee') && (
                    <Link
                      to="/admin"
                      className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-brand-green-600 dark:hover:text-brand-green-400"
                    >
                      {user.role === 'employee' ? 'Employee Dashboard' : 'Admin Dashboard'}
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-brand-green-600 dark:hover:text-brand-green-400"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-brand-green-600 dark:hover:text-brand-green-400"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-brand-green-600 dark:hover:text-brand-green-400 flex items-center justify-between"
                  >
                    <span>My Wishlist</span>
                    {wishlistItemCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistItemCount}
                      </span>
                    )}
                  </Link>
                  <div className="border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-brand-red-600 dark:text-brand-red-400 hover:bg-brand-red-50 dark:hover:bg-brand-red-900/20 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-brand-green-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 bg-brand-green-600 text-white font-medium rounded-full hover:bg-brand-green-700 transition-colors shadow-md shadow-brand-green-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-brand-green-600 dark:hover:text-brand-green-400"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
              <Link to="/wishlist" className="relative p-2 text-gray-700 dark:text-gray-300">
              <Heart className="h-6 w-6" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative p-2 text-gray-700 dark:text-gray-300">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-brand-green-600 dark:hover:text-brand-green-400"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-gray-700 py-4 px-4 bg-white dark:bg-gray-800 transition-colors duration-300">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for papad, aachar, masala..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-700 dark:text-white border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-green-500 text-base placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" />
              </div>
            </form>
            
            <nav className="flex flex-col space-y-1">
              <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Shop</p>
              <div className="grid grid-cols-2 gap-2 px-2 mb-2">
                {shopCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={`/products?category=${cat.name}`}
                    className="flex flex-col items-center justify-center gap-2 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-brand-green-600 dark:hover:text-brand-green-400 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors active:bg-gray-100 dark:bg-gray-700 dark:active:bg-gray-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow-sm" />
                    <span className="text-sm font-semibold">{cat.name}</span>
                  </Link>
                ))}
              </div>
              
              <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
              
              <Link
                to="/categories"
                className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-brand-green-600 dark:hover:text-brand-green-400 rounded-xl transition-colors font-medium flex items-center gap-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-2 h-2 rounded-full bg-brand-green-400"></span>
                All Categories
              </Link>

              <Link
                to="/wholesale"
                className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-brand-green-600 dark:hover:text-brand-green-400 rounded-xl transition-colors font-medium flex items-center gap-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                Bulk Orders
              </Link>
              
              {user ? (
                <>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-3"></div>
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Account</p>
                  <Link
                    to="/profile"
                    className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-brand-green-600 dark:hover:text-brand-green-400 rounded-xl transition-colors flex items-center gap-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-8 h-8 bg-brand-green-100 dark:bg-brand-green-900 rounded-full flex items-center justify-center">
                      <span className="text-brand-green-600 dark:text-brand-green-400 font-semibold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-brand-green-600 dark:hover:text-brand-green-400 rounded-xl transition-colors flex items-center gap-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm">📦</span>
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-brand-green-600 dark:hover:text-brand-green-400 rounded-xl transition-colors flex items-center justify-between"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center text-sm">❤️</span>
                      My Wishlist
                    </span>
                    {wishlistItemCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        {wishlistItemCount}
                      </span>
                    )}
                  </Link>
                  {(user.role === 'admin' || user.role === 'employee') && (
                    <Link
                      to="/admin"
                      className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-brand-green-600 dark:hover:text-brand-green-400 rounded-xl transition-colors flex items-center gap-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-sm">⚙️</span>
                      {user.role === 'employee' ? 'Employee Dashboard' : 'Admin Dashboard'}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 mt-1 text-brand-red-600 dark:text-brand-red-400 hover:bg-brand-red-50 dark:hover:bg-brand-red-900/20 rounded-xl transition-colors flex items-center gap-3"
                  >
                    <span className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center text-sm">🚪</span>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-3"></div>
                  <div className="flex gap-3 px-4 pt-2">
                    <Link
                      to="/login"
                      className="flex-1 text-center py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-medium active:bg-gray-100 dark:bg-gray-700 dark:active:bg-gray-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex-1 text-center py-3 bg-brand-green-600 hover:bg-brand-green-700 text-white rounded-full font-medium active:bg-brand-green-800 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
