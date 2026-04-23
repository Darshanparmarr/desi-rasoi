import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Product } from '../types';

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

interface RecentlyViewedProviderProps {
  children: ReactNode;
}

export const RecentlyViewedProvider: React.FC<RecentlyViewedProviderProps> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing recently viewed products:', error);
        localStorage.removeItem('recentlyViewed');
      }
    }
  }, []);

  // Save to localStorage whenever recentlyViewed changes
  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(p => p._id !== product._id);
      // Add to beginning
      const updated = [product, ...filtered];
      // Keep only last 10 items
      return updated.slice(0, 10);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    localStorage.removeItem('recentlyViewed');
  }, []);

  const contextValue = useMemo(() => ({
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed
  }), [recentlyViewed, addToRecentlyViewed, clearRecentlyViewed]);

  return (
    <RecentlyViewedContext.Provider value={contextValue}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};
