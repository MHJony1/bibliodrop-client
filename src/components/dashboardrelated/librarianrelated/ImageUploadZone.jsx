'use client';

import { Upload, X } from 'lucide-react';

export default function ImageUploadZone({ imagePreview, onImageChange, onClearImage }) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Cover Image <span className="text-rose-500">*</span>
      </label>
      
      <div className="relative w-full border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl hover:border-violet-500 dark:hover:border-amber-500/50 bg-slate-50/50 dark:bg-slate-900/40 transition-all duration-300 group overflow-hidden min-h-[220px] flex items-center justify-center">
        {!imagePreview ? (
          <label className="w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              onChange={onImageChange} 
              className="hidden" 
              required
            />
            <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-100 dark:border-white/5 mb-3 text-slate-400 group-hover:text-violet-500 dark:group-hover:text-amber-400 transition-colors">
              <Upload size={22} />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              PNG, JPG up to 5MB
            </p>
          </label>
        ) : (
          <div className="relative w-full p-4 flex items-center justify-center bg-slate-100/50 dark:bg-slate-950/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imagePreview} 
              alt="Book cover preview" 
              className="max-h-56 object-contain rounded-xl shadow-md border border-slate-200/60 dark:border-white/10"
            />
            <button
              type="button"
              onClick={onClearImage}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}