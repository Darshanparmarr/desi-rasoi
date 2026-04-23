import React from 'react';
import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { Product } from '../types';
import { Clock, X } from 'lucide-react';

const RecentlyViewedProducts: React.FC = () => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Recently Viewed</h2>
        </div>
        <button
          onClick={clearRecentlyViewed}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recentlyViewed.map((product: Product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="group block"
          >
            <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.featured && (
                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Featured
                </div>
              )}
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-green-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm font-semibold text-green-600">
                ₹{product.price}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {product.weight}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedProducts;
