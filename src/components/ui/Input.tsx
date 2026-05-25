import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  unit?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, unit, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            type={type}
            ref={ref}
            className={`
              w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono text-zinc-300 
              min-h-[44px] transition-colors
              focus:outline-none focus:border-cyan-cooling focus:ring-1 focus:ring-cyan-cooling/50
              disabled:opacity-50 disabled:cursor-not-allowed
              ${unit ? 'pr-10' : ''}
              ${className || ''}
            `}
            {...props}
          />
          {unit && (
            <span className="absolute right-3 text-zinc-600 text-xs font-mono pointer-events-none">
              {unit}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
