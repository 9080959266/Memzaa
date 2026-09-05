import React, { useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Kanban,
  Calendar,
  ShoppingBag,
  Camera,
  Layers,
  Box,
  DollarSign,
  Star,
  ArrowLeft,
  Store,
  Sparkles,
  Users,
  Printer,
  Image as ImageIcon,
  CheckCircle2,
  Tag,
  BarChart3,
  Settings,
  UserCheck,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ShopOwnerLayout: React.FC = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard Overview', path: '/seller/dashboard', icon: LayoutDashboard },
    { name: 'Kanban Photo Jobs', path: '/seller/kanban', icon: Kanban, badge: 'Live' },
    { name: 'Keepsake Orders', path: '/seller/orders', icon: ShoppingBag },
    { name: 'Photoshoot Bookings', path: '/seller/bookings', icon: Calendar },
    { name: 'Proof Approvals', path: '/seller/proofs', icon: ImageIcon },
    { name: 'Printing & QC', path: '/seller/production', icon: Printer },
    { name: 'Studio & Availability', path: '/seller/studio', icon: Camera },
    { name: 'Packages & Pricing', path: '/seller/packages', icon: Layers },
    { name: 'Workshop Products', path: '/seller/products', icon: Box },
    { name: 'Product Inventory', path: '/seller/inventory', icon: ShoppingBag },
    { name: 'Studio Staff & Crew', path: '/seller/staff', icon: UserCheck },
    { name: 'Offers & Coupons', path: '/seller/offers', icon: Tag },
    { name: 'Client Directory', path: '/seller/customers', icon: Users },
    { name: 'Reviews & Feedback', path: '/seller/reviews', icon: Star },
    { name: 'Reports & Analytics', path: '/seller/reports', icon: BarChart3 },
    { name: 'Revenue & Payouts', path: '/seller/revenue', icon: DollarSign },
    { name: 'Partner Settings', path: '/seller/settings', icon: Settings },
  ];

  // Quick bottom bar items for mobile
  const mobileQuickItems = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: LayoutDashboard },
    { name: 'Kanban', path: '/seller/kanban', icon: Kanban },
    { name: 'Orders', path: '/seller/orders', icon: ShoppingBag },
    { name: 'Bookings', path: '/seller/bookings', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Mobile Top App Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white leading-tight">Studio Partner Hub</h3>
              <p className="text-[10px] text-amber-400 font-semibold">{user?.name?.split(' ')[0]}'s Studio</p>
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="text-xs text-amber-400 font-bold px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20"
        >
          Marketplace
        </Link>
      </div>

      {/* Mobile Slide-Over Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-4/5 max-w-xs h-full bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-5 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">MEMORA Studio</h4>
                    <span className="text-[10px] text-amber-400 font-semibold">17 Studio Modules</span>
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
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
              <Link to="/" className="flex items-center gap-2 text-amber-400 font-bold hover:underline">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex-col justify-between h-screen sticky top-0">
        <div className="overflow-hidden flex flex-col h-full">
          {/* Studio Brand Header */}
          <div className="p-5 border-b border-slate-800 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-3 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
                <Store className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-bold text-white truncate">Studio Partner Hub</h3>
                <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> {user?.name?.split(' ')[0]}'s Studio
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
                  end={item.path === '/seller/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex-shrink-0">
            <p className="font-semibold text-slate-400">Studio Pro v2.0</p>
            <p className="text-[10px] mt-0.5">Platform Commission: 10%</p>
          </div>
        </div>
      </aside>

      {/* Main Studio View Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8 min-w-0">
        <Outlet />
      </main>

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
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
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
