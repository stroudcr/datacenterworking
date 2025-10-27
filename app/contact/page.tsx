'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import {
  MessageSquare,
  Mail,
  Send,
  Check,
  Clock,
  Users,
  Building2,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

const inquiryTypes = [
  { value: 'general', label: 'General Question' },
  { value: 'job-seeker', label: 'Job Seeker Support' },
  { value: 'employer', label: 'Employer Support' },
  { value: 'partnership', label: 'Partnership Inquiry' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'feedback', label: 'Feedback & Suggestions' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'general',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        inquiryType: 'general',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-6">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get In{' '}
            <span className="animated-gradient bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl text-silver-300 mb-8 max-w-3xl mx-auto">
            Have questions? We're here to assist both job seekers and employers with support, inquiries, and feedback.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            {/* Contact Form */}
            <GlassCard>
              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-silver-400 mb-6">
                    We've received your message and will get back to you within 24-48 hours.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSuccess(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>

                  {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <Input
                      label="Full Name *"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      fullWidth
                    />

                    {/* Email */}
                    <Input
                      label="Email Address *"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      fullWidth
                    />

                    {/* Inquiry Type */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-silver-200">
                        Inquiry Type *
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="glass rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-ice-500 transition-all duration-200"
                        required
                      >
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subject */}
                    <Input
                      label="Subject *"
                      name="subject"
                      type="text"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      fullWidth
                    />

                    {/* Message */}
                    <Textarea
                      label="Message *"
                      name="message"
                      placeholder="Please provide details about your question or inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      fullWidth
                      rows={6}
                    />

                    {/* Character Count */}
                    <div className="text-right text-xs text-silver-500">
                      {formData.message.length} / 1000 characters
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={loading}
                    >
                      {loading ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </GlassCard>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Email Support */}
              <GlassCard>
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-ice-500/20">
                    <Mail className="w-5 h-5 text-ice-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email Support</h3>
                    <a
                      href="mailto:support@workindatacenter.com"
                      className="text-ice-400 hover:text-ice-300 transition-colors text-sm"
                    >
                      support@workindatacenter.com
                    </a>
                  </div>
                </div>
              </GlassCard>

              {/* Response Time */}
              <GlassCard>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-ice-500/20">
                    <Clock className="w-5 h-5 text-ice-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Response Time</h3>
                    <p className="text-silver-400 text-sm">
                      We typically respond within 24-48 hours during business days.
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Platform Availability */}
              <GlassCard>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-ice-500/20">
                    <Check className="w-5 h-5 text-ice-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">24/7 Platform</h3>
                    <p className="text-silver-400 text-sm">
                      Our job board is available 24/7 for browsing and posting.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Quick Links</h2>
            <p className="text-silver-300">
              Looking for something specific? These links might help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* For Job Seekers */}
            <GlassCard className="text-center hover:shadow-glass-hover transition-all">
              <div className="inline-flex p-3 rounded-xl bg-ice-500/20 mb-4">
                <Users className="w-6 h-6 text-ice-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">For Job Seekers</h3>
              <p className="text-sm text-silver-400 mb-4">
                Need help finding jobs? Browse our specialized data center positions.
              </p>
              <Link href="/">
                <Button variant="outline" fullWidth>
                  Browse Jobs
                </Button>
              </Link>
            </GlassCard>

            {/* For Employers */}
            <GlassCard className="text-center hover:shadow-glass-hover transition-all">
              <div className="inline-flex p-3 rounded-xl bg-ice-500/20 mb-4">
                <Building2 className="w-6 h-6 text-ice-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">For Employers</h3>
              <p className="text-sm text-silver-400 mb-4">
                Ready to post a job? Learn about our simple, transparent pricing.
              </p>
              <Link href="/pricing">
                <Button variant="outline" fullWidth>
                  View Pricing
                </Button>
              </Link>
            </GlassCard>

            {/* General Info */}
            <GlassCard className="text-center hover:shadow-glass-hover transition-all">
              <div className="inline-flex p-3 rounded-xl bg-ice-500/20 mb-4">
                <HelpCircle className="w-6 h-6 text-ice-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Learn More</h3>
              <p className="text-sm text-silver-400 mb-4">
                Want to know more about our platform and mission?
              </p>
              <Link href="/about">
                <Button variant="outline" fullWidth>
                  About Us
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-silver-300">
              Quick answers to common questions. Can't find what you're looking for?
            </p>
          </div>

          <div className="space-y-4">
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-2">
                How do I post a job?
              </h3>
              <p className="text-silver-400 text-sm">
                Click "Post a Job" in the navigation, fill out the simple form (takes less than 5 minutes), and complete payment via Stripe. Your job goes live immediately after payment.
              </p>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-2">
                How much does it cost to post a job?
              </h3>
              <p className="text-silver-400 text-sm">
                Standard listings are $249 for 30 days. Featured listings (with homepage placement and priority visibility) are $398 total. No hidden fees, no subscriptions.
              </p>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I edit my job listing after posting?
              </h3>
              <p className="text-silver-400 text-sm">
                Yes! You can edit your job posting at any time during the 30-day active period through your employer dashboard. Changes are reflected immediately.
              </p>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-2">
                How do I apply for jobs?
              </h3>
              <p className="text-silver-400 text-sm">
                Browse jobs on our homepage, click on any position to view details, then click "Apply Now." You'll either be directed to the employer's application page or can apply via email.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
}
