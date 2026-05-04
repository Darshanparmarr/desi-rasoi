import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User as UserIcon, ArrowRight, Sparkles, Heart } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, googleLogin, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await register(name, email, password);
      toast.success('Welcome to Akshar E-Commerce');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        await googleLogin(credentialResponse.credential);
        toast.success('Signed up with Google');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Google signup failed');
    }
  };

  return (
    <div className="grid lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
      <aside className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-secondary-500 to-secondary-700 text-white p-14 flex-col justify-between">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <Link to="/" className="relative inline-flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center font-display font-bold text-xl">A</span>
          <span className="font-display text-xl font-bold">Akshar E-Commerce</span>
        </Link>

        <div className="relative">
          <span className="eyebrow text-white/90">Join the family</span>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight">
            Become a member,<br /> taste the heritage.
          </h2>
          <p className="mt-4 text-white/90 max-w-md">
            New flavours every season, member-only discounts, and recipes from real Indian kitchens — straight to your inbox.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm">
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4">
              <Heart className="h-5 w-5" />
              <p className="mt-2 text-sm font-semibold">Member discounts</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4">
              <Sparkles className="h-5 w-5" />
              <p className="mt-2 text-sm font-semibold">Early access</p>
            </div>
          </div>
        </div>

        <p className="relative text-sm text-white/80">It only takes a minute.</p>
      </aside>

      <main className="flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Sparkles className="mx-auto h-6 w-6 text-secondary-500" />
            <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">Create account</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Join the Akshar E-Commerce family</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Full name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>
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
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-11"
                    minLength={6}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field pl-11"
                    minLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-900/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-secondary btn-lg w-full justify-center">
              {loading ? 'Creating account…' : 'Create account'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs uppercase tracking-wider text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Google signup failed')} />
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-700 dark:text-secondary-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
