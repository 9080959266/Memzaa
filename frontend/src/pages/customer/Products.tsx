import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  Heart, 
  ShoppingBag, 
  Layers, 
  Star, 
  Check 
} from 'lucide-react';
import api from '../../api/client';
import { IProduct } from '../../types';
import { ProductCustomizerModal } from '../../components/customer/ProductCustomizerModal';
import { useWishlist } from '../../context/WishlistContext';

const PRODUCT_CATEGORIES = [
  'All',
  'Photo Prints',
  'Frames',
  'Albums',
  'Photo Books',
  'Canvas Prints',
  'Calendars',
  'Mugs',
  'Cushions',
  'Keychains',
  'Personalized Gifts'
];

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');
  const [isLoading, setIsLoading] = useState(true);

  // Customizer modal
  const [customizingProduct, setCustomizingProduct] = useState<IProduct | null>(null);

  const { toggleProduct, isProductInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (search) params.append('search', search);
        params.append('sort', sort);

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Products fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, search, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Custom Keepsakes & Wall Art</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">Photo Store & Personalized Gifts</h1>
          <p className="text-xs text-slate-500 mt-1">
            Archival printing, solid teak frames, flush albums, magic mugs, and personalized home decor
          </p>
        </div>
      </div>

      {/* Category Tabs & Filter Toolbar */}
      <div className="space-y-4">
        {/* Horizontal Categories Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap border transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search and Sort Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search frames, magic mugs, canvas wraps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading photo gifts catalog...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <h3 className="text-base font-bold text-slate-900">No Products in this Category</h3>
          <p className="text-xs text-slate-500">Explore other photo product categories like Frames or Mugs.</p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {products.map((prod) => {
            const basePrice = prod.discountPrice || prod.basePrice;
            const inWishlist = isProductInWishlist(prod._id);

            return (
              <div
                key={prod._id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-60 bg-slate-100 overflow-hidden">
                    <img
                      src={prod.thumbnail}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/20">
                      {prod.category}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleProduct(prod._id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
                        inWishlist ? 'bg-rose-500 text-white' : 'bg-black/40 text-white hover:bg-white hover:text-rose-500'
                      }`}
                      title="Save Item"
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5">
                    <Link to={`/products/${prod.slug}`}>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition line-clamp-1">
                        {prod.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="flex items-center gap-1.5 mt-3 text-[11px] text-amber-700 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Live 3D Customizer Available</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                  <div>
                    <span className="text-base font-black text-slate-900">₹{basePrice.toLocaleString('en-IN')}</span>
                    {prod.discountPrice && (
                      <span className="text-xs text-slate-400 line-through ml-1.5 font-normal">
                        ₹{prod.basePrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCustomizingProduct(prod)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Customize Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customizer Modal */}
      {customizingProduct && (
        <ProductCustomizerModal
          isOpen={!!customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          product={customizingProduct}
        />
      )}
    </div>
  );
};
