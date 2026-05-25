'use client';

import Link from 'next/link';

interface ConsoleButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'cyan' | 'orange';
}

export function ConsoleButton({ href, onClick, children, className = '', variant = 'primary' }: ConsoleButtonProps) {
  // Map legacy variants to new variants
  const actualVariant = variant === 'cyan' || variant === 'primary' ? 'primary' : 'secondary';

  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors outline-none cursor-pointer";
  
  const variants = {
    primary: "bg-zinc-100 text-zinc-950 hover:bg-white",
    secondary: "bg-transparent text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-white"
  };

  const combinedClassName = `${baseStyles} ${variants[actualVariant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClassName}>
      {children}
    </button>
  );
}
