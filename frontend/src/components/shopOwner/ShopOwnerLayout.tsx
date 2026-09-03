import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
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
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ShopOwnerLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard Overview', path: '/seller/dashboard', icon: LayoutDashboard },
    { name: 'Kanban Photo Jobs', path: '/seller/kanban', icon: Kanban, badge: 'Live' },
    { name: 'Photoshoot Bookings', path: '/seller/bookings', icon: Calendar },
    { name: 'Studio Profile & Portfolio', path: '/seller/studio', icon: Camera },
    { name: 'Packages & Pricing', path: '/seller/packages', icon: Layers },
    { name: 'Proof Approvals', path: '/seller/proofs', icon: ImageIcon },
    { name: 'Product Inventory', path: '/seller/inventory', icon: Box },
    { name: 'Revenue & Analytics', path: '/seller/revenue', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Studio Brand Header */}
          <div className="p-6 border-b border-slate-800">
            <Link to="/" className="flex items-center gap-2.5 text-xs text-amber-400 font-semibold mb-3 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
                <Store className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-bold text-white truncate">Studio Partner Hub</h3>
                <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> {user?.name.split(' ')[0]}'s Studio
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/seller/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
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
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          <p className="font-semibold text-slate-400">MEMORA Seller Engine v1.0</p>
          <p className="text-[10px] mt-0.5">Razorpay & Pan-India Dispatch</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};
