'use client';

import { useState } from 'react';
import { Truck, CheckCircle } from 'lucide-react';

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
        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer disabled:opacity-50"
      >
        {loading ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Truck size={12} />}
        Mark Dispatched
      </button>
    );
  }

  if (status === 'Dispatched') {
    return (
      <button
        onClick={() => handleUpdate('Delivered')}
        disabled={loading}
        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer disabled:opacity-50"
      >
        {loading ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={12} />}
        Complete Delivery
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
      <CheckCircle size={13} className="text-emerald-500" /> Complete
    </span>
  );
};

export default DeliveryActionButton;