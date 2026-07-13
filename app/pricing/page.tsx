import { PricingCard } from '@/components/PricingCard';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { PRICING } from '@/lib/constants';
import {
  Zap,
  TrendingUp,
  Shield,
  Users,
  Clock,
  CheckCircle,
  Star,
  Target,
  Award,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/site-config';
import { FunnelView } from '@/components/FunnelLink';

export const metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for data center employers. Post jobs and connect with top talent.',
  alternates: {
    canonical: absoluteUrl('/pricing'),
  },
  openGraph: {
    title: 'Pricing for Data Center Job Posts',
    description: 'Simple, transparent pricing for data center employers. Post jobs and connect with top talent.',
    url: absoluteUrl('/pricing'),
  },
};

export default function PricingPage() {
  const standardFeatures = [
    '30-day active job listing',
    'Visible in all job searches',
    'Company logo & branding',
    'Detailed job description with rich text',
    'Application tracking for on-site applications',
    'Filter by security clearance & certifications',
    'Mobile-optimized job posting',
    'Direct apply or redirect to your ATS',
  ];

  const featuredFeatures = [
    'Everything in Standard, plus:',
    'Homepage placement for 7 days',
    'Priority placement in search results',
    'Highlighted with star badge & border',
    'Featured badge and visual emphasis',
    'Seven days of Featured priority',
  ];

  return (
    <div className="min-h-screen">
      <FunnelView event="pricing_view" />
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Reach Top{' '}
            <span className="animated-gradient bg-clip-text text-transparent">
              Data Center Talent
            </span>
          </h1>
          <p className="text-xl text-silver-300 mb-8 max-w-3xl mx-auto">
            Publish your role on a job board focused on data center operations, facilities, construction and infrastructure work.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <GlassCard className="text-center">
              <Users className="w-8 h-8 text-ice-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-silver-400">Data Center Focused</div>
            </GlassCard>
            <GlassCard className="text-center">
              <Clock className="w-8 h-8 text-ice-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">30 days</div>
              <div className="text-sm text-silver-400">Active Listing Term</div>
            </GlassCard>
            <GlassCard className="text-center">
              <Shield className="w-8 h-8 text-ice-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">Active</div>
              <div className="text-sm text-silver-400">Professional Community</div>
            </GlassCard>
          </div>

          {/* Soft CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/post-job">
              <Button variant="primary" size="lg">
                Post a Job Now
              </Button>
            </Link>
            <Link href="#pricing">
              <Button variant="outline" size="lg">
                View Pricing Details
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Data Center Employers Choose Us
            </h2>
            <p className="text-lg text-silver-300 max-w-2xl mx-auto">
              Use industry-specific fields and categories to describe the role clearly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="text-center">
              <div className="inline-flex p-3 rounded-xl bg-ice-500/20 mb-4">
                <Target className="w-6 h-6 text-ice-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Niche Targeting</h3>
              <p className="text-sm text-silver-400">
                A job taxonomy focused entirely on data center work.
              </p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="inline-flex p-3 rounded-xl bg-ice-500/20 mb-4">
                <Award className="w-6 h-6 text-ice-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Relevant Role Details</h3>
              <p className="text-sm text-silver-400">
                Filter by security clearance, certifications, and shift availability.
              </p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="inline-flex p-3 rounded-xl bg-ice-500/20 mb-4">
                <Zap className="w-6 h-6 text-ice-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Fast & Simple</h3>
              <p className="text-sm text-silver-400">
                Preview your listing, choose an application route, and pay securely through Stripe.
              </p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="inline-flex p-3 rounded-xl bg-ice-500/20 mb-4">
                <TrendingUp className="w-6 h-6 text-ice-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Better ROI</h3>
              <p className="text-sm text-silver-400">
                One flat rate. No hidden fees. No pay-per-click traps.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-silver-300">
              No contracts. No hidden fees. Just results.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Standard Listing */}
            <PricingCard
              title="Standard Listing"
              price={PRICING.BASE_LISTING / 100}
              description="Perfect for most hiring needs"
              features={standardFeatures}
              ctaText="Post Standard Job"
              ctaLink="/post-job?plan=standard"
            />

            {/* Featured Listing */}
            <PricingCard
              title="Featured Listing"
              price={(PRICING.BASE_LISTING + PRICING.FEATURED_UPGRADE) / 100}
              description="Maximum visibility for urgent roles"
              features={featuredFeatures}
              highlighted={true}
              badge="MOST POPULAR"
              ctaText="Post Featured Job"
              ctaLink="/post-job?plan=featured"
            />
          </div>

          {/* Trust Signals */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap items-center justify-center gap-8 text-silver-400 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-ice-400" />
                <span>Secure Stripe Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-ice-400" />
                <span>Instant Activation</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-ice-400" />
                <span>Choose your application route</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 px-4 bg-gradient-to-b from-black/20 to-transparent">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Compare Plans
          </h2>

          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-white font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 text-white font-semibold">Standard</th>
                    <th className="text-center py-4 px-4 text-white font-semibold">Featured</th>
                  </tr>
                </thead>
                <tbody className="text-silver-300">
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4">30-Day Active Listing</td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle className="w-5 h-5 text-ice-400 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle className="w-5 h-5 text-ice-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4">Company Logo & Branding</td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle className="w-5 h-5 text-ice-400 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle className="w-5 h-5 text-ice-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4">Application Tracking</td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle className="w-5 h-5 text-ice-400 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle className="w-5 h-5 text-ice-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4">Homepage Placement (7 days)</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-silver-500">—</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle className="w-5 h-5 text-ice-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4">Priority in Search Results</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-silver-500">—</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle className="w-5 h-5 text-ice-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4">Featured Badge</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-silver-500">—</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle className="w-5 h-5 text-ice-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4">Featured Priority (7 days)</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-silver-500">—</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle className="w-5 h-5 text-ice-400 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-white">Total Investment</td>
                    <td className="text-center py-4 px-4 font-bold text-white">${PRICING.BASE_LISTING / 100}</td>
                    <td className="text-center py-4 px-4 font-bold text-white">${(PRICING.BASE_LISTING + PRICING.FEATURED_UPGRADE) / 100}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-4">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-2">
                How long does my job posting stay active?
              </h3>
              <p className="text-silver-300 text-sm">
                All job postings remain active for 30 days from the date of publication. Featured listings get homepage placement for the first 7 days, then remain visible in search results for the full 30 days.
              </p>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I edit my job posting after it's live?
              </h3>
              <p className="text-silver-300 text-sm">
                Yes! You can edit your job posting at any time during the 30-day active period through your employer dashboard. Changes are reflected immediately.
              </p>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-silver-300 text-sm">
                We use Stripe for secure payment processing and accept all major credit cards (Visa, Mastercard, American Express, Discover). All transactions are encrypted and PCI compliant.
              </p>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-silver-300 text-sm">
                We offer a satisfaction guarantee. If you're not happy with your posting within the first 48 hours, contact us for a full refund. After 48 hours, refunds are provided on a case-by-case basis.
              </p>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I post multiple jobs at once?
              </h3>
              <p className="text-silver-300 text-sm">
                Absolutely! Each job posting is separate, so you can post as many positions as you need. For companies hiring multiple roles regularly, contact us about volume discounts.
              </p>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-2">
                How do applicants contact me?
              </h3>
              <p className="text-silver-300 text-sm">
                You choose! You can either provide an application URL (redirects to your ATS or career page) or an application email address. Applicants see a clear "Apply Now" button on your job posting.
              </p>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-2">
                What makes Featured listings worth the upgrade?
              </h3>
              <p className="text-silver-300 text-sm">
                Featured listings receive priority above standard listings for seven days and are visually highlighted with a Featured badge. After that, the listing remains active for the rest of its 30-day term.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="container mx-auto max-w-4xl text-center">
          <GlassCard className="p-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Find Your Next{' '}
              <span className="animated-gradient bg-clip-text text-transparent">
                Data Center Pro?
              </span>
            </h2>
            <p className="text-xl text-silver-300 mb-8 max-w-2xl mx-auto">
              Publish a clear data center job listing or contact us to discuss multiple roles and locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/post-job?plan=standard">
                <Button variant="primary" size="lg">
                  Post a Job Now - $249
                </Button>
              </Link>
              <Link href="/register?role=EMPLOYER">
                <Button variant="outline" size="lg">
                  Create Employer Account
                </Button>
              </Link>
            </div>
            <p className="text-sm text-silver-400 mt-6">
              No contracts • No hidden fees • Cancel anytime
            </p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
