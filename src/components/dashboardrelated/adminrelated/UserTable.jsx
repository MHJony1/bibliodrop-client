'use client';

import React, { useState, useMemo } from 'react';
import {
  Trash2,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Calendar,
  Shield,
  Crown,
  BookOpen,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import {
  handleUpdateUserRoleAction,
  handleDeleteUserAction,
  handleBlockUserAction,
} from '@/lib/actions/admin';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

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

  // ✅ Role Filter State
  const [roleFilter, setRoleFilter] = useState('all');

  // Sorting State
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // ✅ Filter, Sort & Paginate
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch =
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());

      // Role filter
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filteredUsers, sortField, sortDirection]);

  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = sortedUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document
      .querySelector('.overflow-x-auto')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  // ✅ Reset to page 1 on filter/search change
  const handleFilterChange = (value) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    if (currentPage <= 3) end = 4;
    if (currentPage >= totalPages - 2) start = totalPages - 3;
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const handleRoleChange = async (userId, newRole) => {
    setLoadingId(userId);
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
    );
    const result = await handleUpdateUserRoleAction(userId, newRole);
    if (!result.success) {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, role: users.find((x) => x._id === userId)?.role }
            : u,
        ),
      );
      toast.error(result.error || 'Failed to update role');
    }
    setLoadingId(null);
  };

  const handleBlockToggle = async (userId, currentBlocked) => {
    const newBlocked = !currentBlocked;
    setLoadingId(userId);
    const result = await handleBlockUserAction(userId, newBlocked);
    if (result.success) {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isBlocked: newBlocked } : u,
        ),
      );
      toast.success(
        `User ${newBlocked ? 'blocked' : 'unblocked'} successfully`,
      );
    } else {
      toast.error(result.error || 'Failed to update user status');
    }
    setLoadingId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id;
    setLoadingId(id);
    const result = await handleDeleteUserAction(id);
    if (result?.success) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete user');
    }
    setLoadingId(null);
    setDeleteTarget(null);
  };

  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalLibrarians = users.filter((u) => u.role === 'librarian').length;
  const totalUsers = users.filter((u) => u.role === 'user').length;

  const SortableHeader = ({ field, children }) => (
    <th
      onClick={() => handleSort(field)}
      className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] whitespace-nowrap cursor-pointer hover:text-white transition-colors group"
    >
      <div className="flex items-center gap-1.5">
        {children}
        <ArrowUpDown
          size={12}
          className="opacity-30 group-hover:opacity-100 transition-opacity"
        />
        {sortField === field &&
          (sortDirection === 'asc' ? (
            <ChevronUp size={12} />
          ) : (
            <ChevronDown size={12} />
          ))}
      </div>
    </th>
  );

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

      {/* ✅ Search & Filter Bar */}
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
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* ✅ Role Filter Dropdown */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer pr-10"
            >
              <option value="all">All Roles</option>
              <option value="admin">👑 Admin</option>
              <option value="librarian">📚 Librarian</option>
              <option value="user">👤 User</option>
            </select>
            <Filter
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
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
              User: {totalUsers}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-500">Total: {users.length}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl shadow-black/40 bg-slate-900/30 backdrop-blur-sm">
        <div className="px-6 py-3.5 bg-slate-900/80 border-b border-slate-800/60 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-slate-400 text-xs font-medium">
            <span className="text-violet-400 font-bold">{totalItems}</span>{' '}
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
                <SortableHeader field="name">User</SortableHeader>
                <SortableHeader field="email">Email</SortableHeader>
                <SortableHeader field="role">Role</SortableHeader>
                <SortableHeader field="createdAt">Joined</SortableHeader>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] whitespace-nowrap text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              <AnimatePresence>
                {currentUsers.map((user, index) => {
                  const isLoading = loadingId === user._id;
                  const role = (user.role || 'user').toLowerCase();
                  const style = roleStyles[role] || roleStyles.user;
                  const RoleIcon = style.icon;
                  const isBlocked = user.isBlocked || false;

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
                      } ${isBlocked ? 'bg-red-500/5' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} image={user.image} />
                          <div>
                            <span className="text-slate-100 font-semibold text-sm group-hover:text-white transition-colors">
                              {user.name || 'Anonymous'}
                            </span>
                            {isBlocked && (
                              <span className="ml-2 text-[9px] font-bold text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">
                                Blocked
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-slate-600" />
                          <span className="text-slate-400 text-sm">
                            {user.email}
                          </span>
                        </div>
                      </td>

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

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              handleBlockToggle(user._id, isBlocked)
                            }
                            disabled={isLoading}
                            className={`p-2 rounded-lg border transition-all ${
                              isBlocked
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/40'
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-400/40'
                            } group-hover:scale-105`}
                            title={isBlocked ? 'Unblock User' : 'Block User'}
                          >
                            {isBlocked ? (
                              <CheckCircle size={15} />
                            ) : (
                              <Ban size={15} />
                            )}
                          </button>

                          {isLoading ? (
                            <Loader2
                              size={16}
                              className="animate-spin text-slate-500"
                            />
                          ) : (
                            <button
                              onClick={() => setDeleteTarget(user)}
                              className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20 hover:border-rose-400/40 hover:text-rose-300 transition-all flex items-center justify-center group-hover:scale-105"
                              title="Delete User"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/60 bg-slate-900/60">
            <span className="text-xs text-slate-500">
              Showing {startIndex + 1}–{Math.min(endIndex, totalItems)} of{' '}
              {totalItems}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-700/50 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-violet-500/20 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="w-8 text-center text-slate-500 text-xs"
                    >
                      …
                    </span>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 text-xs font-bold rounded-lg border transition-all ${
                      currentPage === page
                        ? 'bg-violet-500/20 border-violet-500/30 text-violet-400'
                        : 'border-slate-700/50 bg-slate-900/50 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-700/50 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-violet-500/20 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserTable;
