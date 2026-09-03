import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Camera, Sparkles } from 'lucide-react';
import api from '../../api/client';
import { IPhotoshootCategory } from '../../types';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<IPhotoshootCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Categories error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Specialized Photoshoot Disciplines</span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">Photoshoot Categories</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore tailored packages for weddings, traditional puberty rituals, newborn wonders, and portraits
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/studios?category=${cat.slug}`}
              className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-56 bg-slate-950 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-base font-bold font-serif">{cat.name}</h3>
                  <span className="text-[10px] text-amber-400 font-semibold">
                    {cat.packageCount ? `${cat.packageCount} Packages Available` : 'Explore Studios'}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 leading-relaxed">{cat.description}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700">
                  <span>Browse Studios</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
