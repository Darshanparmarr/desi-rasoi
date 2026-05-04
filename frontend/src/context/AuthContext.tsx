import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'employee' | 'admin';
  token: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' | 'REGISTER_START' }
  | { type: 'LOGIN_SUCCESS' | 'REGISTER_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAIL' | 'REGISTER_FAIL'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { user: null, loading: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const { data } = await api.post('/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAIL', payload: message });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'REGISTER_START' });
      const { data } = await api.post('/users/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      dispatch({ type: 'REGISTER_SUCCESS', payload: data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'REGISTER_FAIL', payload: message });
      throw error;
    }
  };

  const googleLogin = async (credential: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const { data } = await api.post('/users/google', { credential });
      localStorage.setItem('userInfo', JSON.stringify(data));
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Google login failed';
      dispatch({ type: 'LOGIN_FAIL', payload: message });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        googleLogin,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
