import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Layers, Camera, Clock, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Categories', path: '/categories', icon: Layers },
    { name: 'Photoshoot', path: '/bookings', icon: Camera },
    { name: 'My Orders', path: '/orders', icon: Clock },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                aria-label={item.name}
                className={({ isActive }) =>
                  `relative flex flex-col items-center justify-center min-w-[64px] py-1.5 px-2 rounded-xl transition cursor-pointer ${
                    isActive
                      ? 'text-amber-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900 font-medium'
                  }`
                }
              >
                <Icon className="w-5 h-5" />

                <span className="text-[10px] mt-1 tracking-tight">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
