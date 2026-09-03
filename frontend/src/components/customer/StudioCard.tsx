import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, ShieldCheck, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { IStudio } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { useWishlist } from '../../context/WishlistContext';

interface StudioCardProps {
  studio: IStudio;
  onBookNow?: (studio: IStudio) => void;
  onCompareToggle?: (studioId: string) => void;
  isCompared?: boolean;
}

export const StudioCard: React.FC<StudioCardProps> = ({
  studio,
  onBookNow,
  onCompareToggle,
  isCompared = false,
}) => {
  const { toggleStudio, isStudioInWishlist } = useWishlist();
  const inWishlist = isStudioInWishlist(studio._id);

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Studio Banner / Portfolio Preview */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
        <img
          src={studio.bannerImage || studio.portfolio[0]?.url || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'}
          alt={studio.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="bg-amber-500/90 backdrop-blur-md text-slate-950 font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
            {studio.verifiedStatus === 'approved' && (
              <span className="bg-slate-900/80 backdrop-blur-md text-emerald-400 font-semibold text-[10px] px-2 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Studio
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleStudio(studio._id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition ${
              inWishlist
                ? 'bg-rose-500 text-white'
                : 'bg-black/40 text-white hover:bg-white hover:text-rose-500'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* City & Rating on Banner Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1 text-xs font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{studio.city}</span>
          </div>

          <div className="flex items-center gap-1 bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-full shadow-md">
            <Star className="w-3.5 h-3.5 fill-slate-950" />
            <span>{studio.rating.toFixed(1)}</span>
            <span className="text-[10px] opacity-80 font-normal">({studio.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/studios/${studio._id}`} className="group-hover:text-amber-600 transition">
            <h3 className="text-base font-bold text-slate-900 line-clamp-1">{studio.name}</h3>
          </Link>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{studio.tagline || studio.description}</p>

          {/* Key Amenities */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {studio.amenities?.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md"
              >
                {amenity}
              </span>
            ))}
            {(studio.amenities?.length || 0) > 3 && (
              <span className="text-[10px] text-slate-400 self-center">
                +{(studio.amenities?.length || 0) - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer with Price & Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium uppercase">Starting From</span>
            <span className="text-base font-black text-slate-900">
              ₹{studio.startingPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onCompareToggle && (
              <button
                type="button"
                onClick={() => onCompareToggle(studio._id)}
                className={`text-[11px] font-semibold px-2.5 py-2 rounded-xl border transition ${
                  isCompared
                    ? 'bg-amber-50 text-amber-700 border-amber-400'
                    : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {isCompared ? 'Comparing' : 'Compare'}
              </button>
            )}

            <Link
              to={`/studios/${studio._id}`}
              className="bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm"
            >
              View Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
