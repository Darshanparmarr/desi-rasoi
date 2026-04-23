import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Product } from '../types';

interface ProductComparisonContextType {
  compareProducts: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

const ProductComparisonContext = createContext<ProductComparisonContextType | undefined>(undefined);

export const useProductComparison = () => {
  const context = useContext(ProductComparisonContext);
  if (!context) {
    throw new Error('useProductComparison must be used within a ProductComparisonProvider');
  }
  return context;
};

interface ProductComparisonProviderProps {
  children: ReactNode;
}

export const ProductComparisonProvider: React.FC<ProductComparisonProviderProps> = ({ children }) => {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);

  // Load compare products from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('compareProducts');
    if (stored) {
      try {
        setCompareProducts(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing compare products:', error);
        localStorage.removeItem('compareProducts');
      }
    }
  }, []);

  // Save to localStorage whenever compareProducts changes
  useEffect(() => {
    localStorage.setItem('compareProducts', JSON.stringify(compareProducts));
  }, [compareProducts]);

  const addToCompare = useCallback((product: Product) => {
    if (compareProducts.length >= 4) {
      alert('You can compare maximum 4 products at a time');
      return;
    }
    
    if (!compareProducts.some(p => p._id === product._id)) {
      setCompareProducts(prev => [...prev, product]);
    }
  }, [compareProducts]);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareProducts(prev => prev.filter(p => p._id !== productId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareProducts([]);
    localStorage.removeItem('compareProducts');
  }, []);

  const isInCompare = useCallback((productId: string) => {
    return compareProducts.some(p => p._id === productId);
  }, [compareProducts]);

  const contextValue = useMemo(() => ({
    compareProducts,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare
  }), [compareProducts, addToCompare, removeFromCompare, clearCompare, isInCompare]);

  return (
    <ProductComparisonContext.Provider value={contextValue}>
      {children}
    </ProductComparisonContext.Provider>
  );
};
