import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setOtpLoading(true);
      await api.post('/users/forgot-password', { email });
      setOtpSent(true);
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !otp || !newPassword) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setResetLoading(true);
      await api.post('/users/reset-password-otp', {
        email,
        otp,
        newPassword
      });
      toast.success('Password reset successful. Please sign in.');
      setIsForgotPasswordMode(false);
      setOtpSent(false);
      setOtp('');
      setNewPassword('');
      setPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setResetLoading(false);
    }
  };

  const switchToForgotPassword = () => {
    clearError();
    setIsForgotPasswordMode(true);
    setOtpSent(false);
    setOtp('');
    setNewPassword('');
  };

  const switchToLogin = () => {
    clearError();
    setIsForgotPasswordMode(false);
    setOtpSent(false);
    setOtp('');
    setNewPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your Mukhwas account</p>
        </div>

        <form
          onSubmit={isForgotPasswordMode ? (otpSent ? handleResetPassword : handleSendOtp) : handleSubmit}
          className="space-y-6"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {!isForgotPasswordMode ? (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
          ) : (
            <>
              {otpSent && (
                <>
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="input-field"
                      placeholder="Enter 6-digit OTP"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field"
                      minLength={6}
                      required
                    />
                  </div>
                </>
              )}
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otpLoading || resetLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isForgotPasswordMode && (loading ? 'Signing in...' : 'Sign In')}
            {isForgotPasswordMode && !otpSent && (otpLoading ? 'Sending OTP...' : 'Send OTP')}
            {isForgotPasswordMode && otpSent && (resetLoading ? 'Resetting Password...' : 'Reset Password')}
          </button>
        </form>

        <div className="mt-4 text-center">
          {!isForgotPasswordMode ? (
            <button
              type="button"
              onClick={switchToForgotPassword}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Forgot Password?
            </button>
          ) : (
            <div className="space-y-2">
              {!otpSent && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  We will send a 6-digit OTP to your email.
                </p>
              )}
              <button
                type="button"
                onClick={switchToLogin}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
