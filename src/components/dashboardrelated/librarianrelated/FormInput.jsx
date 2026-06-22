'use client';

export default function FormInput({
  label,
  name,
  type = 'text',
  icon: Icon,
  placeholder,
  required = true,
  min,
  step,
}) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-semibold text-slate-300 mb-2">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
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
          className={`w-full py-3.5 pr-4 bg-slate-900/60 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all duration-200 ${
            Icon ? 'pl-11' : 'pl-4'
          }`}
        />
      </div>
    </div>
  );
}
