'use client';

export default function FormInput({ label, name, type = 'text', icon: Icon, placeholder, required = true, min, step }) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative rounded-xl shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon size={18} />
          </div>
        )}
        <input
          required={required}
          name={name}
          type={type}
          min={min}
          step={step}
          placeholder={placeholder}
          className={`w-full py-3.5 pr-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-amber-500/20 focus:border-violet-500 dark:focus:border-amber-500/50 transition-all duration-200 ${
            Icon ? 'pl-11' : 'pl-4'
          }`}
        />
      </div>
    </div>
  );
}