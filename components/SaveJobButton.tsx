'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { Button } from './Button';

interface SaveJobButtonProps {
  jobId: string;
  initialSaved: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  className?: string;
}

export function SaveJobButton({
  jobId,
  initialSaved,
  variant = 'secondary',
  size = 'sm',
  iconOnly = true,
  className = '',
}: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up (important for JobCard links)

    setIsLoading(true);

    // Optimistic UI update
    setIsSaved(!isSaved);

    try {
      const formData = new FormData();
      formData.append('jobId', jobId);

      const response = await fetch('/api/jobs/save', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save job');
      }

      const data = await response.json();

      // Update with actual server response
      setIsSaved(data.saved);

      // Refresh the page data to update saved state in server component
      router.refresh();
    } catch (error) {
      console.error('Error saving job:', error);
      // Revert optimistic update on error
      setIsSaved(isSaved);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleSave}
      variant={isSaved ? 'primary' : variant}
      size={size}
      disabled={isLoading}
      className={className}
    >
      <Bookmark
        className={`w-4 h-4 ${isSaved ? 'fill-current' : ''} ${
          isLoading ? 'opacity-50' : ''
        }`}
      />
      {!iconOnly && (
        <span className="ml-2">{isSaved ? 'Saved' : 'Save Job'}</span>
      )}
    </Button>
  );
}
