'use client';

import React, { useState } from 'react';
import {
  Trash2,
  Loader2,
  AlertTriangle,
  ChevronDown,
  User,
  Mail,
  Calendar,
  Shield,
  Crown,
  BookOpen,
} from 'lucide-react';
import {
  handleUpdateUserRoleAction,
  handleDeleteUserAction,
} from '@/lib/actions/admin';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Role config
const ROLES = ['user', 'librarian', 'admin'];

const roleStyles = {
  admin: {
    badge: 'bg-violet-500/15 border-violet-500/30 text-violet-400',
    dot: 'bg-violet-400',
    icon: Crown,
    label: 'Admin',
  },
  librarian: {
    badge: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    dot: 'bg-blue-400',
    icon: BookOpen,
    label: 'Librarian',
  },
  user: {
    badge: 'bg-slate-500/15 border-slate-500/30 text-slate-400',
    dot: 'bg-slate-400',
    icon: User,
    label: 'User',
  },
};

// Avatar Component
const Avatar = ({ name, image }) => {
  const initials = (name || 'A')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (image) {
    return (
      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative border-2 border-slate-700/50">
        <Image
          src={image}
          alt={name || 'User'}
          fill
          className="object-cover"
          sizes="40px"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-full shrink-0 bg-gradient-to-br from-violet-500/30 to-purple-500/10 border border-violet-500/20 flex items-center justify-center text-white font-bold text-sm">
      {initials}
    </div>
  );
};

// Delete Confirm Dialog
const DeleteDialog = ({ user, onConfirm, onCancel, isDeleting }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-slate-900/95 border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-md p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={22} className="text-rose-400" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg leading-tight">
            Delete User?
          </h3>
          <p className="text-slate-400 text-sm mt-0.5">
            This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
        <Avatar name={user?.name} image={user?.image} />
        <div>
          <p className="text-white font-semibold text-sm">
            {user?.name || 'Anonymous'}
          </p>
          <p className="text-slate-400 text-xs">{user?.email}</p>
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
            <>
              <Loader2 size={14} className="animate-spin" /> Deleting...
            </>
          ) : (
            <>
              <Trash2 size={14} /> Yes, Delete
            </>
          )}
        </button>
      </div>
    </motion.div>
  </div>
);

const UserTable = ({ users: initialUsers }) => {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');

  const handleRoleChange = async (userId, newRole) => {
    setLoadingId(userId);
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
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

  // Filter users by search
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalLibrarians = users.filter((u) => u.role === 'librarian').length;

  return (
    <>
      <AnimatePresence>
        {deleteTarget && (
          <DeleteDialog
            user={deleteTarget}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
            isDeleting={loadingId === deleteTarget._id}
          />
        )}
      </AnimatePresence>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            Admin: {totalAdmins}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Librarian: {totalLibrarians}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            User: {users.length - totalAdmins - totalLibrarians}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="w-full rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl shadow-black/40 bg-slate-900/30 backdrop-blur-sm">
        <div className="px-6 py-3.5 bg-slate-900/80 border-b border-slate-800/60 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-slate-400 text-xs font-medium">
            <span className="text-violet-400 font-bold">
              {filteredUsers.length}
            </span>{' '}
            registered members
            {filteredUsers.length !== users.length && (
              <span className="text-slate-500 ml-1">
                (filtered from {users.length})
              </span>
            )}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-950/80">
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map(
                  (head, index) => (
                    <th
                      key={head}
                      className={`px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] whitespace-nowrap ${
                        index === 0 ? 'pl-6' : ''
                      }`}
                    >
                      {head}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              <AnimatePresence>
                {filteredUsers.map((user, index) => {
                  const isLoading = loadingId === user._id;
                  const role = (user.role || 'user').toLowerCase();
                  const style = roleStyles[role] || roleStyles.user;
                  const RoleIcon = style.icon;

                  return (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.03 }}
                      className={`group transition-all duration-200 ${
                        isLoading
                          ? 'opacity-40 pointer-events-none'
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} image={user.image} />
                          <span className="text-slate-100 font-semibold text-sm group-hover:text-white transition-colors">
                            {user.name || 'Anonymous'}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-slate-600" />
                          <span className="text-slate-400 text-sm">
                            {user.email}
                          </span>
                        </div>
                      </td>

                      {/* Role dropdown */}
                      <td className="px-6 py-4">
                        <div className="relative inline-flex items-center">
                          <span
                            className={`absolute left-2.5 w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`}
                          />
                          <RoleIcon
                            size={12}
                            className={`absolute left-5 ${style.badge.split(' ').find((c) => c.startsWith('text-'))}`}
                          />
                          <select
                            value={role}
                            disabled={isLoading}
                            onChange={(e) =>
                              handleRoleChange(user._id, e.target.value)
                            }
                            className={`appearance-none pl-8 pr-7 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider outline-none cursor-pointer transition-all bg-transparent ${style.badge}`}
                          >
                            {ROLES.map((r) => (
                              <option
                                key={r}
                                value={r}
                                className="bg-slate-900 text-slate-200 normal-case font-normal text-sm"
                              >
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={11}
                            className={`absolute right-2 pointer-events-none ${style.badge.split(' ').find((c) => c.startsWith('text-'))}`}
                          />
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-600" />
                          <span className="text-slate-500 text-xs font-mono whitespace-nowrap">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  'en-GB',
                                  {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  },
                                )
                              : '—'}
                          </span>
                        </div>
                      </td>

                      {/* Delete */}
                      <td className="px-6 py-4">
                        {isLoading ? (
                          <Loader2
                            size={16}
                            className="animate-spin text-slate-500"
                          />
                        ) : (
                          <button
                            onClick={() => setDeleteTarget(user)}
                            className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20 hover:border-rose-400/40 hover:text-rose-300 transition-all flex items-center justify-center group-hover:scale-105"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserTable;
