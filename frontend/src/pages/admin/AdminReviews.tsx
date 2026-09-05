import React, { useState, useEffect } from 'react';
import { Star, Search, User } from 'lucide-react';
import api from '../../api/client';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/reviews');
      if (res.data.success) {
        setReviews(res.data.reviews || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (id: string, currentApproved: boolean) => {
    try {
      await api.put(`/admin/reviews/${id}/moderate`, { isApproved: !currentApproved });
      fetchReviews();
    } catch (err) {
      alert('Failed to update review status');
    }
  };

  const filtered = reviews.filter((r) => {
    return (
      r.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Quality & Feedback</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Platform Customer Reviews</h1>
          <p className="text-xs text-slate-400 mt-0.5">Verified ratings, feedback on studios, and service quality monitoring</p>
        </div>
      </div>

      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews by customer or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-24">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-semibold">Loading verified reviews...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 text-xs text-slate-400">
          No customer reviews on file yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((rev) => (
            <div key={rev._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-purple-600/20 text-purple-300 font-bold flex items-center justify-center text-xs">
                    {rev.userId?.name?.[0] || 'C'}
                  </div>
                  <div>
                    <strong className="text-white text-xs block">{rev.userId?.name || 'Customer'}</strong>
                    <span className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full text-amber-400 font-black text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{rev.rating || 5}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{rev.comment || 'Amazing photography service and exceptional photo album quality!'}"
              </p>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  rev.isApproved !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {rev.isApproved !== false ? 'Published' : 'Hidden'}
                </span>
                <button
                  type="button"
                  onClick={() => handleModerate(rev._id, rev.isApproved !== false)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    rev.isApproved !== false
                      ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                  }`}
                >
                  {rev.isApproved !== false ? 'Hide Review' : 'Approve & Publish'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
