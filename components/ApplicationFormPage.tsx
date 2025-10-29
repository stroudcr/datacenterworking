'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from './Button';
import { GlassCard } from './GlassCard';
import { Upload, FileText, Check, X, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface ApplicationFormPageProps {
  jobId: string;
  jobSlug: string;
}

export function ApplicationFormPage({ jobId, jobSlug }: ApplicationFormPageProps) {
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

  return (
    <GlassCard>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Your Application</h2>
        <p className="text-silver-400">
          Please provide at least a cover letter or resume to complete your application.
          Including both will improve your chances of being selected.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Cover Letter Section */}
        <div>
          <label className="block text-sm font-medium text-silver-200 mb-2">
            Cover Letter <span className="text-silver-500">(Optional)</span>
          </label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell the employer why you're a great fit for this position. Highlight your relevant experience, skills, and what excites you about this opportunity..."
            rows={12}
            className={clsx(
              'glass rounded-lg px-4 py-3 text-white w-full',
              'placeholder:text-silver-500',
              'focus:outline-none focus:ring-2 focus:ring-ice-500',
              'transition-all duration-200 resize-none'
            )}
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-silver-500">
              {coverLetter.length > 0 && `${coverLetter.length} characters`}
              {coverLetter.length > 0 && coverLetter.length < 50 && ' (minimum 50 characters required)'}
            </p>
            {coverLetter.length >= 50 && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Valid length
              </span>
            )}
          </div>
        </div>

        {/* Resume Upload Section */}
        <div>
          <label className="block text-sm font-medium text-silver-200 mb-2">
            Resume <span className="text-silver-500">(Optional)</span>
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
                className="glass rounded-lg px-4 py-4 text-white hover:bg-white/10 transition-all flex items-center gap-3 justify-center w-full group"
              >
                <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">
                  {resumeUrl ? 'Change Resume' : 'Upload Resume (PDF, DOC, DOCX)'}
                </span>
              </button>
            )}
          </CldUploadWidget>

          {/* Upload Error */}
          {uploadError && (
            <div className="mt-2 p-3 rounded-lg bg-red-500/10 border border-red-500/50 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">{uploadError}</p>
            </div>
          )}

          {/* Resume Preview */}
          {resumeUrl && (
            <div className="mt-3 p-4 rounded-lg glass flex items-center gap-3 border border-ice-500/30">
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
                title="Remove resume"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <p className="text-xs text-silver-500 mt-2">
            Accepted formats: PDF, DOC, DOCX • Maximum file size: 5MB
          </p>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-lg glass border border-ice-500/20">
          <h3 className="text-sm font-semibold text-white mb-2">Application Tips</h3>
          <ul className="text-sm text-silver-300 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-ice-400 mt-0.5">•</span>
              <span>Tailor your cover letter to highlight relevant experience for this specific position</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-ice-400 mt-0.5">•</span>
              <span>Ensure your resume is up-to-date and error-free</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-ice-400 mt-0.5">•</span>
              <span>Both cover letter and resume are optional, but including both strengthens your application</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button
            type="button"
            variant="ghost"
            fullWidth
            onClick={() => router.push(`/jobs/${jobSlug}`)}
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
            {loading ? 'Submitting Application...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
