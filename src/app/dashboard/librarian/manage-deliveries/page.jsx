import React from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { Truck, DollarSign, Clock } from 'lucide-react';
import { getLibrarianOrders } from '@/lib/api/books';
import DeliveriesTable from '@/components/dashboardrelated/librarianrelated/DeliveriesTable';

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
            <div className="p-3 rounded-2xl bg-linear-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 backdrop-blur-sm">
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

      {/* Deliveries Table with Search, Filter & Pagination */}
      <DeliveriesTable deliveries={deliveries} />
    </div>
  );
};

export default ManageDeliveriesPage;
