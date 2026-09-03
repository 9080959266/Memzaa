import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  MapPin, 
  Star, 
  Layers, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import api from '../../api/client';
import { IStudio, IPhotoshootCategory } from '../../types';
import { StudioCard } from '../../components/customer/StudioCard';

export const Studios: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [studios, setStudios] = useState<IStudio[]>([]);
  const [categories, setCategories] = useState<IPhotoshootCategory[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedRating, setSelectedRating] = useState(searchParams.get('rating') || '');
  const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || '');
  const [sort, setSort] = useState('recommended');

  // Studio Comparison Selection
  const [comparedStudioIds, setComparedStudioIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (selectedCity !== 'All') params.append('city', selectedCity);
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (selectedRating) params.append('rating', selectedRating);
        if (priceRange) params.append('priceRange', priceRange);
        params.append('sort', sort);

        const [res, catRes] = await Promise.all([
          api.get(`/studios?${params.toString()}`),
          api.get('/categories')
        ]);

        if (res.data.success) {
          setStudios(res.data.studios);
          setCities(res.data.cities || ['Chennai', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad']);
        }
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
        }
      } catch (err) {
        console.error('Failed to fetch studios:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudios();
  }, [search, selectedCity, selectedCategory, selectedRating, priceRange, sort]);

  const handleCompareToggle = (id: string) => {
    setComparedStudioIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 studios simultaneously.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCity('All');
    setSelectedCategory('All');
    setSelectedRating('');
    setPriceRange('');
    setSort('recommended');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Verified Professional Directory</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">Explore Photo Studios</h1>
          <p className="text-xs text-slate-500 mt-1">Browse and book award-winning photo studios across India</p>
        </div>

        {comparedStudioIds.length > 0 && (
          <button
            onClick={() => navigate(`/compare?ids=${comparedStudioIds.join(',')}`)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md flex items-center gap-2 self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" /> Compare {comparedStudioIds.length} Studios <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search studio name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
            />
          </div>

          {/* City */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-amber-500 outline-none cursor-pointer"
            >
              <option value="All">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Category */}
          <div className="relative">
            <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-amber-500 outline-none cursor-pointer"
            >
              <option value="All">All Photoshoot Types</option>
              {categories.map(cat => <option key={cat.slug} value={cat.slug}>{cat.name}</option>)}
            </select>
          </div>

          {/* Rating */}
          <div className="relative">
            <Star className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-amber-500 outline-none cursor-pointer"
            >
              <option value="">Any Rating</option>
              <option value="4.8">4.8+ Star Studios</option>
              <option value="4.5">4.5+ Star Studios</option>
              <option value="4.0">4.0+ Star Studios</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-amber-500 outline-none cursor-pointer"
            >
              <option value="recommended">Featured & Rating</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newly Listed</option>
            </select>
          </div>
        </div>

        {/* Clear Filters pill */}
        {(search || selectedCity !== 'All' || selectedCategory !== 'All' || selectedRating || priceRange) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Filtering results ({studios.length} studios found)</span>
            <button
              onClick={handleClearFilters}
              className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Studio Cards Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading verified studios...</p>
        </div>
      ) : studios.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Studios Matched Your Search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your filters or search keywords to explore studios across other Indian cities.
          </p>
          <button
            onClick={handleClearFilters}
            className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => (
            <StudioCard
              key={studio._id}
              studio={studio}
              onCompareToggle={handleCompareToggle}
              isCompared={comparedStudioIds.includes(studio._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
