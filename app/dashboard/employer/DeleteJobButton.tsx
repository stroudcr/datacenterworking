'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/Button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteJob } from './actions';

interface DeleteJobButtonProps {
  jobId: string;
  jobTitle: string;
}

export function DeleteJobButton({ jobId, jobTitle }: DeleteJobButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteJob(jobId);
        setShowConfirm(false);
      } catch (error: any) {
        console.error('Failed to delete job:', error);
        alert(error.message || 'Failed to delete job. Please try again.');
      }
    });
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="text-red-400 hover:text-red-300"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Confirm?'
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setShowConfirm(true)}
      title={`Delete ${jobTitle}`}
    >
      <Trash2 className="w-4 h-4 text-red-400" />
    </Button>
  );
}
