'use client';

import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function ImageUploadZone({
  imagePreview,
  onImageChange,
  onClearImage,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageChange({ target: { files: [file] } });
    }
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-semibold text-slate-300 mb-2">
        Cover Image <span className="text-rose-400">*</span>
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-full border-2 border-dashed rounded-2xl 
          transition-all duration-300 overflow-hidden min-h-[220px] 
          flex items-center justify-center
          ${
            isDragging
              ? 'border-emerald-500/60 bg-emerald-500/10'
              : imagePreview
                ? 'border-emerald-500/30 bg-slate-900/40'
                : 'border-slate-700/50 hover:border-emerald-500/40 bg-slate-900/20'
          }
        `}
      >
        {!imagePreview ? (
          <label className="w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
              required
            />
            <div
              className={`
              p-4 rounded-2xl border transition-all duration-300 mb-3
              ${
                isDragging
                  ? 'bg-emerald-500/20 border-emerald-500/40'
                  : 'bg-slate-800/40 border-slate-700/50 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30'
              }
            `}
            >
              <Upload
                size={24}
                className={`
                transition-colors duration-300
                ${isDragging ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400'}
              `}
              />
            </div>
            <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              {isDragging
                ? 'Drop your image here'
                : 'Click to upload or drag & drop'}
            </p>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-2">
              <span>PNG, JPG, WEBP</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>Max 5MB</span>
            </p>
          </label>
        ) : (
          <div className="relative w-full p-4 flex items-center justify-center">
            <div className="relative max-h-56 w-auto rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 group">
              <Image
                src={imagePreview}
                alt="Book cover preview"
                width={400}
                height={500}
                className="object-contain max-h-56"
                unoptimized={imagePreview.startsWith('blob:')}
                priority
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-xs text-white font-medium bg-black/60 px-3 py-1.5 rounded-lg">
                  Preview
                </span>
              </div>
            </div>

            {/* Delete Button */}
            <button
              type="button"
              onClick={onClearImage}
              className="absolute top-4 right-4 p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 hover:border-rose-400/50 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer shadow-lg z-10"
            >
              <X size={16} />
            </button>

            {/* Image info badge */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50 backdrop-blur-sm z-10">
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
                <ImageIcon size={12} className="text-emerald-400" />
                Cover uploaded
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
