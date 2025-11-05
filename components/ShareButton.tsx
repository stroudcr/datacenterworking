'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text: string;
}

export function ShareButton({ title, text }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text,
        url: window.location.href,
      }).catch(() => {
        // User cancelled share or error occurred
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded-lg glass-hover text-silver-300 hover:text-white transition-colors"
    >
      <Share2 className="w-4 h-4" />
      Share
    </button>
  );
}
