import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { login, googleLogin, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      toast.success('Login successful');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        await googleLogin(credentialResponse.credential);
        toast.success('Logged in with Google');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Google login failed');
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
      await api.post('/users/reset-password-otp', { email, otp, newPassword });
      toast.success('Password reset. Please sign in.');
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

  return (
    <div className="grid lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
      {/* Brand panel */}
      <aside className="hidden lg:flex relative overflow-hidden bg-primary-900 text-white p-14 flex-col justify-between">
        <div className="absolute inset-0 bg-hero-radial opacity-60" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-secondary-500/30 blur-3xl" />
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary-500/30 blur-3xl" />

        <Link to="/" className="relative inline-flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-primary-900 font-display font-bold text-xl">
            A
          </span>
          <span className="font-display text-xl font-bold">Akshar E-Commerce</span>
        </Link>

        <div className="relative">
          <span className="eyebrow text-secondary-300">Welcome back</span>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight">
            Tastes you remember,<br /> delivered to your door.
          </h2>
          <p className="mt-4 text-primary-100/80 max-w-md">
            Sign in to track orders, save favourites and unlock exclusive seasonal flavours from our home kitchens.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((n) => (
                <img
                  key={n}
                  src={`/images/products/product-${n}.webp`}
                  alt=""
                  className="h-9 w-9 rounded-full ring-2 ring-primary-900 object-cover"
                />
              ))}
            </div>
            <p className="text-sm text-primary-100/80">10,000+ happy customers across India</p>
          </div>
        </div>

        <div className="relative flex items-center gap-3 text-sm text-primary-100/80">
          <ShieldCheck className="h-4 w-4 text-secondary-300" />
          Secure, encrypted login
        </div>
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Sparkles className="mx-auto h-6 w-6 text-secondary-500" />
            <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
              {isForgotPasswordMode ? 'Reset password' : 'Welcome back'}
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {isForgotPasswordMode
                ? otpSent
                  ? 'Enter the OTP sent to your email and choose a new password.'
                  : "We'll send a 6-digit OTP to your email."
                : 'Sign in to your Akshar E-Commerce account'}
            </p>
          </div>

          <form
            onSubmit={isForgotPasswordMode ? (otpSent ? handleResetPassword : handleSendOtp) : handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="you@email.com"
                  required
                />
              </div>
            </div>

            {!isForgotPasswordMode ? (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-11"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            ) : otpSent ? (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input-field tracking-[0.4em] text-center font-semibold"
                    placeholder="••••••"
                    maxLength={6}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field"
                    minLength={6}
                    required
                  />
                </div>
              </>
            ) : null}

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-900/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otpLoading || resetLoading}
              className="btn-secondary btn-lg w-full justify-center"
            >
              {!isForgotPasswordMode && (loading ? 'Signing in…' : 'Sign in')}
              {isForgotPasswordMode && !otpSent && (otpLoading ? 'Sending OTP…' : 'Send OTP')}
              {isForgotPasswordMode && otpSent && (resetLoading ? 'Resetting…' : 'Reset password')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {!isForgotPasswordMode && (
            <>
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs uppercase tracking-wider text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="flex justify-center">
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Google login failed')} />
              </div>
            </>
          )}

          <div className="mt-6 text-center text-sm">
            {!isForgotPasswordMode ? (
              <button
                type="button"
                onClick={() => {
                  clearError();
                  setIsForgotPasswordMode(true);
                  setOtpSent(false);
                  setOtp('');
                  setNewPassword('');
                }}
                className="text-primary-700 dark:text-secondary-400 font-semibold hover:underline"
              >
                Forgot password?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  clearError();
                  setIsForgotPasswordMode(false);
                  setOtpSent(false);
                  setOtp('');
                  setNewPassword('');
                }}
                className="text-primary-700 dark:text-secondary-400 font-semibold hover:underline"
              >
                Back to login
              </button>
            )}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-700 dark:text-secondary-400 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
