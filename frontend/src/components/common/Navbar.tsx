import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Search, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  Store, 
  Sparkles,
  Check,
  ChevronDown,
  Calendar,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotifications } from '../../context/NotificationContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { cartCount } = useCart();
  const { studios, products } = useWishlist();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const wishlistCount = studios.length + products.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/studios?search=${encodeURIComponent(searchQuery.trim())}&city=${selectedCity}`);
    }
  };

  const handleDemoSwitch = async (role: 'customer' | 'shop_owner' | 'admin') => {
    setShowDemoMenu(false);
    setShowUserMenu(false);
    await demoLogin(role);
    if (role === 'shop_owner') navigate('/seller/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top Banner with Quick Role Switcher */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded font-semibold text-[11px] tracking-wide border border-pink-500/30">
              <Sparkles className="w-3 h-3 text-pink-400" />
              MEMORAA LIVE
            </span>
            <span className="hidden sm:inline text-slate-400">
              India’s Leading Photography & Personalized Memories Platform
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden md:inline">⚡ Quick Role Switcher:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleDemoSwitch('customer')}
                className={`px-2 py-0.5 rounded transition ${user?.role === 'customer' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Customer
              </button>
              <button
                onClick={() => handleDemoSwitch('shop_owner')}
                className={`px-2 py-0.5 rounded transition ${user?.role === 'shop_owner' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Shop Owner
              </button>
              <button
                onClick={() => handleDemoSwitch('admin')}
                className={`px-2 py-0.5 rounded transition ${user?.role === 'admin' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition">
              <Camera className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-serif">
                MEM<span className="text-pink-600">ORAA</span>
              </span>
              <p className="text-[10px] text-slate-600 font-medium tracking-wider uppercase -mt-1 hidden sm:block">
                Capture Moments. Preserve Memories.
              </p>
            </div>
          </Link>

          {/* Search & City Filter Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-lg mx-4">
            <div className="flex items-center w-full bg-slate-100 rounded-full border border-slate-200 focus-within:border-amber-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20 transition overflow-hidden">
              <div className="flex items-center pl-3 pr-2 border-r border-slate-200 text-slate-500 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-600 mr-1 flex-shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-slate-700 outline-none cursor-pointer py-1.5 text-xs font-semibold"
                >
                  <option value="All">All Cities</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              <div className="flex-1 flex items-center px-3 py-1.5">
                <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search studios, weddings, photo gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 font-semibold text-xs transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link to="/studios" className="hover:text-amber-600 transition flex items-center gap-1">
              <Camera className="w-4 h-4 text-amber-500" />
              Studios
            </Link>
            <Link to="/categories" className="hover:text-amber-600 transition flex items-center gap-1">
              <Layers className="w-4 h-4 text-amber-500" />
              Categories
            </Link>
            <Link to="/products" className="hover:text-amber-600 transition flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Photo Store
            </Link>
            <Link to="/compare" className="hover:text-amber-600 transition text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300">
              Compare Studios
            </Link>
          </nav>

          {/* Action Icons & User Dropdown */}
          <div className="flex items-center gap-3">
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-full transition"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-full transition"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-full transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-amber-500" /> Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => {
                            markAsRead(n._id);
                            if (n.link) navigate(n.link);
                            setShowNotifications(false);
                          }}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 ${!n.isRead ? 'bg-amber-50/50' : ''}`}
                        >
                          <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-amber-500' : 'bg-transparent'}`} />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.createdAt).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Navigators & User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-slate-100 border border-slate-200 transition"
                >
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover border border-amber-500"
                  />
                  <span className="text-xs font-semibold text-slate-800 max-w-[90px] truncate hidden sm:block">
                    {user?.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {user?.role.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="py-1">
                      {user?.role === 'shop_owner' && (
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
                        >
                          <Store className="w-4 h-4 text-amber-600" /> Seller Dashboard
                        </Link>
                      )}

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" /> Super Admin Panel
                        </Link>
                      )}

                      <Link
                        to="/bookings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <Calendar className="w-4 h-4 text-slate-400" /> My Photoshoot Bookings
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <ShoppingBag className="w-4 h-4 text-slate-400" /> My Photo Orders
                      </Link>

                      <Link
                        to="/proofs"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <ImageIcon className="w-4 h-4 text-slate-400" /> Photo Proofs & Approvals
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" /> Profile & Addresses
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-amber-600 px-3 py-2 rounded-lg transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
