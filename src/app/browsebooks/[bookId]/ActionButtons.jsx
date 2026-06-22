'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Truck,
  Lock,
  Edit3,
  Trash2,
  EyeOff,
  Loader2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  handleDeleteBookAction,
  handleToggleBookStatusAction,
  handleEditBookAction,
} from '@/lib/actions/book';
import EditBookModal from '@/components/dashboardrelated/librarianrelated/EditBookModal';

// ✅ Delete Confirmation Modal
function DeleteConfirmModal({ isOpen, onClose, onConfirm, bookTitle }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#0D1033] border border-white/[0.06] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-red-500/10 border border-red-500/20">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Book</h3>
            </div>

            <p className="text-[#8890B5] text-sm mb-2">
              Are you sure you want to delete{' '}
              <span className="text-white font-medium">"{bookTitle}"</span>?
            </p>
            <p className="text-[#565C7A] text-xs mb-6">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#0E1330]/60 border border-white/[0.06] text-[#8890B5] hover:text-white hover:border-white/[0.15] transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all text-sm"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function ActionButtons({
  bookId,
  status,
  currentUser,
  isLibrarianOwner,
  book,
}) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // ✅ Form data state
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    description: book?.description || '',
    category: book?.category || '',
    bookPrice: book?.price || '',
    deliveryFee: book?.deliveryFee || '',
    coverImage: book?.coverImage || '',
  });

  // ✅ Status checks
  const isAvailable = status === 'Published' || status === 'Available';
  const isCheckedOut =
    status === 'Checked Out' ||
    status === 'Pending Delivery' ||
    status === 'Pending';
  const isPendingApproval = status === 'Pending Approval';
  const isUnpublished = status === 'Unpublished';

  // ✅ Handle Stripe Checkout
  const handleStripeCheckout = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          title: book?.title || 'Unknown Book',
          price: book?.price !== undefined ? Number(book.price) : 0,
          deliveryFee:
            book?.deliveryFee !== undefined ? Number(book.deliveryFee) : 0,
        }),
      });
      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error(data?.error || 'Failed to initialize checkout.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Stripe Error:', error);
      toast.error('Network error. Please try again.');
      setIsProcessing(false);
    }
  };

  // ✅ Handle Delete
  const handleDelete = async () => {
    setShowDeleteModal(false);
    try {
      const result = await handleDeleteBookAction(bookId);
      if (result?.success) {
        toast.success('Book deleted successfully!');
        router.push('/dashboard/librarian/manage-inventory');
      } else {
        toast.error(result?.error || 'Failed to delete book');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error('Something went wrong');
    }
  };

  // ✅ Handle Publish/Unpublish Toggle
  const handleToggleStatus = async () => {
    if (isPendingApproval) {
      toast.error('Pending approval books cannot be published');
      return;
    }

    setIsTogglingStatus(true);
    try {
      const result = await handleToggleBookStatusAction(bookId, status);
      if (result?.success) {
        toast.success(
          `Book ${result.newStatus === 'Published' ? 'Published' : 'Unpublished'} successfully!`,
        );
        router.refresh();
      } else {
        toast.error(result?.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Toggle Status Error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // ✅ Handle Edit Submit - Server Action ব্যবহার করে
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const updateData = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        category: formData.category,
        bookPrice: parseFloat(formData.bookPrice) || 0,
        deliveryFee: parseFloat(formData.deliveryFee) || 0,
        coverImage: formData.coverImage || book?.coverImage || '',
      };

      console.log('📤 Sending update via Server Action:', updateData);

      // ✅ Server Action ব্যবহার করো
      const result = await handleEditBookAction(bookId, updateData);

      console.log('📥 Server action result:', result);

      if (result.success) {
        toast.success('Book updated successfully!');
        setShowEditModal(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update book');
      }
    } catch (error) {
      console.error('❌ Update Error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setEditLoading(false);
    }
  };

  // ❌ Condition 1: Not logged in
  if (!currentUser) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link href="/auth/login" className="flex-1">
          <button className="w-full bg-[#6C47FF] hover:bg-[#5b3ae0] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(108,71,255,0.25)]">
            Login to Request Delivery
          </button>
        </Link>
        <button className="flex items-center justify-center gap-2 border border-white/[0.08] bg-white/[0.02] hover:bg-white/5 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-colors">
          <Heart size={16} className="text-[#8890B5]" />
          Add to Wishlist
        </button>
      </div>
    );
  }

  // ✅ Condition 2: Librarian who owns this book — show management controls
  if (isLibrarianOwner) {
    return (
      <div className="space-y-4 w-full">
        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          bookTitle={book?.title || 'this book'}
        />

        {/* Edit Modal */}
        <EditBookModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditSubmit}
          editLoading={editLoading}
        />

        <button
          disabled
          className="flex items-center justify-center gap-2 w-full border border-white/[0.06] bg-white/[0.01] text-gray-600 font-semibold py-3 rounded-xl text-sm cursor-not-allowed"
        >
          <Heart size={16} /> Add to Wishlist
        </button>

        <div className="bg-[#0D1033] border border-white/[0.06] p-4 rounded-xl space-y-3">
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#8890B5]">
            Librarian Controls
          </p>
          <div className="grid grid-cols-3 gap-2">
            {/* ✅ Edit Button */}
            <button
              onClick={() => setShowEditModal(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-bold hover:bg-white/[0.08] text-white transition-colors"
            >
              <Edit3 size={14} className="text-blue-400" /> Edit
            </button>

            {/* ✅ Publish/Unpublish Button */}
            <button
              onClick={handleToggleStatus}
              disabled={isPendingApproval || isTogglingStatus}
              className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                isPendingApproval
                  ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400/50 cursor-not-allowed'
                  : isUnpublished
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20'
                    : 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
              }`}
              title={
                isPendingApproval ? 'Pending approval - cannot publish' : ''
              }
            >
              {isTogglingStatus ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isPendingApproval ? (
                <>
                  <Clock size={14} /> Pending
                </>
              ) : isUnpublished ? (
                <>
                  <EyeOff size={14} /> Publish
                </>
              ) : (
                <>
                  <EyeOff size={14} /> Unpublish
                </>
              )}
            </button>

            {/* ✅ Delete Button */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 text-red-400 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>

          {/* ✅ Status Badge */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
            <span className="text-[10px] text-[#8890B5]">Status:</span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                isAvailable
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : isPendingApproval
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : isUnpublished
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-blue-500/20 text-blue-400'
              }`}
            >
              {status || 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Condition 3: Regular user viewing another librarian's book
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {isAvailable ? (
        <button
          onClick={handleStripeCheckout}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 bg-[#D48416] hover:bg-[#bd7410] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(212,132,22,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Redirecting...
            </>
          ) : (
            <>
              <Truck size={16} />
              Request Delivery
            </>
          )}
        </button>
      ) : isCheckedOut ? (
        <button
          disabled
          className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 font-bold py-3 px-6 rounded-xl text-sm cursor-not-allowed"
        >
          <Clock size={16} />
          Checked Out
        </button>
      ) : (
        <button
          disabled
          className="flex-1 flex items-center justify-center gap-2 bg-white/[0.04] border border-white/[0.08] text-gray-500 font-bold py-3 px-6 rounded-xl text-sm cursor-not-allowed"
        >
          <Lock size={16} />
          Unavailable
        </button>
      )}

      <button className="flex items-center justify-center gap-2 border border-white/[0.08] bg-white/[0.02] hover:bg-white/5 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-colors">
        <Heart size={16} className="text-[#8890B5]" />
        Add to Wishlist
      </button>
    </div>
  );
}
