import React from 'react';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Calendar, User, BookOpen, CheckCircle, Truck, PackageOpen } from 'lucide-react';
import { getLibrarianOrders } from '@/lib/api/books';
import DeliveryActionButton from '@/components/dashboardrelated/librarianrelated/DeliveryActionButton';


const ManageDeliveriesPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const loggedInUserEmail = session?.user?.email;

  const apiResponse = await getLibrarianOrders(loggedInUserEmail);
  const deliveries = apiResponse?.data && Array.isArray(apiResponse.data)
    ? apiResponse.data
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100">
      
      <div className="mb-8 border-b border-slate-100 dark:border-white/5 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Manage Deliveries
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Update delivery status for your book requests and handle shipments.
          </p>
        </div>
        <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 rounded-xl px-4 py-2.5 text-xs font-semibold text-violet-700 dark:text-violet-400 flex items-center gap-2 self-start sm:self-center">
          <Truck size={14} />
          Active Orders: {deliveries.filter(d => d.status !== 'Delivered').length}
        </div>
      </div>

      <div className="overflow-hidden bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-6">Client</th>
                <th className="py-4 px-6">Book</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-sm">
              {deliveries.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 dark:text-slate-600">
                      <PackageOpen size={40} strokeWidth={1.2} />
                      <p className="font-medium text-sm">No active delivery requests found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                deliveries.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <User size={13} className="text-slate-400" />
                          {item.clientName}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 ml-4">
                          {item.clientEmail}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-medium">
                      <span className="flex items-center gap-1.5 truncate max-w-[200px]" title={item.bookTitle}>
                        <BookOpen size={14} className="text-slate-400 shrink-0" />
                        {item.bookTitle}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Calendar size={13} className="text-slate-400" />
                        {item.date ? new Date(item.date).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        }) : 'N/A'}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      {item.status === 'Delivered' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Delivered
                        </span>
                      )}
                      {item.status === 'Dispatched' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          Dispatched
                        </span>
                      )}
                      {item.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <DeliveryActionButton orderId={item._id.toString()} currentStatus={item.status} />
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageDeliveriesPage;