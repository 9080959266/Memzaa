import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
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
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Overview & KPIs', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Studio Verification', path: '/admin/studios', icon: Store, badge: 'Queue' },
    { name: 'Photoshoot Categories', path: '/admin/categories', icon: Layers },
    { name: 'Coupons & Promos', path: '/admin/coupons', icon: Tag },
    { name: 'Platform Users', path: '/admin/users', icon: Users },
    { name: 'Customer Complaints', path: '/admin/complaints', icon: MessageSquare },
    { name: 'Reports & Revenue', path: '/admin/reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-800">
            <Link to="/" className="flex items-center gap-2.5 text-xs text-purple-400 font-semibold mb-3 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-600/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Super Admin</h3>
                <span className="text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> MEMORA Master Portal
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
                  end={item.path === '/admin/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
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
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          <p className="font-semibold text-slate-400">MEMORA Governance v1.0</p>
          <p className="text-[10px] mt-0.5">Platform Commission: 10%</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};
