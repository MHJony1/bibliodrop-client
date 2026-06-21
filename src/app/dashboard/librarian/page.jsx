import React from 'react';
import { getLibrarianBooks } from "@/lib/api/books";
import { getLibrarianOrders } from "@/lib/api/books";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { BookOpen, DollarSign, Clock, ArrowUpRight, PlusCircle, Truck } from 'lucide-react';
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

  const myBooks = booksResponse?.data && Array.isArray(booksResponse.data)
    ? booksResponse.data : [];

  const myOrders = ordersResponse?.data && Array.isArray(ordersResponse.data)
    ? ordersResponse.data : [];

  // Stats
  const pendingRequests = myOrders.filter(o => 
    o.status === 'Pending' || o.status === 'Dispatched'
  ).length;

  const totalEarnings = myOrders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, o) => sum + (Number(o.totalPrice || o.bookPrice || 0)), 0);

  // Chart data
  const categoryCounts = {};
  myBooks.forEach(b => {
    if (b.category) {
      const cat = b.category.trim().charAt(0).toUpperCase() + b.category.trim().slice(1);
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
  });
  const chartData = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100">
      
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Welcome back, {session?.user?.name || "Librarian"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitoring profile status, analytics, and book distribution.
          </p>
        </div>
        <Link
          href="/dashboard/librarian/add-book"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 self-start sm:self-center cursor-pointer"
        >
          <PlusCircle size={16} /> Add New Book
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-xl shadow-slate-100/30 dark:shadow-none flex items-center justify-between backdrop-blur-md">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Books</p>
            <h3 className="text-3xl font-extrabold mt-2 text-slate-800 dark:text-white">{myBooks.length}</h3>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
            <BookOpen size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-xl shadow-slate-100/30 dark:shadow-none flex items-center justify-between backdrop-blur-md">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Earnings</p>
            <h3 className="text-3xl font-extrabold mt-2 text-emerald-600 dark:text-emerald-400">
              ${totalEarnings.toFixed(2)}
            </h3>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-xl shadow-slate-100/30 dark:shadow-none flex items-center justify-between backdrop-blur-md">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Pending Orders</p>
            <h3 className="text-3xl font-extrabold mt-2 text-amber-500 dark:text-amber-400">{pendingRequests}</h3>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-xl shadow-slate-100/30 dark:shadow-none flex items-center justify-between backdrop-blur-md">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Deliveries</p>
            <h3 className="text-3xl font-extrabold mt-2 text-violet-600 dark:text-violet-400">{myOrders.length}</h3>
          </div>
          <div className="p-3.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-100/50 dark:border-violet-900/30">
            <Truck size={22} />
          </div>
        </div>
      </div>

      {/* Chart + Recent Books */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        <div className="lg:col-span-3 bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/80 dark:border-white/5 shadow-xl backdrop-blur-md">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Books by Category</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Dynamic distribution of your listed catalog.</p>
          <LibrarianOverviewChart chartData={chartData} />
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/80 dark:border-white/5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Books</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Your latest listed titles.</p>
            </div>
            <Link href="/dashboard/librarian/manage-inventory" className="text-xs font-semibold text-violet-600 dark:text-amber-400 hover:underline flex items-center gap-0.5">
              View All <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {myBooks.slice(0, 4).map((book, idx) => (
              <div key={book._id || idx} className="py-3.5 flex items-center justify-between group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-9 rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200/60 dark:border-white/10 shadow-sm">
                    <Image 
                      src={book.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'} 
                      alt={book.title}
                      fill 
                      sizes="36px"
                      className="object-cover transition-transform group-hover:scale-105"
                      quality={100}
                      unoptimized={true}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-violet-600 dark:group-hover:text-amber-400 transition-colors">
                      {book.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">by {book.author}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-white/5 shrink-0">
                  #{idx + 1}
                </span>
              </div>
            ))}
            
            {myBooks.length === 0 && (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium text-sm">
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