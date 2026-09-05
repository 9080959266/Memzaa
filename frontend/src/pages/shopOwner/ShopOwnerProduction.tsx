import React, { useState } from 'react';
import { CheckSquare, Square, Printer, ShieldCheck, Box, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface IProductionItem {
  id: string;
  orderId: string;
  productTitle: string;
  customerName: string;
  frameStyle: string;
  paperType: string;
  checkpoints: {
    dpiVerified: boolean;
    colorCalibrated: boolean;
    mouldingCutMitered: boolean;
    glassCleaned: boolean;
    sealBubbleWrapped: boolean;
  };
  stage: 'PRINTING' | 'QUALITY_CHECK' | 'READY_FOR_COURIER';
}

export const ShopOwnerProduction: React.FC = () => {
  const [items, setItems] = useState<IProductionItem[]>([
    {
      id: 'prod_1',
      orderId: 'MEM-ORD-8821',
      productTitle: '12x18 Solid Teak Wood Frame',
      customerName: 'Aarav Sharma',
      frameStyle: 'Solid Teak Wood (Natural Gloss)',
      paperType: '300 GSM Archival Luster Finish',
      checkpoints: {
        dpiVerified: true,
        colorCalibrated: true,
        mouldingCutMitered: true,
        glassCleaned: false,
        sealBubbleWrapped: false,
      },
      stage: 'PRINTING',
    },
    {
      id: 'prod_2',
      orderId: 'MEM-ORD-7492',
      productTitle: '12x36 Layflat Panoramic Wedding Album',
      customerName: 'Pooja Sundaram',
      frameStyle: 'Royal Velvet Hardcover (Crimson Red)',
      paperType: 'Fuji Crystal Archive HD Paper',
      checkpoints: {
        dpiVerified: true,
        colorCalibrated: true,
        mouldingCutMitered: true,
        glassCleaned: true,
        sealBubbleWrapped: true,
      },
      stage: 'QUALITY_CHECK',
    },
  ]);

  const toggleCheckpoint = (itemId: string, key: keyof IProductionItem['checkpoints']) => {
    setItems(
      items.map((it) => {
        if (it.id !== itemId) return it;
        const updated = { ...it.checkpoints, [key]: !it.checkpoints[key] };
        const allDone = Object.values(updated).every(Boolean);
        return {
          ...it,
          checkpoints: updated,
          stage: allDone ? 'READY_FOR_COURIER' : 'QUALITY_CHECK',
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Workshop Printing & QC Inspection</h1>
        <p className="text-slate-400 text-xs mt-1">
          Perform rigorous 5-point quality checklist before signing off keepsakes for Blue Dart air shipping.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {items.map((it) => {
          const completedCount = Object.values(it.checkpoints).filter(Boolean).length;
          const isComplete = completedCount === 5;

          return (
            <div key={it.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-black text-amber-400">{it.orderId}</span>
                  <h3 className="text-base font-extrabold text-white">{it.productTitle}</h3>
                  <p className="text-xs text-slate-400">Client: {it.customerName}</p>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                    isComplete
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {it.stage.replace(/_/g, ' ')}
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-3 text-xs space-y-1">
                <p className="text-slate-400">
                  <span className="text-slate-500 font-semibold">Finish:</span> {it.frameStyle}
                </p>
                <p className="text-slate-400">
                  <span className="text-slate-500 font-semibold">Paper:</span> {it.paperType}
                </p>
              </div>

              {/* 5-Point Quality Control Checklist */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-white block">
                  Mandatory QC Checklist ({completedCount}/5):
                </span>

                {[
                  { key: 'dpiVerified', label: '1. Verified High-Res 300 DPI file resolution' },
                  { key: 'colorCalibrated', label: '2. Adobe RGB 1998 studio color calibration match' },
                  { key: 'mouldingCutMitered', label: '3. Precise 45° miter joint & seamless corner assembly' },
                  { key: 'glassCleaned', label: '4. Anti-reflective acrylic glass buffed & lint-free' },
                  { key: 'sealBubbleWrapped', label: '5. Dual-layer shockproof bubble wrap & MEMORA shipping box' },
                ].map((chk) => {
                  const checked = (it.checkpoints as any)[chk.key];
                  return (
                    <button
                      key={chk.key}
                      onClick={() => toggleCheckpoint(it.id, chk.key as any)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left text-xs transition border ${
                        checked
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      )}
                      <span className={checked ? 'line-through text-slate-400 font-medium' : 'font-semibold'}>
                        {chk.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {isComplete && (
                <div className="pt-2">
                  <button
                    onClick={() => alert(`Order ${it.orderId} stamped as QC Approved and moved to Out for Delivery!`)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Stamp QC Passed & Ready for Blue Dart Dispatch</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
