'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from './Button';
import { X, Upload, FileText, Check } from 'lucide-react';
import clsx from 'clsx';

interface ApplicationFormProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationForm({
  jobId,
  jobTitle,
  companyName,
  isOpen,
  onClose,
}: ApplicationFormProps) {
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate at least one field is provided
    if (!coverLetter.trim() && !resumeUrl) {
      setError('Please provide either a cover letter or resume');
      setLoading(false);
      return;
    }

    // Validate cover letter length if provided
    if (coverLetter.trim() && coverLetter.trim().length < 50) {
      setError('Cover letter must be at least 50 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          coverLetter: coverLetter.trim() || undefined,
          resume: resumeUrl || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Application submission failed');
      }

      // Redirect to success page
      router.push(`/applications/success?jobId=${jobId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 glass border-b border-white/10 p-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Apply for Position</h2>
              <p className="text-silver-300 text-sm">
                {jobTitle} at {companyName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-silver-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-silver-200 mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit for this position..."
                rows={8}
                className={clsx(
                  'glass rounded-lg px-4 py-3 text-white w-full',
                  'placeholder:text-silver-500',
                  'focus:outline-none focus:ring-2 focus:ring-ice-500',
                  'transition-all duration-200 resize-none'
                )}
              />
              <p className="text-xs text-silver-500 mt-1">
                {coverLetter.length > 0 && `${coverLetter.length} characters`}
                {coverLetter.length > 0 && coverLetter.length < 50 && ' (minimum 50 characters)'}
              </p>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-silver-200 mb-2">
                Resume (Optional)
              </label>

              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(result: any) => {
                  const url = result.info.secure_url;
                  const filename = result.info.original_filename || 'resume';
                  setResumeUrl(url);
                  setResumeFileName(filename);
                  setUploadError('');
                }}
                onError={() => {
                  setUploadError('Failed to upload resume. Please try again.');
                }}
                options={{
                  maxFiles: 1,
                  maxFileSize: 5000000, // 5MB
                  resourceType: 'auto',
                  clientAllowedFormats: ['pdf', 'doc', 'docx'],
                  folder: 'resumes',
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="glass rounded-lg px-4 py-3 text-white text-sm hover:bg-white/10 transition-all flex items-center gap-2 justify-center w-full"
                  >
                    <Upload className="w-4 h-4" />
                    {resumeUrl ? 'Change Resume' : 'Upload Resume (PDF, DOC, DOCX)'}
                  </button>
                )}
              </CldUploadWidget>

              {/* Upload Error */}
              {uploadError && (
                <p className="text-xs text-red-400 mt-2">{uploadError}</p>
              )}

              {/* Resume Preview */}
              {resumeUrl && (
                <div className="mt-3 p-3 rounded-lg glass flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-ice-500/20">
                    <Check className="w-5 h-5 text-ice-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {resumeFileName || 'resume.pdf'}
                    </p>
                    <p className="text-xs text-silver-400">Resume uploaded successfully</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeUrl('');
                      setResumeFileName('');
                    }}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-silver-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <p className="text-xs text-silver-500 mt-2">
                Accepted formats: PDF, DOC, DOCX (max 5MB)
              </p>
            </div>

            {/* Info Note */}
            <div className="p-4 rounded-lg glass border border-ice-500/20">
              <p className="text-sm text-silver-300">
                <span className="font-medium text-white">Note:</span> Please provide at least a cover letter or resume.
                Both are optional but we recommend including both to increase your chances.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading || (!coverLetter.trim() && !resumeUrl)}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
