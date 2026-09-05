import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Store, 
  Layers, 
  Tag, 
  Users, 
  MessageSquare, 
  BarChart3, 
  ArrowLeft, 
  Sparkles,
  Calendar,
  ShoppingBag,
  CreditCard,
  Star,
  Package,
  Truck,
  Percent,
  Settings,
  Menu,
  X,
  Bell,
  CheckCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const location = useLocation();

  const fetchNotifications = async () => {
    try {
      setIsLoadingNotifications(true);
      const res = await api.get('/admin/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch admin notifications:', err);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/admin/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'refund':
        return <RotateCcw className="w-4 h-4 text-amber-400" />;
      case 'complaint':
        return <MessageSquare className="w-4 h-4 text-rose-400" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-400" />;
      case 'inventory':
        return <Package className="w-4 h-4 text-blue-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
    }
  };

  const navItems = [
    { name: 'Overview Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User & Customer Mgt', path: '/admin/users', icon: Users },
    { name: 'Studio Verification', path: '/admin/studios', icon: Store, badge: 'Queue' },
    { name: 'Physical Products', path: '/admin/products', icon: Package },
    { name: 'Photoshoot Categories', path: '/admin/categories', icon: Layers },
    { name: 'Studio Packages', path: '/admin/packages', icon: Layers },
    { name: 'Booking Management', path: '/admin/bookings', icon: Calendar },
    { name: 'Order Management', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Payments & Gateway', path: '/admin/payments', icon: CreditCard },
    { name: 'Commission & Settlements', path: '/admin/commission', icon: Percent },
    { name: 'Coupons & Promos', path: '/admin/coupons', icon: Tag },
    { name: 'Review Moderation', path: '/admin/reviews', icon: Star },
    { name: 'Complaint Tickets', path: '/admin/complaints', icon: MessageSquare },
    { name: 'Courier & Deliveries', path: '/admin/deliveries', icon: Truck },
    { name: 'Reports & Revenue', path: '/admin/reports', icon: BarChart3 },
    { name: 'Admin Settings', path: '/admin/settings', icon: Settings },
  ];

  const mobileQuickItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Bookings', path: '/admin/bookings', icon: Calendar },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Mobile Top App Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white leading-tight">Super Admin</h3>
              <p className="text-[10px] text-purple-400 font-semibold">MEMORA Master</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotificationOpen(true)}
            className="relative p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
            aria-label="Admin Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <Link
            to="/"
            className="text-xs text-purple-400 font-bold px-2.5 py-1.5 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20"
          >
            Marketplace
          </Link>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-4/5 max-w-xs h-full bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-5 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Super Admin</h4>
                    <span className="text-[10px] text-purple-400 font-semibold">16 Master Modules</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-400/20 text-purple-300">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
              <Link to="/" className="flex items-center gap-2 text-purple-400 font-bold hover:underline">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex-col justify-between h-screen sticky top-0">
        <div className="overflow-hidden flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 text-xs text-purple-400 font-semibold mb-3 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-600/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-bold text-white truncate">Super Admin</h3>
                <span className="text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> MEMORA Master Portal
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/admin/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-400/20 text-purple-300">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex-shrink-0">
            <p className="font-semibold text-slate-400">MEMORA Governance v2.0</p>
            <p className="text-[10px] mt-0.5">Platform Commission: 10%</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area with Desktop Top Bar */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Governance & Oversight
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-xs text-purple-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live MongoDB Master Gateway
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={() => setNotificationOpen(true)}
              className="relative p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
              aria-label="Admin Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Admin User Profile Pill */}
            <div className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
              <div className="w-6 h-6 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block leading-none">
                  {user?.name || 'Super Admin'}
                </span>
                <span className="text-[10px] text-purple-400 font-medium">
                  {user?.email || 'admin@memora.com'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Admin Notification Slide-Over Drawer */}
      {notificationOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 flex flex-col justify-between shadow-2xl">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">System Notifications</h3>
                  <span className="text-[10px] text-slate-400">{unreadCount} unread platform alert(s)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-bold transition"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => setNotificationOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoadingNotifications ? (
                <div className="text-center py-16">
                  <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Fetching live alerts...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  No new platform notifications.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`p-3.5 rounded-2xl border transition text-xs space-y-1.5 ${
                      !n.isRead
                        ? 'bg-slate-950 border-purple-500/40 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <div className="p-1 rounded-lg bg-slate-900 border border-slate-800">
                          {getNotificationIcon(n.type)}
                        </div>
                        <span className="truncate">{n.title}</span>
                      </div>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pl-7">
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pl-7 pt-1">
                      <span className="uppercase font-bold tracking-wider text-slate-400">{n.type}</span>
                      <span>{new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Auto-refreshes periodically</span>
              <button
                onClick={fetchNotifications}
                className="text-purple-400 font-bold hover:underline"
              >
                Sync Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Quick Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-1.5 flex items-center justify-around">
        {mobileQuickItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
                isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center py-1 px-2 text-slate-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">All Menus</span>
        </button>
      </div>
    </div>
  );
};
