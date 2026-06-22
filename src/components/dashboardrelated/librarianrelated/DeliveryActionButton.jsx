'use client';

import { useState } from 'react';
import { Truck, CheckCircle, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { handleUpdateOrderStatusAction } from '@/lib/actions/order';

const DeliveryActionButton = ({ orderId, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus) => {
    setLoading(true);
    const toastId = toast.loading('Updating status...');
    const result = await handleUpdateOrderStatusAction(orderId, newStatus);
    if (result.success) {
      setStatus(newStatus);
      toast.success(`Marked as ${newStatus}!`, { id: toastId });
    } else {
      toast.error(result.error || 'Failed to update.', { id: toastId });
    }
    setLoading(false);
  };

  if (status === 'Pending') {
    return (
      <button
        onClick={() => handleUpdate('Dispatched')}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400/40 transition-all text-xs font-semibold disabled:opacity-50 group"
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <>
            <Truck
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
            Mark Dispatched
          </>
        )}
      </button>
    );
  }

  if (status === 'Dispatched') {
    return (
      <button
        onClick={() => handleUpdate('Delivered')}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/40 transition-all text-xs font-semibold disabled:opacity-50 group"
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <>
            <CheckCircle
              size={14}
              className="group-hover:scale-110 transition-transform"
            />
            Complete Delivery
          </>
        )}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-xs text-emerald-400 font-medium">
      <CheckCircle size={14} className="text-emerald-400" />
      <span className="text-slate-400">Completed</span>
    </span>
  );
};

export default DeliveryActionButton;
