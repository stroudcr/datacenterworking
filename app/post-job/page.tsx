'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSchema, type JobInput } from '@/lib/validations';
import { JOB_CATEGORIES, JOB_TYPES, SHIFT_REQUIREMENTS, SECURITY_CLEARANCE, CERTIFICATIONS, PRICING } from '@/lib/constants';
import { GlassCard } from '@/components/GlassCard';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { JobCardPreview } from '@/components/JobCardPreview';
import { CloudinaryUploadWidget } from '@/components/CloudinaryUploadWidget';
import { QuillEditor } from '@/components/QuillEditor';
import { Briefcase, DollarSign, Star, Eye } from 'lucide-react';

export default function PostJobPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [compensationType, setCompensationType] = useState<'salary' | 'hourly'>('salary');
  const [applicationMethod, setApplicationMethod] = useState<'internal' | 'external' | 'email'>('internal');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
  });

  // Watch form values for live preview
  const watchedTitle = useWatch({ control, name: 'title' });
  const watchedCompany = useWatch({ control, name: 'company' });
  const watchedCompanyLogo = useWatch({ control, name: 'companyLogo' });
  const watchedLocation = useWatch({ control, name: 'location' });
  const watchedType = useWatch({ control, name: 'type' });
  const watchedCategory = useWatch({ control, name: 'category' });
  const watchedSalaryMin = useWatch({ control, name: 'salaryMin' });
  const watchedSalaryMax = useWatch({ control, name: 'salaryMax' });
  const watchedHourlyRateMin = useWatch({ control, name: 'hourlyRateMin' });
  const watchedHourlyRateMax = useWatch({ control, name: 'hourlyRateMax' });
  const watchedDescription = useWatch({ control, name: 'description' });
  const watchedRequirements = useWatch({ control, name: 'requirements' });

  // Clear unused compensation fields when toggling between salary and hourly
  useEffect(() => {
    if (compensationType === 'salary') {
      setValue('hourlyRateMin', undefined);
      setValue('hourlyRateMax', undefined);
    } else {
      setValue('salaryMin', undefined);
      setValue('salaryMax', undefined);
    }
  }, [compensationType, setValue]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const onSubmit = async (data: JobInput) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          isFeatured,
          tags,
          enableInternalApplications: applicationMethod === 'internal',
          applyUrl: applicationMethod === 'external' ? data.applyUrl : undefined,
          applyEmail: applicationMethod === 'email' ? data.applyEmail : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create job');
      }

      // Redirect to Stripe checkout
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const totalPrice = isFeatured
    ? (PRICING.BASE_LISTING + PRICING.FEATURED_UPGRADE) / 100
    : PRICING.BASE_LISTING / 100;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Post a Job</h1>
          <p className="text-silver-400">
            Reach qualified data center professionals
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr,480px] lg:gap-8 lg:items-start">
          {/* Left Column: Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
              {error}
            </div>
          )}

          {/* Job Details */}
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-4">
              Job Details
            </h2>
            <div className="space-y-4">
              <Input
                label="Your Email *"
                type="email"
                placeholder="your@email.com"
                fullWidth
                error={errors.email?.message}
                {...register('email')}
              />
              <p className="text-xs text-silver-500 -mt-2">
                We'll send your payment receipt and a link to manage your job posting
              </p>

              <Input
                label="Job Title *"
                placeholder="e.g., Senior Data Center Technician"
                fullWidth
                error={errors.title?.message}
                {...register('title')}
              />

              <Input
                label="Company Name *"
                placeholder="Your company name"
                fullWidth
                error={errors.company?.message}
                {...register('company')}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-silver-200">
                  Company Logo
                </label>
                <CloudinaryUploadWidget
                  onUploadSuccess={(url) => setValue('companyLogo', url)}
                  currentUrl={watchedCompanyLogo}
                />
                {errors.companyLogo && (
                  <span className="text-sm text-red-400">
                    {errors.companyLogo.message as string}
                  </span>
                )}
                <p className="text-xs text-silver-500 mt-1">
                  Recommended: Square image, max 2MB (PNG, JPG, SVG)
                </p>
              </div>

              <Input
                label="Location *"
                placeholder="e.g., San Francisco, CA or Remote"
                fullWidth
                error={errors.location?.message}
                {...register('location')}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-silver-200">
                    Job Type *
                  </label>
                  <select
                    className="glass rounded-lg px-4 py-2.5 text-white"
                    {...register('type')}
                  >
                    {JOB_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <span className="text-sm text-red-400">
                      {errors.type.message as string}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-silver-200">
                    Category *
                  </label>
                  <select
                    className="glass rounded-lg px-4 py-2.5 text-white text-sm"
                    {...register('category')}
                  >
                    {JOB_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="text-sm text-red-400">
                      {errors.category.message as string}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-silver-200">
                    Shift Requirements
                  </label>
                  <select
                    className="glass rounded-lg px-4 py-2.5 text-white text-sm"
                    {...register('shift')}
                  >
                    <option value="">Select shift (optional)</option>
                    {SHIFT_REQUIREMENTS.map((shift) => (
                      <option key={shift} value={shift}>
                        {shift}
                      </option>
                    ))}
                  </select>
                  {errors.shift && (
                    <span className="text-sm text-red-400">
                      {errors.shift.message as string}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-silver-200">
                    Security Clearance
                  </label>
                  <select
                    className="glass rounded-lg px-4 py-2.5 text-white text-sm"
                    {...register('clearance')}
                  >
                    <option value="">Select clearance (optional)</option>
                    {SECURITY_CLEARANCE.map((clearance) => (
                      <option key={clearance} value={clearance}>
                        {clearance}
                      </option>
                    ))}
                  </select>
                  {errors.clearance && (
                    <span className="text-sm text-red-400">
                      {errors.clearance.message as string}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-silver-200">
                    Certifications
                  </label>
                  <select
                    className="glass rounded-lg px-4 py-2.5 text-white text-sm"
                    {...register('certifications')}
                  >
                    <option value="">Select certification (optional)</option>
                    {CERTIFICATIONS.map((cert) => (
                      <option key={cert} value={cert}>
                        {cert}
                      </option>
                    ))}
                  </select>
                  {errors.certifications && (
                    <span className="text-sm text-red-400">
                      {errors.certifications.message as string}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-silver-200">
                  Job Description *
                </label>
                <QuillEditor
                  value={watchedDescription || ''}
                  onChange={(value) => setValue('description', value)}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                  error={errors.description?.message}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-silver-200">
                  Requirements *
                </label>
                <QuillEditor
                  value={watchedRequirements || ''}
                  onChange={(value) => setValue('requirements', value)}
                  placeholder="List required skills, experience, and qualifications..."
                  error={errors.requirements?.message}
                />
              </div>
            </div>
          </GlassCard>

          {/* Compensation */}
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Compensation
            </h2>
            <div className="space-y-4">
              {/* Compensation Type Toggle */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCompensationType('salary')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    compensationType === 'salary'
                      ? 'bg-ice-500 text-white'
                      : 'glass text-silver-300 hover:bg-white/10'
                  }`}
                >
                  Annual Salary
                </button>
                <button
                  type="button"
                  onClick={() => setCompensationType('hourly')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    compensationType === 'hourly'
                      ? 'bg-ice-500 text-white'
                      : 'glass text-silver-300 hover:bg-white/10'
                  }`}
                >
                  Hourly Rate
                </button>
              </div>

              {compensationType === 'salary' ? (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Min Salary ($)"
                    type="number"
                    placeholder="80000"
                    fullWidth
                    error={errors.salaryMin?.message}
                    {...register('salaryMin', { valueAsNumber: true })}
                  />
                  <Input
                    label="Max Salary ($)"
                    type="number"
                    placeholder="120000"
                    fullWidth
                    error={errors.salaryMax?.message}
                    {...register('salaryMax', { valueAsNumber: true })}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Min Hourly Rate ($)"
                    type="number"
                    placeholder="35"
                    step="0.01"
                    fullWidth
                    error={errors.hourlyRateMin?.message}
                    {...register('hourlyRateMin', { valueAsNumber: true })}
                  />
                  <Input
                    label="Max Hourly Rate ($)"
                    type="number"
                    placeholder="50"
                    step="0.01"
                    fullWidth
                    error={errors.hourlyRateMax?.message}
                    {...register('hourlyRateMax', { valueAsNumber: true })}
                  />
                </div>
              )}
            </div>
          </GlassCard>

          {/* Application */}
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-4">
              How to Accept Applications
            </h2>
            <div className="space-y-4">
              {/* Radio button options */}
              <div className="space-y-3">
                <label className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                  applicationMethod === 'internal'
                    ? 'bg-ice-500/20 border-2 border-ice-500'
                    : 'glass hover:bg-white/10'
                }`}>
                  <input
                    type="radio"
                    name="applicationMethod"
                    value="internal"
                    checked={applicationMethod === 'internal'}
                    onChange={() => setApplicationMethod('internal')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">Accept Applications on This Site</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-ice-500 text-white">Recommended</span>
                    </div>
                    <p className="text-sm text-silver-400">
                      Job seekers submit their resume and cover letter directly through our platform. Track and manage all applications in your employer dashboard.
                    </p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                  applicationMethod === 'external'
                    ? 'bg-ice-500/20 border-2 border-ice-500'
                    : 'glass hover:bg-white/10'
                }`}>
                  <input
                    type="radio"
                    name="applicationMethod"
                    value="external"
                    checked={applicationMethod === 'external'}
                    onChange={() => setApplicationMethod('external')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <span className="text-white font-medium block mb-1">Redirect to External Application Page</span>
                    <p className="text-sm text-silver-400">
                      Send applicants to your company's careers page or ATS system
                    </p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                  applicationMethod === 'email'
                    ? 'bg-ice-500/20 border-2 border-ice-500'
                    : 'glass hover:bg-white/10'
                }`}>
                  <input
                    type="radio"
                    name="applicationMethod"
                    value="email"
                    checked={applicationMethod === 'email'}
                    onChange={() => setApplicationMethod('email')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <span className="text-white font-medium block mb-1">Receive Applications via Email</span>
                    <p className="text-sm text-silver-400">
                      Applicants will email their application materials directly to you
                    </p>
                  </div>
                </label>
              </div>

              {/* Conditional input fields */}
              {applicationMethod === 'external' && (
                <Input
                  label="Application URL *"
                  placeholder="https://yourcompany.com/careers/apply"
                  fullWidth
                  error={errors.applyUrl?.message}
                  {...register('applyUrl')}
                />
              )}

              {applicationMethod === 'email' && (
                <Input
                  label="Application Email *"
                  type="email"
                  placeholder="careers@yourcompany.com"
                  fullWidth
                  error={errors.applyEmail?.message}
                  {...register('applyEmail')}
                />
              )}
            </div>
          </GlassCard>

          {/* Tags */}
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-4">
              Skills & Tags *
            </h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="e.g., HVAC, Electrical, Linux..."
                  className="flex-1 glass rounded-lg px-4 py-2 text-white"
                />
                <Button type="button" onClick={addTag} variant="secondary">
                  Add
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full glass text-sm text-ice-400 flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {errors.tags && (
                <span className="text-sm text-red-400">{errors.tags.message as string}</span>
              )}
            </div>
          </GlassCard>
        </form>

          {/* Right Column: Preview */}
          <div className="hidden lg:block self-start" style={{ position: 'sticky', top: '6.5rem' }}>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-ice-400" />
                    <h2 className="text-xl font-semibold text-white">Live Preview</h2>
                  </div>
                  <p className="text-sm text-silver-400">
                    See how your job posting will appear to candidates
                  </p>
                </div>
                <JobCardPreview
                  title={watchedTitle}
                  company={watchedCompany}
                  companyLogo={watchedCompanyLogo}
                  location={watchedLocation}
                  type={watchedType}
                  category={watchedCategory}
                  salaryMin={compensationType === 'salary' ? watchedSalaryMin : undefined}
                  salaryMax={compensationType === 'salary' ? watchedSalaryMax : undefined}
                  hourlyRateMin={compensationType === 'hourly' ? watchedHourlyRateMin : undefined}
                  hourlyRateMax={compensationType === 'hourly' ? watchedHourlyRateMax : undefined}
                  isFeatured={isFeatured}
                  tags={tags}
                />

                {/* Featured Upgrade */}
                <GlassCard>
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="featured" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-amber-400 fill-current" />
                        <span className="text-lg font-semibold text-white">
                          Featured Job Listing
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                          +${PRICING.FEATURED_UPGRADE / 100}
                        </span>
                      </div>
                      <ul className="text-sm text-silver-300 space-y-1 ml-7">
                        <li>• Homepage placement for 7 days</li>
                        <li>• Priority in search results</li>
                        <li>• Social media promotion</li>
                        <li>• Highlighted in email alerts</li>
                      </ul>
                    </label>
                  </div>
                </GlassCard>

                {/* Order Summary */}
                <GlassCard>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Order Summary</h2>
                  </div>
                  <div className="space-y-2 text-silver-300">
                    <div className="flex justify-between">
                      <span>30-Day Job Listing</span>
                      <span>${PRICING.BASE_LISTING / 100}</span>
                    </div>
                    {isFeatured && (
                      <div className="flex justify-between">
                        <span>Featured Upgrade</span>
                        <span>${PRICING.FEATURED_UPGRADE / 100}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-2 mt-2 flex justify-between text-lg font-semibold text-white">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                </GlassCard>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={loading}
                  onClick={handleSubmit(onSubmit)}
                >
                  {loading ? 'Creating...' : `Post a Job ($${totalPrice})`}
                </Button>

                <p className="text-center text-sm text-silver-400">
                  You'll be redirected to Stripe to complete your payment securely
                </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
