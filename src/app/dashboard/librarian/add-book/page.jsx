'use client';

import { useState } from 'react';
import {
  BookOpen,
  User,
  Layers,
  FileText,
  DollarSign,
  Send,
  Landmark,
  Upload,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import FormInput from '@/components/dashboardrelated/librarianrelated/FormInput';
import ImageUploadZone from '@/components/dashboardrelated/librarianrelated/ImageUploadZone';
import toast from 'react-hot-toast';
import { handleAddBookAction } from '@/lib/actions/book';
import { motion } from 'framer-motion';

export default function AddBookPage() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formProgress, setFormProgress] = useState(0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      return toast.error('Please upload a book cover image!');
    }

    setLoading(true);
    setFormProgress(25);
    const toastId = toast.loading(
      'Uploading image and processing book details...',
    );
    const formData = new FormData(e.target);

    try {
      // 1. Upload cover image to ImageBB API
      setFormProgress(50);
      const imgbbFormData = new FormData();
      imgbbFormData.append('image', selectedFile);

      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      const imgbbResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: 'POST',
          body: imgbbFormData,
        },
      );

      const imgbbData = await imgbbResponse.json();
      if (!imgbbData.success) throw new Error('Image Upload Failed');

      setFormProgress(75);

      // 2. Structuring data payload
      const finalBookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        description: formData.get('description'),
        category: formData.get('category')
          ? formData.get('category').toLowerCase()
          : '',
        bookPrice: parseFloat(formData.get('bookPrice')) || 0,
        deliveryFee: parseFloat(formData.get('deliveryFee')) || 0,
        coverImage: imgbbData.data.display_url,
        status: 'Pending Approval',
      };

      // 3. Trigger Server Action
      const result = await handleAddBookAction(finalBookData);

      setFormProgress(100);

      if (result.success) {
        toast.success(
          result.message || 'Book submitted successfully for approval!',
          { id: toastId },
        );
        e.target.reset();
        handleClearImage();
        setFormProgress(0);
      } else {
        toast.error(`Failed to list the book: ${result.error}`, {
          id: toastId,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to list the book. Try again.', {
        id: toastId,
      });
      setFormProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 backdrop-blur-sm">
              <BookOpen size={22} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Add New Book
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Fill in the details to list a new book. It will be pending
                approval.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs text-amber-400 font-medium">
            Pending Approval
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Uploading...</span>
            <span>{formProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${formProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* Form Card */}
      <div className="w-full rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl shadow-black/40 bg-slate-900/30 backdrop-blur-sm">
        <div className="px-6 py-3.5 bg-slate-900/80 border-b border-slate-800/60 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 text-xs font-medium">
            Book Details Form
          </span>
          <span className="text-slate-600 text-xs ml-auto">
            * Required fields
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Title & Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="Title"
                name="title"
                icon={BookOpen}
                placeholder="Enter book title"
              />
              <FormInput
                label="Author"
                name="author"
                icon={User}
                placeholder="Enter author name"
              />
            </div>

            {/* Row 2: Description */}
            <div className="flex flex-col w-full">
              <label className="text-sm font-semibold text-slate-300 mb-2">
                Description <span className="text-rose-400">*</span>
              </label>
              <div className="relative rounded-xl">
                <FileText
                  className="absolute left-4 top-4 text-slate-500"
                  size={18}
                />
                <textarea
                  required
                  name="description"
                  rows={4}
                  placeholder="Brief description of the book..."
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Row 3: Category, Price & Delivery Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="flex flex-col w-full">
                <label className="text-sm font-semibold text-slate-300 mb-2">
                  Category <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Layers
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <select
                    required
                    name="category"
                    className="w-full pl-11 pr-10 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select category</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Academic">Academic</option>
                    <option value="History">History</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Biography">Biography</option>
                    <option value="Romance">Romance</option>
                    <option value="Self-Help">Self-Help</option>
                    <option value="Mystery">Mystery</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <FormInput
                label="Book Price ($)"
                name="bookPrice"
                type="number"
                min="0"
                step="0.01"
                icon={DollarSign}
                placeholder="0.00"
              />

              <FormInput
                label="Delivery Fee ($)"
                name="deliveryFee"
                type="number"
                min="0"
                step="0.01"
                icon={Landmark}
                placeholder="4.99"
              />
            </div>

            {/* Row 4: Image Upload */}
            <ImageUploadZone
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onClearImage={handleClearImage}
            />

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold tracking-wide shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.3)] hover:scale-[1.005] active:scale-[0.995] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit for Approval
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-500 mt-3">
                Your book will be reviewed by admin before publication
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
