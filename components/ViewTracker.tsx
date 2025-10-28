'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  jobId: string;
}

export function ViewTracker({ jobId }: ViewTrackerProps) {
  useEffect(() => {
    // Track view asynchronously without blocking render
    fetch(`/api/jobs/${jobId}/view`, {
      method: 'POST',
    }).catch(() => {
      // Silently fail - view tracking is not critical
    });
  }, [jobId]);

  return null; // This component doesn't render anything
}
