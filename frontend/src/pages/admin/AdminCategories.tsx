import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit3, Sparkles } from 'lucide-react';
import api from '../../api/client';
import { IPhotoshootCategory } from '../../types';
import { Modal } from '../../components/common/Modal';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<IPhotoshootCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New category form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      console.error('Categories error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post('/categories', {
        name,
        description,
        image: image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        featured: true
      });
      setIsModalOpen(false);
      setName('');
      setDescription('');
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Discipline Taxonomy</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Photoshoot Categories</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage photography disciplines, icons, and marketplace tags</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-5 space-y-4">
            <div className="h-40 rounded-2xl overflow-hidden bg-slate-950">
              <img src={cat.image} alt="" className="w-full h-full object-cover" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{cat.name}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Photoshoot Category"
          subtitle="Define category name, description, and cover photo"
          maxWidth="md"
        >
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Drone Cinematography"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
              <textarea
                rows={3}
                required
                placeholder="Short summary of photoshoot style"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md"
              >
                {isSubmitting ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
