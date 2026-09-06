import React, { useEffect, useState } from 'react';
import {
  Image as ImageIcon,
  Heart,
  Trash2,
  Upload,
  Sparkles,
  X,
  Download,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api, { API_BASE } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { getImageUrl } from '../../utils/imageUrl';

interface IPhotoItem {
  _id?: string;
  id?: string;
  url: string;
  name: string;
  isFavourite?: boolean;
  category:
    | 'uploaded'
    | 'selected'
    | 'used_in_order'
    | 'proof'
    | 'edited'
    | 'raw';
  size?: number;
  createdAt?: string;
}

export const MyPhotos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'favourites' | 'orders'
  >('all');

  const [photos, setPhotos] = useState<IPhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewPhoto, setPreviewPhoto] =
    useState<IPhotoItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { success, error } = useToast();

  const fetchPhotos = async () => {
    try {
      setIsLoading(true);

      const res = await api.get('/photos');

      if (res.data?.success) {
        setPhotos(res.data.photos || []);
      } else {
        setPhotos([]);
      }
    } catch (err) {
      console.error('Fetch photos error:', err);
      setPhotos([]);
      error('Failed to load your photos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    try {
      setIsUploading(true);

      const token = localStorage.getItem('memora_token');

      if (!token) {
        error('Please login again before uploading photos.');
        return;
      }

      let uploadedCount = 0;
      let failedCount = 0;

      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          failedCount += 1;
          continue;
        }

        const formData = new FormData();

        formData.append('file', file, file.name);
        formData.append('category', 'uploaded');

        const response = await fetch(`${API_BASE}/upload/single`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        let result: {
          success?: boolean;
          message?: string;
        } = {};

        try {
          result = await response.json();
        } catch {
          result = {
            success: false,
            message: 'Invalid server response.',
          };
        }

        if (response.ok && result.success) {
          uploadedCount += 1;
        } else {
          failedCount += 1;

          console.error(
            `Upload failed for ${file.name}:`,
            result.message
          );
        }
      }

      if (uploadedCount > 0) {
        success(
          `${uploadedCount} photo${
            uploadedCount > 1 ? 's' : ''
          } uploaded successfully to your cloud photo vault.`
        );

        await fetchPhotos();
      }

      if (failedCount > 0) {
        error(
          `${failedCount} photo${
            failedCount > 1 ? 's' : ''
          } could not be uploaded.`
        );
      }

      if (uploadedCount === 0 && failedCount === 0) {
        error('No valid image files selected.');
      }
    } catch (err: any) {
      console.error('Photo upload error:', err);

      error(
        err?.message ||
          'Failed to upload photos. Please try again.'
      );
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const toggleFavourite = async (photo: IPhotoItem) => {
    const photoId = photo._id || photo.id;

    if (!photoId) {
      return;
    }

    try {
      if (photo._id) {
        await api.put(`/photos/${photo._id}/favourite`);
      }

      setPhotos((prev) =>
        prev.map((item) =>
          (item._id || item.id) === photoId
            ? {
                ...item,
                isFavourite: !item.isFavourite,
              }
            : item
        )
      );

      setPreviewPhoto((prev) => {
        if (!prev) {
          return prev;
        }

        if ((prev._id || prev.id) !== photoId) {
          return prev;
        }

        return {
          ...prev,
          isFavourite: !prev.isFavourite,
        };
      });

      success(
        photo.isFavourite
          ? 'Removed from favourites.'
          : 'Added to favourites.'
      );
    } catch (err: any) {
      console.error('Favourite update error:', err);

      error(
        err?.response?.data?.message ||
          'Failed to update favourite status.'
      );
    }
  };

  const deletePhoto = async (photo: IPhotoItem) => {
    const photoId = photo._id || photo.id;

    if (!photoId) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${photo.name}" from your cloud photo vault?`
    );

    if (!confirmed) {
      return;
    }

    try {
      if (photo._id) {
        await api.delete(`/photos/${photo._id}`);
      }

      setPhotos((prev) =>
        prev.filter(
          (item) => (item._id || item.id) !== photoId
        )
      );

      setPreviewPhoto(null);

      success('Photo removed from your cloud vault.');
    } catch (err: any) {
      console.error('Delete photo error:', err);

      error(
        err?.response?.data?.message ||
          'Failed to delete photo.'
      );
    }
  };

  const handleDownload = async (photo: IPhotoItem) => {
    try {
      let downloadUrl = photo.url;

      if (photo._id) {
        const res = await api.get(
          `/photos/${photo._id}/download`
        );

        if (res.data?.success && res.data?.downloadUrl) {
          downloadUrl = res.data.downloadUrl;
        }
      }

      const anchor = document.createElement('a');

      anchor.href = downloadUrl;
      anchor.target = '_blank';
      anchor.rel = 'noreferrer';
      anchor.download = photo.name;

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (err: any) {
      console.error('Download error:', err);

      error(
        err?.response?.data?.message ||
          'Failed to generate download link.'
      );
    }
  };

  const filteredPhotos = photos.filter((photo) => {
    if (activeTab === 'favourites') {
      return photo.isFavourite;
    }

    if (activeTab === 'orders') {
      return photo.category === 'used_in_order';
    }

    return true;
  });

  const favouriteCount = photos.filter(
    (photo) => photo.isFavourite
  ).length;

  const orderPhotoCount = photos.filter(
    (photo) => photo.category === 'used_in_order'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            CUSTOMER CLOUD PHOTO VAULT
          </div>

          <h1 className="text-3xl font-black text-slate-900 font-serif">
            Personal Photo Library
          </h1>

          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-3xl">
            Store, preview, and organize your high-resolution photos
            for frames, canvas prints and albums.
          </p>
        </div>

        {/* Upload */}
        <label className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-6 py-3 rounded-2xl cursor-pointer shadow-lg shadow-amber-500/20 transition-all text-xs">
          <Upload className="w-4 h-4" />

          <span>
            {isUploading
              ? 'Uploading to Cloud...'
              : 'Upload High-Res Photos'}
          </span>

          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/heic"
            className="hidden"
            disabled={isUploading}
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-3 font-bold text-xs border-b-2 transition whitespace-nowrap ${
            activeTab === 'all'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          All Photos ({photos.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('favourites')}
          className={`px-4 py-3 font-bold text-xs border-b-2 transition whitespace-nowrap ${
            activeTab === 'favourites'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Favourites ({favouriteCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-3 font-bold text-xs border-b-2 transition whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Used in Keepsakes ({orderPhotoCount})
        </button>
      </div>

      {/* Photo Grid */}
      {isLoading ? (
        <div className="text-center py-24">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />

          <p className="text-xs text-slate-500 font-semibold">
            Loading your cloud photo vault...
          </p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>

          <h3 className="text-base font-bold text-slate-900">
            No photos in this section
          </h3>

          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Upload your photos to store them securely and use them
            for MEMORA products and photoshoots.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo._id || photo.id}
              className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div
                className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer"
                onClick={() => setPreviewPhoto(photo)}
              >
                <img
                  src={getImageUrl(photo.url)}
                  alt={photo.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavourite(photo);
                  }}
                  className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition ${
                    photo.isFavourite
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/80 text-slate-700 hover:text-rose-500'
                  }`}
                  aria-label="Toggle favourite"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      photo.isFavourite ? 'fill-current' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="p-3">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {photo.name}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>
                    {photo.size
                      ? `${(
                          photo.size /
                          (1024 * 1024)
                        ).toFixed(1)} MB`
                      : 'High-Res'}
                  </span>

                  <button
                    type="button"
                    onClick={() => deletePhoto(photo)}
                    className="text-slate-400 hover:text-rose-500 transition"
                    title="Delete Photo"
                    aria-label="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
              <h3 className="text-xs sm:text-sm font-bold truncate pr-4">
                {previewPhoto.name}
              </h3>

              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={getImageUrl(previewPhoto.url)}
                alt={previewPhoto.name}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    toggleFavourite(previewPhoto)
                  }
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition ${
                    previewPhoto.isFavourite
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      previewPhoto.isFavourite
                        ? 'fill-current'
                        : ''
                    }`}
                  />

                  <span>
                    {previewPhoto.isFavourite
                      ? 'Favourited'
                      : 'Add to Favourites'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDownload(previewPhoto)
                  }
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>

              <Link
                to="/products"
                onClick={() => setPreviewPhoto(null)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Print in Teak Frame</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};