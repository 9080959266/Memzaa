import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Store, UserCheck, UserX } from 'lucide-react';
import api from '../../api/client';
import { IUser } from '../../types';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(roleFilter === 'All' ? '/admin/users' : `/admin/users?role=${roleFilter}`);
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.error('Users fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleStatus = async (id: string) => {
    try {
      await api.put(`/admin/users/${id}/toggle-status`);
      fetchUsers();
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">User Directory</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Registered Users & Roles</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage customer profiles, studio owners, and administrator accounts</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
          {['All', 'customer', 'shop_owner', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                roleFilter === r ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Joined</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {users.map((u: any) => (
              <tr key={u._id} className="hover:bg-slate-800/40 transition">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover border border-purple-500"
                  />
                  <div>
                    <h4 className="font-bold text-white">{u.name}</h4>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    u.role === 'admin'
                      ? 'bg-purple-500/20 text-purple-300'
                      : u.role === 'shop_owner'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {u.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-slate-400">{u.phone || 'N/A'}</td>
                <td className="p-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(u._id)}
                    className={`font-bold px-3 py-1.5 rounded-xl text-xs transition ${
                      u.isActive !== false
                        ? 'bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white'
                        : 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white'
                    }`}
                  >
                    {u.isActive !== false ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
