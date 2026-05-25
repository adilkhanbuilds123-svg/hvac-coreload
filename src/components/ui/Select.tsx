import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono text-zinc-300 
            min-h-[44px] transition-colors
            focus:outline-none focus:border-cyan-cooling focus:ring-1 focus:ring-cyan-cooling/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className || ''}
          `}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';
