'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSchema, type JobInput } from '@/lib/validations';
import { JOB_CATEGORIES, JOB_TYPES, PRICING } from '@/lib/constants';
import { GlassCard } from '@/components/GlassCard';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Briefcase, DollarSign, Star } from 'lucide-react';

export default function PostJobPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
  });

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
        body: JSON.stringify({ ...data, isFeatured, tags }),
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
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Post a Job</h1>
          <p className="text-silver-400">
            Reach qualified data center professionals
          </p>
        </div>

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

              <Input
                label="Company Logo URL"
                placeholder="https://..."
                fullWidth
                error={errors.companyLogo?.message}
                {...register('companyLogo')}
              />

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
                      {errors.type.message}
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
                      {errors.category.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-silver-200">
                  Job Description *
                </label>
                <textarea
                  className="glass rounded-lg px-4 py-2.5 text-white min-h-[150px] resize-y"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                  {...register('description')}
                />
                {errors.description && (
                  <span className="text-sm text-red-400">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-silver-200">
                  Requirements *
                </label>
                <textarea
                  className="glass rounded-lg px-4 py-2.5 text-white min-h-[120px] resize-y"
                  placeholder="List required skills, experience, and qualifications..."
                  {...register('requirements')}
                />
                {errors.requirements && (
                  <span className="text-sm text-red-400">
                    {errors.requirements.message}
                  </span>
                )}
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
              <Input
                label="Salary Range (optional)"
                placeholder="e.g., $80k-$120k"
                fullWidth
                {...register('salary')}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Min Salary ($)"
                  type="number"
                  placeholder="80000"
                  fullWidth
                  {...register('salaryMin', { valueAsNumber: true })}
                />
                <Input
                  label="Max Salary ($)"
                  type="number"
                  placeholder="120000"
                  fullWidth
                  {...register('salaryMax', { valueAsNumber: true })}
                />
              </div>
            </div>
          </GlassCard>

          {/* Application */}
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-4">
              How to Apply
            </h2>
            <div className="space-y-4">
              <Input
                label="Application URL"
                placeholder="https://yourcompany.com/careers/apply"
                fullWidth
                {...register('applyUrl')}
              />

              <div className="text-center text-sm text-silver-400">OR</div>

              <Input
                label="Application Email"
                type="email"
                placeholder="careers@yourcompany.com"
                fullWidth
                {...register('applyEmail')}
              />
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
                <span className="text-sm text-red-400">{errors.tags.message}</span>
              )}
            </div>
          </GlassCard>

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

          {/* Summary */}
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Creating...' : `Continue to Payment ($${totalPrice})`}
          </Button>

          <p className="text-center text-sm text-silver-400">
            You'll be redirected to Stripe to complete your payment securely
          </p>
        </form>
      </div>
    </div>
  );
}
