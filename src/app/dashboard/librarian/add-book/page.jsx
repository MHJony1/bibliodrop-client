'use client';

import { useState } from 'react';
import { BookOpen, User, Layers, FileText, DollarSign, Send, Landmark } from 'lucide-react';
import FormInput from '@/components/dashboardrelated/librarianrelated/FormInput';
import ImageUploadZone from '@/components/dashboardrelated/librarianrelated/ImageUploadZone';
import toast from 'react-hot-toast';
import { handleAddBookAction } from '@/lib/actions/book';

export default function AddBookPage() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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
    const toastId = toast.loading('Uploading image and processing book details...');
    const formData = new FormData(e.target);
    
    try {
      // 1. Upload cover image to ImageBB API
      const imgbbFormData = new FormData();
      imgbbFormData.append('image', selectedFile);

      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: imgbbFormData,
      });

      const imgbbData = await imgbbResponse.json();
      if (!imgbbData.success) throw new Error('Image Upload Failed');

      // 2. Structuring data payload
      // 🎯 নোট: এখান থেকে librarianEmail প্রপার্টি বাদ দেওয়া হয়েছে, এটি এখন ব্যাকএন্ডে সার্ভার অ্যাকশন নিজে বসাবে।
      const finalBookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        description: formData.get('description'),
        category: formData.get('category') ? formData.get('category').toLowerCase() : '', 
        bookPrice: parseFloat(formData.get('bookPrice')) || 0, 
        deliveryFee: parseFloat(formData.get('deliveryFee')) || 0,
        coverImage: imgbbData.data.display_url,
        status: 'Pending Approval'
      };

      console.log('Structured Server Payload:', finalBookData);

      // 3. Trigger Server Action
      const result = await handleAddBookAction(finalBookData);

      if (result.success) {
        toast.success(result.message || 'Book submitted successfully for approval!', { id: toastId });
        e.target.reset();
        handleClearImage();
      } else {
        toast.error(`Failed to list the book: ${result.error}`, { id: toastId });
      }

    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to list the book. Try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100">
      
      {/* Header Section */}
      <div className="mb-8 border-b border-slate-100 dark:border-white/5 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Add New Book
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          Fill in the details to list a new book. It will be pending approval.
        </p>
      </div>

      {/* Modern Form Wrapper Card */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5 rounded-2xl shadow-xs p-6 sm:p-8 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1: Title & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput 
              label="Title" 
              name="title" 
              icon={BookOpen} 
              placeholder="Book title" 
            />
            <FormInput 
              label="Author" 
              name="author" 
              icon={User} 
              placeholder="Author name" 
            />
          </div>

          {/* Row 2: Description */}
          <div className="flex flex-col w-full">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Description <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-xs">
              <FileText className="absolute left-4 top-4 text-slate-400 dark:text-slate-500" size={18} />
              <textarea
                required
                name="description"
                rows={4}
                placeholder="Brief description of the book..."
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-amber-500/20 focus:border-violet-500 dark:focus:border-amber-500/50 transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Row 3: Category, Price & Delivery Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col w-full">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                <select 
                  required
                  name="category" 
                  className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-hidden focus:border-violet-500 dark:focus:border-amber-500/50 transition-colors appearance-none cursor-pointer"
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                  <span className="text-xs">▼</span>
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
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-violet-600 dark:bg-linear-to-r dark:from-amber-400 dark:to-amber-500 text-white dark:text-slate-950 font-bold tracking-wide shadow-md hover:bg-violet-700 dark:hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] hover:scale-[1.005] active:scale-[0.995] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} />
                  Submit for Approval
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}