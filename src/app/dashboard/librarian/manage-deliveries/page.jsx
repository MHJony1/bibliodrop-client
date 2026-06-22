import React from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import {
  Calendar,
  User,
  BookOpen,
  CheckCircle,
  Truck,
  PackageOpen,
  DollarSign,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { getLibrarianOrders } from '@/lib/api/books';
import DeliveryActionButton from '@/components/dashboardrelated/librarianrelated/DeliveryActionButton';

const ManageDeliveriesPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const loggedInUserEmail = session?.user?.email;

  const apiResponse = await getLibrarianOrders(loggedInUserEmail);
  const deliveries =
    apiResponse?.data && Array.isArray(apiResponse.data)
      ? apiResponse.data
      : [];

  const totalEarnings = deliveries
    .filter((d) => d.status === 'Delivered')
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  const activeOrders = deliveries.filter(
    (d) => d.status !== 'Delivered',
  ).length;
  const totalOrders = deliveries.length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 backdrop-blur-sm">
              <Truck size={22} className="text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Manage Deliveries
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Update delivery status for your book requests and handle
                shipments.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <DollarSign size={14} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 font-semibold">
              ${totalEarnings.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Clock size={14} className="text-amber-400" />
            <span className="text-xs text-amber-400 font-semibold">
              {activeOrders} Active
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
          <p className="text-xs text-slate-400 font-medium">Total Orders</p>
          <p className="text-2xl font-bold text-white mt-1">{totalOrders}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
          <p className="text-xs text-slate-400 font-medium">Active</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {activeOrders}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
          <p className="text-xs text-slate-400 font-medium">Delivered</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {deliveries.filter((d) => d.status === 'Delivered').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
          <p className="text-xs text-slate-400 font-medium">Earnings</p>
          <p className="text-2xl font-bold text-violet-400 mt-1">
            ${totalEarnings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="w-full rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl shadow-black/40 bg-slate-900/30 backdrop-blur-sm">
        <div className="px-6 py-3.5 bg-slate-900/80 border-b border-slate-800/60 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-slate-400 text-xs font-medium">
            <span className="text-white font-bold">{totalOrders}</span> delivery
            requests
            <span className="text-slate-500 ml-2">
              • {activeOrders} pending
            </span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-950/80">
                {['Client', 'Book', 'Amount', 'Date', 'Status', 'Actions'].map(
                  (head) => (
                    <th
                      key={head}
                      className={`px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] whitespace-nowrap ${
                        head === 'Actions' ? 'text-right' : ''
                      }`}
                    >
                      {head}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {deliveries.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="p-6 rounded-full bg-slate-800/40 border border-slate-700/50 mb-4">
                        <PackageOpen size={40} className="text-slate-600" />
                      </div>
                      <p className="text-slate-400 font-medium">
                        No delivery requests found
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        Orders will appear here once placed
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                deliveries.map((item, index) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                          <User size={13} className="text-slate-500" />
                          {item.clientName || 'Customer'}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5 ml-5">
                          {item.clientEmail || 'N/A'}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-300 font-medium flex items-center gap-2">
                        <BookOpen
                          size={14}
                          className="text-slate-600 shrink-0"
                        />
                        <span className="line-clamp-1 max-w-[180px]">
                          {item.bookTitle || 'Unknown Book'}
                        </span>
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-white">
                        ${item.amount?.toFixed(2) || '0.00'}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-600" />
                        {item.date
                          ? new Date(item.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {item.status === 'Delivered' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle size={11} />
                          Delivered
                        </span>
                      )}
                      {item.status === 'Dispatched' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Truck size={11} />
                          Dispatched
                        </span>
                      )}
                      {item.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock size={11} />
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <DeliveryActionButton
                        orderId={item._id.toString()}
                        currentStatus={item.status}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900/60 border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Showing{' '}
            <span className="text-white font-medium">{deliveries.length}</span>{' '}
            deliveries
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <Clock size={12} />
            Updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ManageDeliveriesPage;
