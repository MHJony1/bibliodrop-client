'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { handleDeleteBookAction, handleToggleBookStatusAction, handleEditBookAction } from '@/lib/actions/book';
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
    if (!confirm('Are you sure you want to delete this book permanently?')) return;
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

  const isPending = status === 'Pending Approval' || status === 'Pending Delivery' || !status;

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {isPending ? (
          <button disabled title="Cannot toggle while Pending Approval"
            className="p-2 text-slate-300 dark:text-slate-700 cursor-not-allowed">
            <EyeOff size={16} />
          </button>
        ) : status === 'Published' ? (
          <button onClick={handleToggle} disabled={loading} title="Click to Unpublish"
            className="p-2 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50">
            <Eye size={16} />
          </button>
        ) : (
          <button onClick={handleToggle} disabled={loading} title="Click to Publish"
            className="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50">
            <EyeOff size={16} />
          </button>
        )}

        <button onClick={() => setShowEditModal(true)} title="Edit Details"
          className="p-2 text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all active:scale-95 cursor-pointer">
          <Edit2 size={16} />
        </button>

        <button onClick={handleDelete} title="Delete Permanently"
          className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all active:scale-95 cursor-pointer">
          <Trash2 size={16} />
        </button>
      </div>

      {/* 🎯 আলাদা করা মোডাল কম্পোনেন্টটি এখানে Portal দিয়ে সেফলি রেন্ডার হচ্ছে */}
      {mounted && showEditModal && typeof document !== 'undefined' && createPortal(
        <EditBookModal 
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditSubmit}
          editLoading={editLoading}
        />, 
        document.body
      )}
    </>
  );
};

export default BookActionButtons;