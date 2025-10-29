'use client';

import { useRouter } from 'next/navigation';
import { Button } from './Button';

interface ApplyButtonProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  jobSlug: string;
}

export function ApplyButton({ jobId, jobTitle, companyName, jobSlug }: ApplyButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="primary"
      fullWidth
      onClick={() => router.push(`/jobs/${jobSlug}/apply`)}
    >
      Apply Now
    </Button>
  );
}
