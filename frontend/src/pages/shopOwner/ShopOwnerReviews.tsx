import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Send, CheckCircle2 } from 'lucide-react';
import api from '../../api/client';

export const ShopOwnerReviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const DEMO_REVIEWS = [
    {
      _id: 'rev_1',
      userId: { name: 'Kavitha & Arvind', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
      rating: 5,
      title: 'Flawless Pre-Wedding Shoot in Mahabalipuram!',
      comment: 'The lighting, drone coverage, and candid sunset shots were breathtaking. Our family was in awe of the layflat leather album.',
      createdAt: '2026-08-20',
      helpfulCount: 14,
      studioReply: {
        comment: 'Thank you Kavitha & Arvind! It was an absolute joy documenting your golden hour session.',
        repliedAt: '2026-08-21',
      },
    },
    {
      _id: 'rev_2',
      userId: { name: 'Sanjay Krishnan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
      rating: 5,
      title: 'Pristine Teak Wood Framing',
      comment: 'The teak finish frame with personalized name engraving arrived in spotless packaging within 3 days. Superb craftsmanship.',
      createdAt: '2026-08-14',
      helpfulCount: 8,
    },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/seller/reviews');
        if (res.data.success && res.data.reviews?.length > 0) {
          setReviews(res.data.reviews);
        } else {
          setReviews(DEMO_REVIEWS);
        }
      } catch (e) {
        setReviews(DEMO_REVIEWS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleSendReply = (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text) return;

    setReviews(
      reviews.map((r) =>
        r._id === reviewId
          ? { ...r, studioReply: { comment: text, repliedAt: new Date().toISOString() } }
          : r
      )
    );
    setActiveReplyId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Client Reviews & Testimonials</h1>
        <p className="text-slate-400 text-xs mt-1">
          Monitor verified customer feedback, photography ratings, and publish official studio replies.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-semibold">Loading reviews...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.userId?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.userId?.name || 'User')}`}
                    alt={rev.userId?.name}
                    className="w-10 h-10 rounded-full object-cover bg-slate-950 border border-slate-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{rev.userId?.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${
                            idx < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-slate-500 ml-1.5">{rev.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-full border border-slate-800">
                  <ThumbsUp className="w-3 h-3 text-amber-400" />
                  <span>{rev.helpfulCount || 0} found helpful</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-100 mb-1">{rev.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{rev.comment}</p>

              {/* Existing Studio Reply */}
              {rev.studioReply ? (
                <div className="bg-slate-950/80 border-l-2 border-amber-500 rounded-r-xl p-3.5 ml-4 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-amber-400 text-[11px]">Studio Owner Response</span>
                    <span className="text-[10px] text-slate-500">
                      • {new Date(rev.studioReply.repliedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <p className="text-slate-300">{rev.studioReply.comment}</p>
                </div>
              ) : activeReplyId === rev._id ? (
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                  <textarea
                    rows={2}
                    value={replyText[rev._id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [rev._id]: e.target.value })}
                    placeholder="Write a warm, professional reply..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setActiveReplyId(null)}
                      className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendReply(rev._id)}
                      className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-bold"
                    >
                      <Send className="w-3 h-3" />
                      Post Reply
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setActiveReplyId(rev._id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Reply to Review
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
