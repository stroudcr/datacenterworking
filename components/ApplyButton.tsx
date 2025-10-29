'use client';

import { useState } from 'react';
import { Button } from './Button';
import { ApplicationForm } from './ApplicationForm';

interface ApplyButtonProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
}

export function ApplyButton({ jobId, jobTitle, companyName }: ApplyButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        fullWidth
        onClick={() => setIsModalOpen(true)}
      >
        Apply Now
      </Button>

      <ApplicationForm
        jobId={jobId}
        jobTitle={jobTitle}
        companyName={companyName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
