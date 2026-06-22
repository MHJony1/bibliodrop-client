'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Eye, EyeOff, Edit2, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  handleDeleteBookAction,
  handleToggleBookStatusAction,
  handleEditBookAction,
} from '@/lib/actions/book';
import EditBookModal from './EditBookModal';

const BookActionButtons = ({ bookId, initialStatus, book }) => {
  const [status, setStatus] = useState(initialStatus || 'Pending Approval');
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this book permanently?'))
      return;
    const toastId = toast.loading('Deleting book...');
    try {
      const result = await handleDeleteBookAction(bookId);
      if (result?.success) {
        toast.success('Book deleted successfully!', { id: toastId });
      } else {
        toast.error(result?.error || 'Failed to delete.', { id: toastId });
      }
    } catch (error) {
      toast.error('An unexpected error occurred.', { id: toastId });
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

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          title="Delete Book"
          className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-400/40 transition-all group"
        >
          <Trash2
            size={15}
            className="group-hover:scale-110 transition-transform"
          />
        </button>
      </div>

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
    </>
  );
};

export default BookActionButtons;
