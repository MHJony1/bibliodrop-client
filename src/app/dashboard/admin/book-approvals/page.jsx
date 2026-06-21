import React from 'react';
import { getPendingBooks } from "@/lib/api/admin";
import ApprovalTable from "@/components/dashboardrelated/adminrelated/ApprovalTable";
import { ClipboardList } from 'lucide-react';

export default async function BookApprovalsPage() {
  const response = await getPendingBooks();
  const pendingBooks = response?.data || [];

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <ClipboardList size={18} className="text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white leading-tight">
            Book Approval Queue
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Review and manage pending book submissions.
          </p>
        </div>
      </div>

      {pendingBooks.length > 0 ? (
        <ApprovalTable books={pendingBooks} />
      ) : (
        <div className="text-center py-20 border border-slate-800 rounded-3xl bg-slate-900/20">
          <p className="text-slate-500 text-sm">No books pending approval right now.</p>
        </div>
      )}
    </div>
  );
}