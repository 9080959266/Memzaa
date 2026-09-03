import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, Mail, Lock, Sparkles, ArrowRight, ShieldCheck, Store, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Login: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      await login(email, password);

      if (redirect === 'checkout') navigate('/checkout');
      else if (redirect === 'booking') navigate(-1);
      else navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: 'customer' | 'shop_owner' | 'admin') => {
    try {
      setIsLoading(true);
      setError('');
      await demoLogin(role);

      if (role === 'shop_owner') navigate('/seller/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto font-bold shadow-md shadow-amber-500/20">
            <Camera className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-black text-slate-900 tracking-tight">
            Welcome to MEM<span className="text-amber-600">ORA</span>
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your studio bookings, proof reviews, and photo orders
          </p>
        </div>

        {/* 1-Click Demo Login Selection Banner */}
        <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" /> 1-Click Instant Demo Login:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customer')}
              className="bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 py-2 px-2 rounded-xl text-[11px] font-bold transition flex flex-col items-center gap-1"
            >
              <User className="w-3.5 h-3.5" /> Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('shop_owner')}
              className="bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 py-2 px-2 rounded-xl text-[11px] font-bold transition flex flex-col items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" /> Shop Owner
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 py-2 px-2 rounded-xl text-[11px] font-bold transition flex flex-col items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Standard Email Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="customer@memora.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <span className="text-[11px] text-amber-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3.5 rounded-2xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In to Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-amber-600 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
