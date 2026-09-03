import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Layers, Calendar, ShoppingBag, Clock, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const MobileNav: React.FC = () => {
  const { cartCount } = useCart();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Categories', path: '/categories', icon: Layers },
    { name: 'Bookings', path: '/bookings', icon: Calendar },
    { name: 'Cart', path: '/cart', icon: ShoppingBag, badge: cartCount },
    { name: 'Orders', path: '/orders', icon: Clock },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center py-1.5 px-2 rounded-xl transition ${
                  isActive
                    ? 'text-amber-600 font-bold'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
