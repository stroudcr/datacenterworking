import { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function GlassCard({ children, className, hover = false, onClick, style }: GlassCardProps) {
  return (
    <div
      className={clsx(
        'glass rounded-xl p-6',
        hover && 'glass-hover cursor-pointer',
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
