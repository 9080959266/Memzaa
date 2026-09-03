import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Sparkles, 
  Type, 
  Calendar, 
  Palette, 
  ShoppingBag, 
  Check, 
  RotateCw, 
  ZoomIn, 
  Heart,
  Layers,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { IProduct } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: IProduct | null;
}

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { addToCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Customization states
  const [userPhoto, setUserPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  );
  const [customText, setCustomText] = useState('Forever & Always');
  const [customName, setCustomName] = useState('Aarav & Priya');
  const [customDate, setCustomDate] = useState('15.10.2024');
  const [selectedFrameColor, setSelectedFrameColor] = useState('Natural Teak');
  const [selectedSize, setSelectedSize] = useState('Standard (8x10 in)');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) return null;

  const frameColors = product.customizationOptions?.frameColors || [
    'Natural Teak', 
    'Matte Black', 
    'Royal Gold', 
    'Vintage White'
  ];

  const sizes = product.customizationOptions?.sizes || [
    { name: 'Standard (8x10 in)', priceOffset: 0 },
    { name: 'Medium (12x18 in)', priceOffset: 400 },
    { name: 'Large Gallery (16x24 in)', priceOffset: 900 }
  ];

  const currentSizeObj = sizes.find(s => s.name === selectedSize);
  const sizePriceOffset = currentSizeObj?.priceOffset || 0;
  const basePrice = product.discountPrice || product.basePrice;
  const totalPrice = basePrice + sizePriceOffset;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setUserPhoto(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      const customizationPayload = {
        uploadedPhoto: userPhoto,
        customText,
        customName,
        customDate,
        frameColor: selectedFrameColor,
        size: selectedSize,
        previewMockup: userPhoto
      };

      await addToCart(product._id, 1, customizationPayload);
      setAddedSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        setAddedSuccess(false);
        onClose();
      }, 1400);
    } catch (err: any) {
      alert(err.message || 'Failed to add customized product');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Live Customizer: ${product.title}`}
      subtitle="Design in real-time with your photo, names, date, and bespoke finish"
      maxWidth="4xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Real-Time Live Mockup Canvas */}
        <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[420px] relative overflow-hidden shadow-inner border border-slate-800">
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-amber-400 border border-amber-500/20">
            <Sparkles className="w-3 h-3 text-amber-400" />
            LIVE 3D-STYLE MOCKUP PREVIEW
          </div>

          {/* Render Mockup Container Based on Product Category */}
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] flex items-center justify-center transition-all duration-300">
            {/* Wooden/Metal Frame Styling */}
            <div
              className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-500"
              style={{
                backgroundColor:
                  selectedFrameColor === 'Matte Black'
                    ? '#18181b'
                    : selectedFrameColor === 'Royal Gold'
                    ? '#ca8a04'
                    : selectedFrameColor === 'Vintage White'
                    ? '#f4f4f5'
                    : '#78350f', // Natural Teak
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
              }}
            >
              {/* Inner White Matte Border */}
              <div className="relative w-full h-full bg-white p-2.5 rounded-lg shadow-inner flex flex-col justify-between overflow-hidden">
                {/* User Photo Layer with Zoom Control */}
                <div className="relative w-full flex-1 rounded overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img
                    src={userPhoto}
                    alt="Customized preview"
                    className="w-full h-full object-cover transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />

                  {/* Gradient Overlay for Text Readability */}
                  {(customText || customName) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-center text-white" />
                  )}
                </div>

                {/* Engraved Typography Bottom Plaque */}
                <div className="pt-2 text-center">
                  {customText && (
                    <p className="text-[11px] sm:text-xs font-serif italic text-slate-800 tracking-wide">
                      "{customText}"
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-2 mt-0.5">
                    {customName && (
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                        {customName}
                      </span>
                    )}
                    {customDate && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        • {customDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Zoom and Change Photo Action Bar */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md"
            >
              <Upload className="w-3.5 h-3.5" /> Upload My Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1.5 rounded-xl text-slate-300 text-xs">
              <ZoomIn className="w-3 h-3 text-slate-400" />
              <input
                type="range"
                min="1"
                max="1.8"
                step="0.05"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="w-16 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Customization Form Controls */}
        <div className="lg:col-span-6 space-y-4">
          {/* Frame Finish Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-amber-600" /> Frame Finish / Material
            </label>
            <div className="grid grid-cols-2 gap-2">
              {frameColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedFrameColor(color)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition ${
                    selectedFrameColor === color
                      ? 'bg-amber-50 text-amber-900 border-amber-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{color}</span>
                  {selectedFrameColor === color && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-600" /> Print Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setSelectedSize(s.name)}
                  className={`p-2 rounded-xl text-xs font-semibold border text-center transition ${
                    selectedSize === s.name
                      ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-[11px] leading-tight">{s.name}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {s.priceOffset > 0 ? `+₹${s.priceOffset}` : 'Base'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Quote / Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-amber-600" /> Custom Quote / Message
            </label>
            <input
              type="text"
              value={customText}
              maxLength={40}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Forever & Always, Blessed Family, Happy 1st Birthday"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
            />
          </div>

          {/* Custom Name & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Couple / Recipient Names
              </label>
              <input
                type="text"
                value={customName}
                maxLength={30}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Aarav & Priya"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-600" /> Special Date (Engraved)
              </label>
              <input
                type="text"
                value={customDate}
                maxLength={15}
                onChange={(e) => setCustomDate(e.target.value)}
                placeholder="e.g. 15.10.2024"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Price and Add to Cart Section */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between mt-6">
            <div>
              <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wide block">Total Price (All Inclusive)</span>
              <span className="text-xl font-black text-slate-900">₹{totalPrice.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-emerald-700 font-semibold block">✓ Free Archival Packaging</span>
            </div>

            <button
              type="button"
              disabled={isAdding || addedSuccess}
              onClick={handleAddToCart}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              {addedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-slate-950" />
                  {isAdding ? 'Adding Custom Item...' : 'Add Customized to Cart'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
