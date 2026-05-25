import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center px-6 py-2 min-h-[44px] text-sm font-medium transition-colors outline-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-zinc-100 text-zinc-950 hover:bg-white",
      secondary: "bg-transparent text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-white",
      ghost: "bg-transparent text-zinc-500 hover:text-zinc-100",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
