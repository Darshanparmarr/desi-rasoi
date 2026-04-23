import React from 'react';
import { Link } from 'react-router-dom';
import { useProductComparison } from '../context/ProductComparisonContext';
import { Product } from '../types';
import { X, ArrowLeft, Plus, Check } from 'lucide-react';

const ProductComparisonPage: React.FC = () => {
  const { compareProducts, removeFromCompare, clearCompare } = useProductComparison();

  if (compareProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No Products to Compare</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Add products from the product pages to compare their ingredients, prices, and features side by side.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getAllIngredients = (products: Product[]) => {
    const ingredientSet = new Set<string>();
    products.forEach(product => {
      product.ingredients.forEach(ingredient => {
        ingredientSet.add(ingredient);
      });
    });
    return Array.from(ingredientSet).sort();
  };

  const allIngredients = getAllIngredients(compareProducts);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/products"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Products
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Comparison</h1>
          </div>
          {compareProducts.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-red-600 hover:text-red-700 flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Clear All
            </button>
          )}
        </div>

        {/* Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b">
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white w-1/4">
                    Feature
                  </th>
                  {compareProducts.map((product) => (
                    <th key={product._id} className="text-center p-4 w-1/4">
                      <div className="relative">
                        <button
                          onClick={() => removeFromCompare(product._id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                        />
                        <Link
                          to={`/product/${product._id}`}
                          className="text-sm font-semibold text-gray-900 dark:text-white hover:text-green-600 transition-colors block"
                        >
                          {product.name}
                        </Link>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{product.category}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price */}
                <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Price</td>
                  {compareProducts.map((product) => (
                    <td key={product._id} className="p-4 text-center">
                      <div className="text-lg font-bold text-green-600">
                        ₹{product.price}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        per {product.weight}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Rating</td>
                  {compareProducts.map((product) => (
                    <td key={product._id} className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-lg font-semibold">{product.rating}</span>
                        <span className="text-yellow-400 ml-1">★</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ({product.numReviews} reviews)
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Stock */}
                <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Availability</td>
                  {compareProducts.map((product) => (
                    <td key={product._id} className="p-4 text-center">
                      {product.stock > 0 ? (
                        <span className="text-green-600 font-medium">
                          {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">Out of Stock</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Weight */}
                <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Package Size</td>
                  {compareProducts.map((product) => (
                    <td key={product._id} className="p-4 text-center">
                      {product.weight}
                    </td>
                  ))}
                </tr>

                {/* Ingredients */}
                <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Ingredients</td>
                  {compareProducts.map((product) => (
                    <td key={product._id} className="p-4">
                      <div className="space-y-1">
                        {allIngredients.map((ingredient) => (
                          <div key={ingredient} className="flex items-center justify-center">
                            {product.ingredients.includes(ingredient) ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-gray-300" />
                            )}
                            <span className="ml-2 text-sm">{ingredient}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Featured */}
                <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Featured</td>
                  {compareProducts.map((product) => (
                    <td key={product._id} className="p-4 text-center">
                      {product.featured ? (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 dark:text-green-200 text-xs rounded-full">
                          Featured
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Actions</td>
                  {compareProducts.map((product) => (
                    <td key={product._id} className="p-4 text-center">
                      <div className="space-y-2">
                        <Link
                          to={`/product/${product._id}`}
                          className="block w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add More Products */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Compare up to 4 products at a time
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add More Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductComparisonPage;
