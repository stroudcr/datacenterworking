import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="glass border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block group mb-4">
              <div className="px-4 py-2 rounded-lg bg-white/95 backdrop-blur-sm transition-all group-hover:bg-white">
                <Image
                  src="/images/NavLogo.png"
                  alt="Work In Data Center"
                  width={180}
                  height={60}
                  className="h-10 w-auto"
                />
              </div>
            </Link>
            <p className="text-sm text-silver-400 mt-2">
              Connecting top talent with leading data center employers.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-silver-300 hover:text-ice-400 transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/register?role=JOB_SEEKER"
                  className="text-sm text-silver-300 hover:text-ice-400 transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/#newsletter"
                  className="text-sm text-silver-300 hover:text-ice-400 transition-colors"
                >
                  Email Alerts
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/employers"
                  className="text-sm text-silver-300 hover:text-ice-400 transition-colors"
                >
                  Employer Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/post-job"
                  className="text-sm text-silver-300 hover:text-ice-400 transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  href="/register?role=EMPLOYER"
                  className="text-sm text-silver-300 hover:text-ice-400 transition-colors"
                >
                  Employer Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-silver-300 hover:text-ice-400 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/resources"
                  className="text-sm text-silver-300 hover:text-ice-400 transition-colors"
                >
                  Career Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-silver-300 hover:text-ice-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-silver-300 hover:text-ice-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-silver-300 hover:text-ice-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-silver-300 hover:text-ice-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-silver-400">
              © {new Date().getFullYear()} Work In Data Center. All rights reserved.
            </p>
            <p className="text-sm text-silver-400">
              Premium Data Center Careers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
