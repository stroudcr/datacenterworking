import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className, id, ...props }, ref) => {
    return (
      <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-silver-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            'glass rounded-lg px-4 py-2.5 text-white',
            'placeholder:text-silver-500',
            'focus:outline-none focus:ring-2 focus:ring-ice-500',
            'transition-[border-color,box-shadow,background-color] duration-200',
            error && 'ring-2 ring-red-500',
            fullWidth && 'w-full',
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
