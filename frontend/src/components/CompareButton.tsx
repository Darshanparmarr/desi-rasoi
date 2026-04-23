import React from 'react';
import { Link } from 'react-router-dom';
import { useProductComparison } from '../context/ProductComparisonContext';
import { Product } from '../types';
import { Scale, Plus, Check } from 'lucide-react';

interface CompareButtonProps {
  product: Product;
  variant?: 'button' | 'icon';
  className?: string;
}

const CompareButton: React.FC<CompareButtonProps> = ({ 
  product, 
  variant = 'button', 
  className = '' 
}) => {
  const { addToCompare, removeFromCompare, isInCompare, compareProducts } = useProductComparison();
  const isComparing = isInCompare(product._id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isComparing) {
      removeFromCompare(product._id);
    } else {
      addToCompare(product);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleCompareClick}
        className={`p-2 rounded-lg transition-colors ${
          isComparing 
            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
        } ${className}`}
        title={isComparing ? 'Remove from comparison' : 'Add to comparison'}
      >
        <Scale className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCompareClick}
        className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg border transition-colors ${
          isComparing
            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 text-green-700 dark:text-green-300 hover:bg-green-100'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800'
        } ${className}`}
      >
        {isComparing ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Added to Compare
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Add to Compare
          </>
        )}
      </button>
      
      {compareProducts.length > 0 && (
        <Link
          to="/compare"
          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          title={`Compare ${compareProducts.length} product${compareProducts.length > 1 ? 's' : ''}`}
        >
          <Scale className="w-4 h-4" />
          <span className="ml-1 text-sm font-medium">{compareProducts.length}</span>
        </Link>
      )}
    </div>
  );
};

export default CompareButton;
