import React, { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../services/api';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    weight?: string;
  };
  quantity: number;
  price: number;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
}

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

interface CartContextType extends CartState {
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'CART_START' }
  | { type: 'CART_SUCCESS'; payload: Cart }
  | { type: 'CART_FAIL'; payload: string }
  | { type: 'CLEAR_ERROR' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'CART_START':
      return { ...state, loading: true, error: null };
    case 'CART_SUCCESS':
      return { ...state, cart: action.payload, loading: false, error: null };
    case 'CART_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    loading: false,
    error: null,
  });

  const fetchCart = useCallback(async () => {
    try {
      dispatch({ type: 'CART_START' });
      const { data } = await api.get('/cart');
      dispatch({ type: 'CART_SUCCESS', payload: data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch cart';
      dispatch({ type: 'CART_FAIL', payload: message });
    }
  }, []);

  const addToCart = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: 'CART_START' });
      const { data } = await api.post('/cart/add', { productId, quantity });
      dispatch({ type: 'CART_SUCCESS', payload: data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      dispatch({ type: 'CART_FAIL', payload: message });
      throw error;
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      dispatch({ type: 'CART_START' });
      const { data } = await api.put(`/cart/${itemId}`, { quantity });
      dispatch({ type: 'CART_SUCCESS', payload: data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update cart';
      dispatch({ type: 'CART_FAIL', payload: message });
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      dispatch({ type: 'CART_START' });
      const { data } = await api.delete(`/cart/${itemId}`);
      dispatch({ type: 'CART_SUCCESS', payload: data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove from cart';
      dispatch({ type: 'CART_FAIL', payload: message });
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      dispatch({ type: 'CART_SUCCESS', payload: { _id: '', user: '', items: [], totalAmount: 0 } });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      dispatch({ type: 'CART_FAIL', payload: message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
