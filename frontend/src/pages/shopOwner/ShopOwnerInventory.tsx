import React, { useState, useEffect } from 'react';
import { Box, AlertTriangle, Plus, CheckCircle2, RefreshCw } from 'lucide-react';
import api from '../../api/client';
import { IProduct } from '../../types';

export const ShopOwnerInventory: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/products');
      if (res.data.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error('Inventory fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      await api.put(`/products/${id}`, { stock: newStock });
      setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p));
    } catch (err) {
      alert('Failed to update stock');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Product Catalog & Stock</span>
        <h1 className="text-2xl font-serif font-bold text-white mt-1">Inventory Management</h1>
        <p className="text-xs text-slate-400 mt-0.5">Track and update stock counts for personalized frames, albums, and mugs</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-semibold">Loading inventory...</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
                <th className="p-4">Product Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.thumbnail} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-800" />
                    <div>
                      <h4 className="font-bold text-white">{p.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {p.slug}</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-400">{p.category}</td>
                  <td className="p-4 font-bold text-white font-mono">₹{p.basePrice}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.stock <= 10 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {p.stock} units {p.stock <= 10 ? '(Low Stock)' : ''}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStock(p._id, Math.max(0, p.stock - 5))}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-xs"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStock(p._id, p.stock + 10)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs"
                    >
                      +10 Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
