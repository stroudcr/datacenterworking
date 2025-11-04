import { TextareaHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, fullWidth = false, className, ...props }, ref) => {
    return (
      <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label className="text-sm font-medium text-silver-200">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'glass rounded-lg px-4 py-2.5 text-white',
            'placeholder:text-silver-500',
            'focus:outline-none focus:ring-2 focus:ring-ice-500',
            'transition-[border-color,box-shadow,background-color] duration-200',
            'min-h-[120px] resize-y',
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

Textarea.displayName = 'Textarea';
