import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Store, 
  Search, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Mail,
  AlertTriangle
} from 'lucide-react';
import api from '../../api/client';
import { IUser } from '../../types';
import { Modal } from '../../components/common/Modal';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // User details modal
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'bookings' | 'orders' | 'studio'>('info');

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (roleFilter !== 'All') params.append('role', roleFilter);
      if (statusFilter !== 'All') params.append('status', statusFilter.toLowerCase());
      if (search) params.append('search', search);

      const res = await api.get(`/admin/users?${params.toString()}`);
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
  }, [roleFilter, statusFilter, search]);

  const handleToggleStatus = async (id: string) => {
    try {
      await api.put(`/admin/users/${id}/toggle-status`);
      fetchUsers();
      if (selectedUser && selectedUser._id === id) {
        openUserDetails({ ...selectedUser, isActive: !selectedUser.isActive });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleModerateShopOwner = async (id: string, action: 'approve' | 'reject' | 'suspend' | 'activate') => {
    try {
      await api.put(`/admin/users/${id}/shop-owner-status`, { action });
      fetchUsers();
      if (selectedUser && selectedUser._id === id) {
        openUserDetails(selectedUser);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update shop owner status');
    }
  };

  const openUserDetails = async (user: any) => {
    setSelectedUser(user);
    setActiveTab(user.role === 'shop_owner' ? 'studio' : 'bookings');
    try {
      setIsLoadingDetails(true);
      const res = await api.get(`/admin/users/${user._id}/details`);
      if (res.data.success) {
        setUserDetails(res.data);
      }
    } catch (err) {
      console.error('Failed to load user details:', err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">User Directory</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Customers & Shop Owners</h1>
          <p className="text-xs text-slate-400 mt-0.5">Audit customer accounts, verify shop owners, and inspect bookings & orders</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
            {['All', 'customer', 'shop_owner', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl font-bold transition capitalize ${
                  roleFilter === r ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
            {['All', 'Active', 'Inactive'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  statusFilter === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading users directory...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 text-xs text-slate-400">
          No users found matching your criteria.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
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
                      <h4 className="font-bold text-white flex items-center gap-1.5">
                        {u.name}
                        {u.isVerified && (
                          <span className="text-[10px] text-emerald-400" title="Verified Account">✓</span>
                        )}
                      </h4>
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
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.isActive !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {u.isActive !== false ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => openUserDetails(u)}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-purple-400" /> Details
                    </button>
                    {u.role !== 'admin' && (
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
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Details & Activity Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`${selectedUser.name} (${selectedUser.role.replace('_', ' ')})`}
          subtitle={`Account created on ${new Date(selectedUser.createdAt).toLocaleDateString('en-IN')}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            {/* User overview strip */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedUser.name)}`}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border border-purple-500"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedUser.name}</h4>
                  <p className="text-slate-400">{selectedUser.email} • {selectedUser.phone || 'No phone'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedUser.isActive !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {selectedUser.isActive !== false ? 'Account Active' : 'Account Deactivated'}
                    </span>
                    {selectedUser.isVerified && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Shop Owner Moderation Actions */}
              {selectedUser.role === 'shop_owner' && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleModerateShopOwner(selectedUser._id, 'approve')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModerateShopOwner(selectedUser._id, 'suspend')}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Suspend
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModerateShopOwner(selectedUser._id, 'reject')}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'bookings' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> Customer Bookings ({userDetails?.bookings?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'orders' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Orders Placed ({userDetails?.orders?.length || 0})
              </button>
              {selectedUser.role === 'shop_owner' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('studio')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'studio' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" /> Studio Details
                </button>
              )}
            </div>

            {isLoadingDetails ? (
              <div className="text-center py-10">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-slate-400 text-xs">Loading activity ledger...</p>
              </div>
            ) : (
              <div>
                {/* Bookings View */}
                {activeTab === 'bookings' && (
                  <div className="space-y-2">
                    {(!userDetails?.bookings || userDetails.bookings.length === 0) ? (
                      <p className="text-slate-500 py-6 text-center">No photoshoot bookings found for this customer.</p>
                    ) : (
                      userDetails.bookings.map((b: any) => (
                        <div key={b._id} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-purple-400 font-bold">#{b.bookingId}</span>
                              <span className="text-white font-semibold">{b.packageId?.title || b.photoshootType}</span>
                            </div>
                            <p className="text-slate-400 text-[11px] mt-0.5">
                              Studio: {b.studioId?.name} • Date: {new Date(b.eventDate || b.bookingDate).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-white block">₹{b.totalAmount || b.advanceAmount}</span>
                            <span className="text-[10px] font-bold uppercase text-purple-400">{b.bookingStatus}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Orders View */}
                {activeTab === 'orders' && (
                  <div className="space-y-2">
                    {(!userDetails?.orders || userDetails.orders.length === 0) ? (
                      <p className="text-slate-500 py-6 text-center">No keepsake physical orders placed by this customer.</p>
                    ) : (
                      userDetails.orders.map((o: any) => (
                        <div key={o._id} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
                          <div>
                            <span className="font-mono text-amber-400 font-bold">#{o.orderId}</span>
                            <p className="text-slate-300 text-[11px] mt-0.5">
                              {o.items?.length || 1} Item(s) • Status: <strong className="text-white">{o.currentStatus}</strong>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-white block">₹{o.totalAmount?.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] font-bold uppercase text-emerald-400">{o.paymentStatus}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Studio View (for Shop Owners) */}
                {activeTab === 'studio' && (
                  <div className="space-y-3">
                    {!userDetails?.studio ? (
                      <p className="text-slate-500 py-6 text-center">No studio registered yet for this shop owner.</p>
                    ) : (
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={userDetails.studio.logoImage || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-purple-500"
                          />
                          <div>
                            <h4 className="font-bold text-white text-sm">{userDetails.studio.name}</h4>
                            <p className="text-slate-400 text-[11px]">{userDetails.studio.tagline}</p>
                            <span className="text-[10px] text-amber-400 font-semibold">
                              {userDetails.studio.city} • Starting ₹{userDetails.studio.startingPrice}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                          <div>
                            <span className="text-slate-500 font-bold block">Verification Status</span>
                            <span className={`font-black uppercase ${
                              userDetails.studio.verifiedStatus === 'approved' ? 'text-emerald-400' : 'text-amber-400'
                            }`}>
                              {userDetails.studio.verifiedStatus}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold block">Active Listing</span>
                            <span className={`font-black ${
                              userDetails.studio.isActive !== false ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {userDetails.studio.isActive !== false ? 'Active' : 'Suspended'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

