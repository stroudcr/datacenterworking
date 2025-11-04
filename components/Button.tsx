import { ReactNode, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-lg font-medium transition-[background-color,box-shadow,transform,color] duration-200',
        'flex items-center justify-center',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          // Variants
          'bg-gradient-to-r from-ice-500 to-ice-600 text-white hover:from-ice-600 hover:to-ice-700 shadow-lg hover:shadow-xl':
            variant === 'primary' && !disabled,
          'glass hover:bg-white/10 text-white': variant === 'secondary' && !disabled,
          'border-2 border-ice-500 text-ice-400 hover:bg-ice-500/10':
            variant === 'outline' && !disabled,
          'text-silver-300 hover:text-white hover:bg-white/5':
            variant === 'ghost' && !disabled,

          // Sizes
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',

          // Full width
          'w-full': fullWidth,
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
