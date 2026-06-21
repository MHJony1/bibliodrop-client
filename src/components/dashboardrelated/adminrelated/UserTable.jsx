"use client";

import React, { useState } from 'react';
import { Trash2, Loader2, AlertTriangle, ChevronDown } from 'lucide-react';
import { handleUpdateUserRoleAction, handleDeleteUserAction } from "@/lib/actions/admin";
import Image from 'next/image';

// Role config
const ROLES = ['user', 'librarian', 'admin'];

const roleStyles = {
  admin: {
    badge: 'bg-violet-500/10 border-violet-500/25 text-violet-400',
    dot: 'bg-violet-400',
  },
  librarian: {
    badge: 'bg-blue-500/10 border-blue-500/25 text-blue-400',
    dot: 'bg-blue-400',
  },
  user: {
    badge: 'bg-slate-500/10 border-slate-500/25 text-slate-400',
    dot: 'bg-slate-400',
  },
};

// Avatar initials
const Avatar = ({ name, image }) => {
  const initials = (name || 'A')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (image) {
    return (
      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 relative border border-slate-700">
        <Image
          src={image}
          alt={name || 'User'}
          fill
          className="object-cover"
          sizes="32px"
          onError={(e) => { e.target.style.display = 'none'; }} 
        />
      </div>
    );
  }
}


// Delete Confirm Dialog
const DeleteDialog = ({ user, onConfirm, onCancel, isDeleting }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(0,0,0,0.75)' }}
  >
    <div className="bg-[#0d1117] border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-md p-6">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={20} className="text-rose-400" />
        </div>
        <div>
          <h3 className="text-white font-bold text-base leading-tight">Delete User?</h3>
          <p className="text-slate-500 text-xs mt-0.5">This action cannot be undone.</p>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
        <Avatar name={user?.name} image={user?.image} />
        <div>
          <p className="text-slate-200 font-semibold text-sm">{user?.name || 'Anonymous'}</p>
          <p className="text-slate-500 text-xs">{user?.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="flex-1 py-2.5 rounded-xl border border-slate-700/60 text-slate-300 text-sm font-semibold hover:bg-slate-800/60 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-sm font-semibold hover:bg-rose-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isDeleting ? (
            <><Loader2 size={14} className="animate-spin" /> Deleting...</>
          ) : (
            <><Trash2 size={14} /> Yes, Delete</>
          )}
        </button>
      </div>
    </div>
  </div>
);

const UserTable = ({ users: initialUsers }) => {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleRoleChange = async (userId, newRole) => {
    setLoadingId(userId);
    // Optimistic update
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
    );
    await handleUpdateUserRoleAction(userId, newRole);
    setLoadingId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id;
    setLoadingId(id);
    const result = await handleDeleteUserAction(id);
    if (result?.success) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
    }
    setLoadingId(null);
    setDeleteTarget(null);
  };

  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalLibrarians = users.filter((u) => u.role === 'librarian').length;
  const totalUsers = users.filter((u) => u.role === 'user').length;

  return (
    <>
      {deleteTarget && (
        <DeleteDialog
          user={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={loadingId === deleteTarget._id}
        />
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total Users', value: users.length, color: 'text-white', bg: 'bg-slate-800/40 border-slate-700/40' },
          { label: 'Librarians', value: totalLibrarians, color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/20' },
          { label: 'Admins', value: totalAdmins, color: 'text-violet-400', bg: 'bg-violet-500/5 border-violet-500/20' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} border rounded-xl px-4 py-3`}>
            <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest mb-1">{label}</p>
            <p className={`${color} text-2xl font-black`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="w-full rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl shadow-black/40">
        {/* Top bar */}
        <div className="px-6 py-3.5 bg-slate-900/90 border-b border-slate-800/60 flex items-center gap-2.5 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-slate-400 text-xs font-medium">
            <span className="text-violet-400 font-bold">{users.length}</span> registered members
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-[#070d1a]">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-950/80">
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map((head) => (
                  <th key={head} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] whitespace-nowrap">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {users.map((user) => {
                const isLoading = loadingId === user._id;
                const role = (user.role || 'user').toLowerCase();
                const style = roleStyles[role] || roleStyles.user;

                return (
                  <tr
                    key={user._id}
                    className={`group transition-all duration-200 ${
                      isLoading ? 'opacity-40 pointer-events-none' : 'hover:bg-slate-800/20'
                    }`}
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar  name={user.name} image={user.image} />
                        <span className="text-slate-100 font-semibold text-sm group-hover:text-white transition-colors">
                          {user.name || 'Anonymous'}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-slate-400 text-sm">{user.email}</td>

                    {/* Role dropdown */}
                    <td className="px-6 py-4">
                      <div className="relative inline-flex items-center">
                        <span className={`absolute left-2.5 w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        <select
                          value={role}
                          disabled={isLoading}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className={`appearance-none pl-6 pr-7 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider outline-none cursor-pointer transition-all bg-transparent ${style.badge}`}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r} className="bg-slate-900 text-slate-200 normal-case font-normal text-sm">
                              {r.charAt(0).toUpperCase() + r.slice(1)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={11} className={`absolute right-2 pointer-events-none ${style.badge.split(' ').find(c => c.startsWith('text-'))}`} />
                      </div>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-slate-500 text-xs font-mono whitespace-nowrap">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })
                        : '—'}
                    </td>

                    {/* Delete */}
                    <td className="px-6 py-4">
                      {isLoading ? (
                        <Loader2 size={16} className="animate-spin text-slate-500" />
                      ) : (
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20 hover:border-rose-400/40 hover:text-rose-300 transition-all flex items-center justify-center"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserTable;