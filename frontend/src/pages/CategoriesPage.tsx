import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

const GRADIENT_COLORS = [
  'from-green-500 to-emerald-600',
  'from-purple-500 to-purple-700',
  'from-pink-500 to-rose-600',
  'from-red-500 to-red-700',
  'from-amber-500 to-yellow-600',
  'from-orange-500 to-orange-700',
  'from-blue-500 to-blue-700',
  'from-indigo-500 to-indigo-700',
];

const FALLBACK_IMAGES = [
  '/images/products/product-1.webp',
  '/images/products/product-2.webp',
  '/images/products/product-3.webp',
  '/images/products/product-4.webp',
  '/images/products/product-5.webp',
  '/images/products/product-6.webp',
];

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Browse Categories</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Explore our wide range of categories, each crafted with authentic Indian flavors and premium ingredients.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No categories available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const imgSrc = getImageUrl(category.image) || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
              const gradientClass = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
              return (
                <Link
                  key={category._id}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${gradientClass} text-white shadow`}>
                        {category.name}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-end">
                      <span className="inline-flex items-center text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                        Explore
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Special Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-3xl font-bold mb-4">Shop All Products</h2>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
            Browse our full collection of authentic homemade Indian delicacies.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View All Products
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
