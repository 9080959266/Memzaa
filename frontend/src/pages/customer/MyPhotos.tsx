import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Heart, Trash2, Upload, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IPhotoItem {
  id: string;
  url: string;
  name: string;
  isFavourite: boolean;
  category: 'uploaded' | 'selected' | 'used_in_order';
  createdAt: string;
}

export const MyPhotos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'favourites' | 'orders'>('all');
  const [photos, setPhotos] = useState<IPhotoItem[]>([
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      name: 'Wedding Portrait 01.jpg',
      isFavourite: true,
      category: 'used_in_order',
      createdAt: '2026-09-01',
    },
    {
      id: 'p2',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
      name: 'Pre-Wedding Sunset.jpg',
      isFavourite: true,
      category: 'uploaded',
      createdAt: '2026-09-01',
    },
    {
      id: 'p3',
      url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80',
      name: 'Baby Laughing Candid.jpg',
      isFavourite: false,
      category: 'selected',
      createdAt: '2026-08-28',
    },
    {
      id: 'p4',
      url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      name: 'Family Muhurtham.jpg',
      isFavourite: false,
      category: 'used_in_order',
      createdAt: '2026-08-25',
    },
  ]);

  const [previewPhoto, setPreviewPhoto] = useState<IPhotoItem | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newItems: IPhotoItem[] = files.map((file, idx) => ({
      id: `up_${Date.now()}_${idx}`,
      url: URL.createObjectURL(file),
      name: file.name,
      isFavourite: false,
      category: 'uploaded',
      createdAt: new Date().toISOString().split('T')[0],
    }));
    setPhotos([...newItems, ...photos]);
  };

  const toggleFavourite = (id: string) => {
    setPhotos(photos.map((p) => (p.id === id ? { ...p, isFavourite: !p.isFavourite } : p)));
    if (previewPhoto && previewPhoto.id === id) {
      setPreviewPhoto({ ...previewPhoto, isFavourite: !previewPhoto.isFavourite });
    }
  };

  const deletePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
    setPreviewPhoto(null);
  };

  const filteredPhotos = photos.filter((p) => {
    if (activeTab === 'favourites') return p.isFavourite;
    if (activeTab === 'orders') return p.category === 'used_in_order';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            CUSTOMER CLOUD PHOTO VAULT
          </div>
          <h1 className="text-3xl font-black text-white">My Photos Library</h1>
          <p className="text-slate-400 text-sm mt-1">
            Store, preview, and organize your favorite high-res photos to customize teak frames and albums with 1 click.
          </p>
        </div>

        {/* Upload Button */}
        <label className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-6 py-3 rounded-xl cursor-pointer shadow-lg shadow-amber-500/20 transition-all">
          <Upload className="w-4 h-4" />
          <span>Upload High-Res Photos</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6 overflow-x-auto">
        {[
          { key: 'all', label: `All Photos (${photos.length})` },
          { key: 'favourites', label: `Favourites ❤️ (${photos.filter((p) => p.isFavourite).length})` },
          { key: 'orders', label: `Used in Orders 📦 (${photos.filter((p) => p.category === 'used_in_order').length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === t.key
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 font-extrabold'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Photos in this category</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Upload images from your phone or camera to easily customize gifts and layflat albums.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all shadow-lg"
            >
              <div
                className="aspect-square bg-slate-950 cursor-pointer overflow-hidden relative"
                onClick={() => setPreviewPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-[10px] text-white font-medium truncate">{photo.name}</span>
                </div>
              </div>

              {/* Favourite action */}
              <button
                onClick={() => toggleFavourite(photo.id)}
                className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-colors ${
                  photo.isFavourite
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-950/60 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${photo.isFavourite ? 'fill-current' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-white font-bold">{previewPhoto.name}</h3>
                <p className="text-slate-400 text-xs mt-0.5">Uploaded {previewPhoto.createdAt}</p>
              </div>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-96 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center mb-6">
              <img
                src={previewPhoto.url}
                alt={previewPhoto.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleFavourite(previewPhoto.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    previewPhoto.isFavourite
                      ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${previewPhoto.isFavourite ? 'fill-current' : ''}`} />
                  <span>{previewPhoto.isFavourite ? 'Favourited' : 'Mark Favourite'}</span>
                </button>

                <button
                  onClick={() => deletePhoto(previewPhoto.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>

              <Link
                to="/products"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Use in 3D Customizer</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
