import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import api from '../services/api';

interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    weight?: string;
    category: string;
  };
  addedAt: string;
}

interface Wishlist {
  _id: string;
  user: string;
  items: WishlistItem[];
}

interface WishlistState {
  wishlist: Wishlist | null;
  loading: boolean;
  error: string | null;
}

interface WishlistContextType extends WishlistState {
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (itemId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearError: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

type WishlistAction =
  | { type: 'WISHLIST_START' }
  | { type: 'WISHLIST_SUCCESS'; payload: Wishlist }
  | { type: 'WISHLIST_FAIL'; payload: string }
  | { type: 'CLEAR_ERROR' };

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'WISHLIST_START':
      return { ...state, loading: true, error: null };
    case 'WISHLIST_SUCCESS':
      return { ...state, wishlist: action.payload, loading: false, error: null };
    case 'WISHLIST_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, {
    wishlist: null,
    loading: false,
    error: null,
  });

  const fetchWishlist = useCallback(async () => {
    try {
      dispatch({ type: 'WISHLIST_START' });
      const { data } = await api.get('/wishlist');
      dispatch({ type: 'WISHLIST_SUCCESS', payload: data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch wishlist';
      dispatch({ type: 'WISHLIST_FAIL', payload: message });
    }
  }, []);

  const addToWishlist = useCallback(async (productId: string) => {
    try {
      dispatch({ type: 'WISHLIST_START' });
      const { data } = await api.post('/wishlist/add', { productId });
      dispatch({ type: 'WISHLIST_SUCCESS', payload: data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add to wishlist';
      dispatch({ type: 'WISHLIST_FAIL', payload: message });
      throw error;
    }
  }, []);

  const removeFromWishlist = useCallback(async (itemId: string) => {
    try {
      dispatch({ type: 'WISHLIST_START' });
      const { data } = await api.delete(`/wishlist/${itemId}`);
      dispatch({ type: 'WISHLIST_SUCCESS', payload: data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove from wishlist';
      dispatch({ type: 'WISHLIST_FAIL', payload: message });
      throw error;
    }
  }, []);

  const clearWishlist = useCallback(async () => {
    try {
      await api.delete('/wishlist');
      dispatch({ type: 'WISHLIST_SUCCESS', payload: { _id: '', user: '', items: [] } });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to clear wishlist';
      dispatch({ type: 'WISHLIST_FAIL', payload: message });
      throw error;
    }
  }, []);

  const isInWishlist = useCallback((productId: string): boolean => {
    if (!state.wishlist || !state.wishlist.items) return false;
    return state.wishlist.items.some(item => item.product._id === productId);
  }, [state.wishlist]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const contextValue = useMemo(() => ({
    ...state,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    clearError,
  }), [
    state,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    clearError
  ]);

  return (
    <WishlistContext.Provider
      value={contextValue}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
