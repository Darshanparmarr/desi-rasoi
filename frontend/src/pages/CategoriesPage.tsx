import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Candy, 
  Flame, 
  Heart, 
  Apple, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const categories = [
  {
    id: 'traditional',
    name: 'Traditional',
    description: 'Classic Indian mukhwas recipes passed down through generations',
    icon: Leaf,
    color: 'bg-green-100 text-green-600',
    image: '/images/products/product-1.webp',
    productCount: 12
  },
  {
    id: 'herbal',
    name: 'Herbal',
    description: 'Natural herbal blends for digestive wellness and fresh breath',
    icon: Heart,
    color: 'bg-purple-100 text-purple-600',
    image: '/images/products/product-2.webp',
    productCount: 8
  },
  {
    id: 'sweet',
    name: 'Sweet',
    description: 'Delicious sweet varieties for a delightful after-meal treat',
    icon: Candy,
    color: 'bg-pink-100 text-pink-600',
    image: '/images/products/product-3.webp',
    productCount: 10
  },
  {
    id: 'spicy',
    name: 'Spicy',
    description: 'Bold and spicy flavors for those who love a kick',
    icon: Flame,
    color: 'bg-red-100 text-red-600',
    image: '/images/products/product-4.webp',
    productCount: 6
  },
  {
    id: 'medicinal',
    name: 'Medicinal',
    description: 'Ayurvedic blends with health benefits',
    icon: Sparkles,
    color: 'bg-amber-100 text-amber-600',
    image: '/images/products/product-5.webp',
    productCount: 5
  },
  {
    id: 'fruit',
    name: 'Fruit',
    description: 'Refreshing fruit-infused mukhwas varieties',
    icon: Apple,
    color: 'bg-orange-100 text-orange-600',
    image: '/images/products/product-6.webp',
    productCount: 7
  }
];

const CategoriesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Browse Categories</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Explore our wide range of mukhwas categories, each crafted with authentic 
            Indian flavors and premium ingredients.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.name}`}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/product-1.webp';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                      <Icon className="h-4 w-4 mr-2" />
                      {category.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name} Mukhwas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category.productCount} Products
                    </span>
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
      </div>

      {/* Special Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-3xl font-bold mb-4">Special Collection</h2>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
            Discover our exclusive special collection featuring limited edition 
            and seasonal mukhwas blends.
          </p>
          <Link
            to="/products?category=Special"
            className="inline-flex items-center bg-white dark:bg-gray-800 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 transition-colors"
          >
            View Special Collection
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
