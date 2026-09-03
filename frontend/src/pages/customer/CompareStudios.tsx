import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Check, X, Star, MapPin, Sparkles, Camera, ArrowLeft } from 'lucide-react';
import api from '../../api/client';

export const CompareStudios: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ids = searchParams.get('ids');

  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        setIsLoading(true);
        const queryIds = ids || '679c112233445566778899aa,679c112233445566778899ab'; // fallback or dynamic
        const res = await api.get(`/studios/compare?ids=${queryIds}`);
        if (res.data.success) {
          setComparisonData(res.data.comparison || []);
        }
      } catch (err) {
        console.error('Compare error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComparison();
  }, [ids]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/studios" className="flex items-center gap-1.5 text-xs text-amber-600 font-bold mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Studios
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Side-by-Side Studio Comparison</h1>
          <p className="text-xs text-slate-500 mt-1">Compare amenities, equipment, pricing, deliverables, and rating</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Generating studio matrix...</p>
        </div>
      ) : comparisonData.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <p className="text-xs text-slate-500 mb-4">No studios selected for comparison.</p>
          <Link to="/studios" className="bg-amber-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl">
            Select Studios to Compare
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200/80 shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="p-4 w-48 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Studio Matrix</th>
                {comparisonData.map((item) => (
                  <th key={item.studio._id} className="p-4 min-w-[260px] max-w-[320px]">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.studio.logoImage}
                        alt={item.studio.name}
                        className="w-12 h-12 rounded-xl object-cover border border-amber-500 shadow-sm"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.studio.name}</h4>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-600" /> {item.studio.city}
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Rating */}
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Client Rating</td>
                {comparisonData.map((item) => (
                  <td key={item.studio._id} className="p-4">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-amber-500">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{item.studio.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-400 font-normal">({item.studio.reviewCount} reviews)</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Starting Price */}
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Starting Session Price</td>
                {comparisonData.map((item) => (
                  <td key={item.studio._id} className="p-4">
                    <span className="text-base font-black text-slate-900">
                      ₹{item.studio.startingPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">Price Range: {item.studio.priceRange}</span>
                  </td>
                ))}
              </tr>

              {/* Total Packages */}
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Available Packages</td>
                {comparisonData.map((item) => (
                  <td key={item.studio._id} className="p-4 font-semibold text-slate-800">
                    {item.packageCount} Photoshoot Packages listed
                  </td>
                ))}
              </tr>

              {/* Key Amenities */}
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Studio Amenities</td>
                {comparisonData.map((item) => (
                  <td key={item.studio._id} className="p-4">
                    <ul className="space-y-1">
                      {item.amenities?.map((a: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-1.5 text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Equipment */}
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Cameras & Lighting</td>
                {comparisonData.map((item) => (
                  <td key={item.studio._id} className="p-4">
                    <ul className="space-y-1">
                      {item.equipment?.map((eq: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-1.5 text-slate-600">
                          <Camera className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span>{eq}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Action Button */}
              <tr>
                <td className="p-4 bg-slate-50/50" />
                {comparisonData.map((item) => (
                  <td key={item.studio._id} className="p-4">
                    <Link
                      to={`/studios/${item.studio._id}`}
                      className="inline-block w-full text-center bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs py-2.5 rounded-xl transition"
                    >
                      View Studio Profile
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
