'use client';

import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { ServerCrash, Home, Briefcase, HelpCircle, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Icon */}
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-8">
          <ServerCrash className="w-16 h-16 text-white" />
        </div>

        {/* 404 Number */}
        <h1 className="text-8xl md:text-9xl font-bold animated-gradient bg-clip-text text-transparent mb-6">
          404
        </h1>

        {/* Main Message */}
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Page Not Found in Any Rack
        </h2>

        <p className="text-lg md:text-xl text-silver-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          We've checked all the server racks, HVAC logs, and even cold storage. This page doesn't exist in our infrastructure.
        </p>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Home / Browse Jobs */}
          <GlassCard className="text-center hover:shadow-glass-hover transition-all">
            <div className="inline-flex p-3 rounded-xl bg-ice-500/20 mb-4">
              <Home className="w-6 h-6 text-ice-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Browse Jobs</h3>
            <p className="text-sm text-silver-400 mb-4">
              Return to homepage and explore data center opportunities
            </p>
            <Link href="/">
              <Button variant="outline" fullWidth>
                <Search className="w-4 h-4 mr-2" />
                View Jobs
              </Button>
            </Link>
          </GlassCard>

          {/* Post a Job */}
          <GlassCard className="text-center hover:shadow-glass-hover transition-all">
            <div className="inline-flex p-3 rounded-xl bg-ice-500/20 mb-4">
              <Briefcase className="w-6 h-6 text-ice-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Post a Job</h3>
            <p className="text-sm text-silver-400 mb-4">
              Looking to hire? Post your data center position
            </p>
            <Link href="/post-job">
              <Button variant="outline" fullWidth>
                Post Job
              </Button>
            </Link>
          </GlassCard>

          {/* Contact Support */}
          <GlassCard className="text-center hover:shadow-glass-hover transition-all">
            <div className="inline-flex p-3 rounded-xl bg-ice-500/20 mb-4">
              <HelpCircle className="w-6 h-6 text-ice-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Need Help?</h3>
            <p className="text-sm text-silver-400 mb-4">
              Can't find what you're looking for? Contact us
            </p>
            <Link href="/contact">
              <Button variant="outline" fullWidth>
                Get Support
              </Button>
            </Link>
          </GlassCard>
        </div>

        {/* Humor Card */}
        <GlassCard className="max-w-2xl mx-auto bg-ice-500/5 border-ice-500/20 mb-8">
          <p className="text-silver-300 text-sm leading-relaxed">
            <span className="text-white font-semibold">Fun fact:</span> Unlike this missing page, our data center job board has excellent uptime and redundancy. No emergency maintenance required!
          </p>
        </GlassCard>

        {/* Quick Links */}
        <div className="text-center">
          <p className="text-sm text-silver-400 mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/pricing" className="text-ice-400 hover:text-ice-300 transition-colors">
              Pricing
            </Link>
            <span className="text-silver-600">•</span>
            <Link href="/about" className="text-ice-400 hover:text-ice-300 transition-colors">
              About Us
            </Link>
            <span className="text-silver-600">•</span>
            <Link href="/contact" className="text-ice-400 hover:text-ice-300 transition-colors">
              Contact
            </Link>
            <span className="text-silver-600">•</span>
            <Link href="/terms" className="text-ice-400 hover:text-ice-300 transition-colors">
              Terms
            </Link>
            <span className="text-silver-600">•</span>
            <Link href="/privacy" className="text-ice-400 hover:text-ice-300 transition-colors">
              Privacy
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-silver-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back to previous page
          </button>
        </div>
      </div>
    </div>
  );
}
