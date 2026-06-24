'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Eye, EyeOff, Edit2, Trash2, Loader2, AlertTriangle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  handleDeleteBookAction,
  handleToggleBookStatusAction,
  handleEditBookAction,
} from '@/lib/actions/book';
import EditBookModal from './EditBookModal';

// ✅ Delete Confirmation Modal Component
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, bookTitle, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900/95 border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={22} className="text-rose-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">
              Delete Book?
            </h3>
            <p className="text-slate-400 text-sm mt-0.5">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3 mb-6">
          <p className="text-white font-semibold text-sm line-clamp-1">
            &nbsp;{bookTitle || 'Untitled'}&nbsp;
          </p>
          <p className="text-slate-400 text-xs mt-0.5">
            This book will be permanently removed from your inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl border border-slate-700/60 text-slate-300 text-sm font-semibold hover:bg-slate-800/60 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-sm font-semibold hover:bg-rose-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 size={14} /> Yes, Delete
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const BookActionButtons = ({ bookId, initialStatus, book }) => {
  const [status, setStatus] = useState(initialStatus || 'Pending Approval');
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    description: book?.description || '',
    category: book?.category || '',
    bookPrice: book?.bookPrice || book?.price || '',
    deliveryFee: book?.deliveryFee || '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book?.title || '',
        author: book?.author || '',
        description: book?.description || '',
        category: book?.category || '',
        bookPrice: book?.bookPrice || book?.price || '',
        deliveryFee: book?.deliveryFee || '',
      });
    }
  }, [book]);

  const handleToggle = async () => {
    setLoading(true);
    const toastId = toast.loading('Updating status...');
    try {
      const result = await handleToggleBookStatusAction(bookId, status);
      if (result?.success) {
        setStatus(result.newStatus);
        toast.success(`Book ${result.newStatus}!`, { id: toastId });
      } else {
        toast.error(result?.error || 'Failed to update.', { id: toastId });
      }
    } catch (error) {
      toast.error('An unexpected error occurred.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  //  Handle Delete with Modal
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading('Deleting book...');
    try {
      const result = await handleDeleteBookAction(bookId);
      if (result?.success) {
        toast.success('Book deleted successfully!', { id: toastId });
        setShowDeleteModal(false);
        // Refresh the page or update state
        window.location.reload();
      } else {
        toast.error(result?.error || 'Failed to delete.', { id: toastId });
      }
    } catch (error) {
      toast.error('An unexpected error occurred.', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    const toastId = toast.loading('Updating book...');
    try {
      const result = await handleEditBookAction(bookId, formData);
      if (result?.success) {
        toast.success('Book updated successfully!', { id: toastId });
        setShowEditModal(false);
      } else {
        toast.error(result?.error || 'Failed to update.', { id: toastId });
      }
    } catch (error) {
      toast.error('An unexpected error occurred.', { id: toastId });
    } finally {
      setEditLoading(false);
    }
  };

  const isPending =
    status === 'Pending Approval' || status === 'Pending Delivery' || !status;
  const isPublished = status === 'Published';

  return (
    <>
      {/* Delete Confirmation Modal */}
      {mounted && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          bookTitle={book?.title || 'Untitled'}
          isDeleting={isDeleting}
        />
      )}

      {/* Edit Modal */}
      {mounted &&
        showEditModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <EditBookModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditSubmit}
            editLoading={editLoading}
          />,
          document.body,
        )}

      <div className="flex items-center justify-end gap-1.5">
        {/* Status Toggle Button */}
        {isPending ? (
          <button
            disabled
            title="Cannot toggle while Pending Approval"
            className="p-2 rounded-lg bg-slate-800/40 text-slate-600 cursor-not-allowed"
          >
            <EyeOff size={15} />
          </button>
        ) : loading ? (
          <button
            disabled
            className="p-2 rounded-lg bg-slate-800/40 text-slate-400 cursor-wait"
          >
            <Loader2 size={15} className="animate-spin" />
          </button>
        ) : isPublished ? (
          <button
            onClick={handleToggle}
            title="Unpublish Book"
            className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/40 transition-all group"
          >
            <Eye
              size={15}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
        ) : (
          <button
            onClick={handleToggle}
            title="Publish Book"
            className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-400/40 transition-all group"
          >
            <EyeOff
              size={15}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
        )}

        {/* Edit Button */}
        <button
          onClick={() => setShowEditModal(true)}
          title="Edit Book"
          className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400/40 transition-all group"
        >
          <Edit2
            size={15}
            className="group-hover:scale-110 transition-transform"
          />
        </button>

        {/* Delete Button - Modal Open  */}
        <button
          onClick={handleDeleteClick}
          title="Delete Book"
          className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-400/40 transition-all group"
        >
          <Trash2
            size={15}
            className="group-hover:scale-110 transition-transform"
          />
        </button>
      </div>
    </>
  );
};

export default BookActionButtons;