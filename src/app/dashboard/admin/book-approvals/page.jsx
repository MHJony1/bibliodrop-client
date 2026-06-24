import React from 'react';
import { getPendingBooks } from '@/lib/api/admin';
import ApprovalTable from '@/components/dashboardrelated/adminrelated/ApprovalTable';
import { ClipboardList, Clock, BookOpen, Users } from 'lucide-react';

export const metadata = {
  title: 'Book Approvals | BiblioDrop',
  description: 'Review and manage pending book submissions.',
};

export default async function BookApprovalsPage() {
  const response = await getPendingBooks();
  const pendingBooks = response?.data || [];

  const totalPending = pendingBooks.length;
  const uniqueLibrarians = new Set(pendingBooks.map((b) => b.librarianEmail))
    .size;
  const totalCategories = new Set(pendingBooks.map((b) => b.category)).size;

  const stats = [
    {
      icon: Clock,
      label: 'Pending Reviews',
      value: totalPending,
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      iconColor: 'text-amber-400',
    },
    {
      icon: Users,
      label: 'Librarians',
      value: uniqueLibrarians,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      icon: BookOpen,
      label: 'Categories',
      value: totalCategories,
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 backdrop-blur-sm">
              <ClipboardList size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Book Approval Queue
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Review and manage pending book submissions. ({totalPending}{' '}
                pending)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-xs text-amber-400 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {totalPending} books awaiting review
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-800/30 border ${stat.border} backdrop-blur-sm hover:border-white/10 transition-all duration-300 group`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon size={18} className={stat.iconColor} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white mt-0.5">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Approval Table */}
      {pendingBooks.length > 0 ? (
        <ApprovalTable books={pendingBooks} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-slate-700/50 bg-slate-900/20">
          <div className="p-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <ClipboardList size={48} className="text-emerald-400/60" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            All caught up! 🎉
          </h3>
          <p className="text-slate-400 text-sm max-w-sm text-center">
            No pending book submissions right now. All books have been reviewed.
          </p>
        </div>
      )}
    </div>
  );
}
