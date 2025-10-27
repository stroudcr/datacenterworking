import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import {
  Server,
  Target,
  Award,
  Shield,
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
  Heart,
  Rocket,
  Building2,
  Clock,
  Search,
  Bell,
  FileText,
  BarChart
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us - Work In Data Center',
  description: 'Learn about our mission to connect data center professionals with opportunity. Specialized job board focused 100% on data center careers.',
};

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Industry Focus',
      description: '100% dedicated to data center careers. No distractions, just relevant opportunities.',
    },
    {
      icon: Award,
      title: 'Quality Over Quantity',
      description: 'Vetted positions from real employers. Every job listing is manually reviewed.',
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Clear pricing, no hidden fees, honest communication. What you see is what you get.',
    },
    {
      icon: Zap,
      title: 'Speed & Simplicity',
      description: 'Post jobs in under 5 minutes. Apply with one click. No unnecessary complexity.',
    },
    {
      icon: Users,
      title: 'Trust & Verification',
      description: 'Building a community of verified data center professionals and employers.',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Supporting professionals throughout their journey from entry-level to leadership.',
    },
  ];

  const stats = [
    { icon: Target, value: '100%', label: 'Data Center Focused' },
    { icon: Building2, value: '$249', label: 'Flat Rate Pricing' },
    { icon: Clock, value: '<5 min', label: 'Job Posting Time' },
    { icon: Shield, value: '30 Days', label: 'Active Listings' },
    { icon: Award, value: 'All Levels', label: 'Security Clearances' },
    { icon: CheckCircle, value: 'Verified', label: 'Quality Employers' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Connecting{' '}
            <span className="animated-gradient bg-clip-text text-transparent">
              Data Center Professionals
            </span>
            <br />
            with Opportunity
          </h1>
          <p className="text-xl text-silver-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Our mission is to be the premier destination for data center career opportunities—where specialized talent meets employers who understand their value.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-4">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Our Story</h2>
          </div>

          <GlassCard className="space-y-6">
            <p className="text-lg text-silver-300 leading-relaxed">
              Work In Data Center was founded on a simple observation: <span className="text-white font-semibold">the data center industry is unique</span>, with specialized requirements that generic job boards simply don't address.
            </p>
            <p className="text-lg text-silver-300 leading-relaxed">
              From security clearances to shift requirements, from CDCP certifications to critical facility experience—data center professionals and employers deserve a platform that speaks their language. Traditional job boards flood employers with unqualified applicants and overwhelm job seekers with irrelevant positions.
            </p>
            <p className="text-lg text-silver-300 leading-relaxed">
              We built this platform to solve a real problem: <span className="text-white font-semibold">connecting the right people with the right opportunities</span> in the data center industry. No noise. No distractions. Just quality matches between skilled professionals and employers who value their expertise.
            </p>
            <p className="text-lg text-silver-300 leading-relaxed">
              Whether you're a technician with years of critical facilities experience, an engineer designing next-generation data centers, or an employer building a world-class operations team—this platform was built for you.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-lg text-silver-300 max-w-2xl mx-auto">
              These principles guide everything we do, from product design to customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <GlassCard key={index} className="text-center hover:shadow-glass-hover transition-all">
                  <div className="inline-flex p-3 rounded-xl bg-ice-500/20 mb-4">
                    <Icon className="w-6 h-6 text-ice-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-sm text-silver-400 leading-relaxed">{value.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-black/20 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-lg text-silver-300">
              Simple, fast, and effective for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Job Seekers */}
            <GlassCard>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-ice-500/20">
                  <Users className="w-6 h-6 text-ice-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Job Seekers</h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ice-500/20 flex items-center justify-center">
                    <span className="text-ice-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Browse Specialized Jobs</h4>
                    <p className="text-sm text-silver-400">
                      Search through data center positions across all categories and specializations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ice-500/20 flex items-center justify-center">
                    <span className="text-ice-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Filter Your Way</h4>
                    <p className="text-sm text-silver-400">
                      Use industry-specific filters: certifications, security clearances, shift requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ice-500/20 flex items-center justify-center">
                    <span className="text-ice-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Apply with Confidence</h4>
                    <p className="text-sm text-silver-400">
                      One-click applications. Direct contact with employers. No middlemen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ice-500/20 flex items-center justify-center">
                    <span className="text-ice-400 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Get Notified</h4>
                    <p className="text-sm text-silver-400">
                      Subscribe to email alerts and never miss new opportunities in your area.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/">
                  <Button variant="outline" fullWidth>
                    <Search className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </GlassCard>

            {/* For Employers */}
            <GlassCard>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-ice-500/20">
                  <Building2 className="w-6 h-6 text-ice-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Employers</h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ice-500/20 flex items-center justify-center">
                    <span className="text-ice-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Post in Minutes</h4>
                    <p className="text-sm text-silver-400">
                      Create your job listing in under 5 minutes. No complex forms or hidden requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ice-500/20 flex items-center justify-center">
                    <span className="text-ice-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Reach Qualified Talent</h4>
                    <p className="text-sm text-silver-400">
                      Your job reaches 100% data center-focused professionals. No wasted impressions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ice-500/20 flex items-center justify-center">
                    <span className="text-ice-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Receive Quality Applications</h4>
                    <p className="text-sm text-silver-400">
                      Applications come from candidates who match your specific requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ice-500/20 flex items-center justify-center">
                    <span className="text-ice-400 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Track & Manage</h4>
                    <p className="text-sm text-silver-400">
                      Monitor applications through your employer dashboard. Edit anytime.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/post-job">
                  <Button variant="primary" fullWidth>
                    <FileText className="w-4 h-4 mr-2" />
                    Post a Job
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* By The Numbers Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">By The Numbers</h2>
            <p className="text-lg text-silver-300">
              The metrics that matter to data center professionals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={index} className="text-center p-6">
                  <Icon className="w-8 h-8 text-ice-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-silver-400">{stat.label}</div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">What Makes Us Different</h2>
            <p className="text-lg text-silver-300">
              We're not just another job board. Here's why we stand out.
            </p>
          </div>

          <div className="space-y-4">
            <GlassCard className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-ice-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Niche Specialization</h3>
                <p className="text-silver-400">
                  Unlike general job boards that dilute your search with irrelevant positions, we focus exclusively on data center careers. Every job posting is relevant to your industry.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-ice-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Industry-Specific Filters</h3>
                <p className="text-silver-400">
                  Search by security clearance levels, data center certifications (CDCP, CDCS, CDCE), shift requirements, and more. Filters that actually matter to data center professionals.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-ice-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Transparent Pricing</h3>
                <p className="text-silver-400">
                  Employers pay one flat rate ($249 for 30 days). No hidden costs, no pay-per-click schemes, no surprise fees. What you see is what you pay.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-ice-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Quality Over Quantity</h3>
                <p className="text-silver-400">
                  We manually review every job posting to ensure it's legitimate and relevant. Job seekers spend less time filtering spam and more time finding real opportunities.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-ice-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Fast & User-Friendly</h3>
                <p className="text-silver-400">
                  Post a job in under 5 minutes. Apply to positions with one click. No complex workflows, no unnecessary steps. We respect your time.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-ice-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Built for the Industry</h3>
                <p className="text-silver-400">
                  We understand that CDCP certifications matter, that TS/SCI clearances take time to obtain, and that 24/7 operations mean shift work is real. Because we speak your language.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-6">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">Our Commitment</h2>
          <GlassCard className="text-left space-y-4">
            <p className="text-lg text-silver-300 leading-relaxed">
              We're committed to continuously improving this platform based on feedback from both job seekers and employers. Your success is our success.
            </p>
            <p className="text-lg text-silver-300 leading-relaxed">
              Whether you're a technician looking for your first data center role, an experienced engineer seeking new challenges, or an employer building a world-class team—we're here to support your journey.
            </p>
            <p className="text-lg text-white font-semibold">
              Thank you for being part of the Work In Data Center community.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Seekers CTA */}
            <GlassCard className="text-center p-8">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">For Job Seekers</h3>
              <p className="text-silver-300 mb-6">
                Start exploring data center career opportunities today.
              </p>
              <div className="space-y-3">
                <Link href="/" className="block">
                  <Button variant="primary" size="lg" fullWidth>
                    Browse Jobs
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button variant="outline" size="lg" fullWidth>
                    Create Account
                  </Button>
                </Link>
              </div>
            </GlassCard>

            {/* Employers CTA */}
            <GlassCard className="text-center p-8">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">For Employers</h3>
              <p className="text-silver-300 mb-6">
                Connect with qualified data center professionals.
              </p>
              <div className="space-y-3">
                <Link href="/post-job" className="block">
                  <Button variant="primary" size="lg" fullWidth>
                    Post a Job
                  </Button>
                </Link>
                <Link href="/pricing" className="block">
                  <Button variant="outline" size="lg" fullWidth>
                    View Pricing
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
}
