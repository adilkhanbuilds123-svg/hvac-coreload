import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center gap-3 min-h-[44px]">
        <input
          type="checkbox"
          ref={ref}
          className={`
            w-5 h-5 accent-cyan-cooling bg-zinc-950 border border-zinc-800 rounded
            focus:outline-none focus:ring-2 focus:ring-cyan-cooling/50 focus:ring-offset-1 focus:ring-offset-zinc-950
            transition-all cursor-pointer
            ${className || ''}
          `}
          {...props}
        />
        <label className="text-xs font-mono text-zinc-400 cursor-pointer select-none">
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
