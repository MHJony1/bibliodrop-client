import React from 'react';
import { getLibrarianBooks } from '@/lib/api/books';
import { getLibrarianOrders } from '@/lib/api/books';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import {
  BookOpen,
  DollarSign,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Truck,
  TrendingUp,
  Package,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import LibrarianOverviewChart from '@/components/dashboardrelated/librarianrelated/LibrarianOverviewChart';

const LibrarianDashboard = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const loggedInUserEmail = session?.user?.email;

  const [booksResponse, ordersResponse] = await Promise.all([
    getLibrarianBooks(loggedInUserEmail),
    getLibrarianOrders(loggedInUserEmail),
  ]);

  const myBooks =
    booksResponse?.data && Array.isArray(booksResponse.data)
      ? booksResponse.data
      : [];

  const myOrders =
    ordersResponse?.data && Array.isArray(ordersResponse.data)
      ? ordersResponse.data
      : [];

  const pendingOrders = myOrders.filter((o) => o.status === 'Pending').length;
  const dispatchedOrders = myOrders.filter(
    (o) => o.status === 'Dispatched',
  ).length;
  const totalPending = pendingOrders + dispatchedOrders;

  const totalEarnings = myOrders
    .filter((o) => o.status === 'Delivered')
    .reduce((sum, o) => sum + Number(o.amount || o.amountPaid || 0), 0);

  const totalDeliveries = myOrders.filter(
    (o) => o.status === 'Delivered',
  ).length;

  const categoryCounts = {};
  myBooks.forEach((b) => {
    if (b.category) {
      const cat =
        b.category.trim().charAt(0).toUpperCase() + b.category.trim().slice(1);
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
  });
  const chartData = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
  }));

  const stats = [
    {
      icon: BookOpen,
      label: 'Total Books',
      value: myBooks.length,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      icon: DollarSign,
      label: 'Total Earnings',
      value: `$${totalEarnings.toFixed(2)}`,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      icon: Clock,
      label: 'Pending Orders',
      value: totalPending,
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      icon: Truck,
      label: 'Total Deliveries',
      value: totalDeliveries,
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 backdrop-blur-sm">
              <BookOpen size={22} className="text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome back, {session?.user?.name || 'Librarian'} 👋
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Monitoring profile status, analytics, and book distribution.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/librarian/add-book"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium hover:shadow-[0_0_30px_rgba(109,74,255,0.3)] transition-all flex items-center gap-2"
        >
          <PlusCircle size={16} />
          Add New Book
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-800/30 border ${stat.border} backdrop-blur-sm hover:border-white/10 transition-all duration-300 group`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white mt-0.5">
                  {typeof stat.value === 'number' ? stat.value : stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Recent Books */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Books by Category
              </h2>
              <p className="text-xs text-slate-400">
                Dynamic distribution of your listed catalog.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <span className="text-xs text-violet-400 font-bold">
                {myBooks.length}
              </span>
              <span className="text-xs text-slate-500">Total Titles</span>
            </div>
          </div>
          {chartData.length > 0 ? (
            <LibrarianOverviewChart chartData={chartData} />
          ) : (
            <div className="flex items-center justify-center h-56 text-slate-400 text-sm border border-dashed border-slate-700/50 rounded-xl">
              No books added yet
            </div>
          )}
        </div>

        {/* Recent Books */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Books</h2>
              <p className="text-xs text-slate-400">
                Your latest listed titles.
              </p>
            </div>
            <Link
              href="/dashboard/librarian/manage-inventory"
              className="text-xs text-violet-400 hover:text-white transition-colors flex items-center gap-1"
            >
              View All <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/30">
            {myBooks.slice(0, 4).map((book, idx) => (
              <div
                key={book._id || idx}
                className="py-3.5 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-9 rounded-lg overflow-hidden bg-slate-800 border border-slate-700/50 shrink-0">
                    <Image
                      src={
                        book.coverImage ||
                        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'
                      }
                      alt={book.title || 'Book cover'}
                      fill
                      sizes="36px"
                      className="object-cover transition-transform group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-violet-400 transition-colors">
                      {book.title || 'Untitled'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      by {book.author || 'Unknown'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700/50 shrink-0">
                  #{idx + 1}
                </span>
              </div>
            ))}

            {myBooks.length === 0 && (
              <div className="text-center py-12 text-slate-500 font-medium text-sm">
                No books in your catalog yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;
