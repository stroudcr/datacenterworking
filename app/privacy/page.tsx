import { GlassCard } from '@/components/GlassCard';
import { Shield, Eye, Lock, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Work In Data Center',
  description: 'Learn how Work In Data Center collects, uses, and protects your personal information. GDPR and CCPA compliant privacy policy.',
};

export default function PrivacyPage() {
  const lastUpdated = 'January 26, 2025';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-silver-400">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Introduction */}
          <GlassCard className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <Info className="w-5 h-5 text-ice-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-white mb-3">Our Commitment to Your Privacy</h2>
                <div className="space-y-3 text-silver-300 leading-relaxed">
                  <p>
                    At Work In Data Center, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our job board platform.
                  </p>
                  <p>
                    By using our platform, you agree to the collection and use of information in accordance with this Privacy Policy. This policy should be read in conjunction with our <Link href="/terms" className="text-ice-400 hover:text-ice-300 underline">Terms of Service</Link>.
                  </p>
                  <p>
                    This Privacy Policy complies with the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA/CPRA).
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Section 1: Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">1.1 Information You Provide Directly</h3>
                <div className="space-y-4 text-silver-300 leading-relaxed">
                  <p><span className="text-white font-semibold">Account Registration:</span> When you create an account, we collect your email address, password (stored securely as a hash), name, role (employer or job seeker), and company name (for employers).</p>

                  <p><span className="text-white font-semibold">Job Postings (Employers):</span> Company details, job descriptions, requirements, location, compensation information, application contact methods (URL or email), and company logos.</p>

                  <p><span className="text-white font-semibold">Job Applications (Job Seekers):</span> Resume files or URLs, cover letters, and any information you include in your application materials.</p>

                  <p><span className="text-white font-semibold">Newsletter Subscriptions:</span> Email address and category preferences for job alerts.</p>

                  <p><span className="text-white font-semibold">Contact Forms:</span> Name, email, inquiry type, subject, and message content when you contact us.</p>

                  <p><span className="text-white font-semibold">Payment Information:</span> We use Stripe for payment processing. We do NOT store credit card numbers or financial account information. We only store Stripe transaction IDs, payment amounts, and payment status for record-keeping.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">1.2 Information Collected Automatically</h3>
                <div className="space-y-2 text-silver-300 leading-relaxed">
                  <p><span className="text-white font-semibold">Usage Data:</span> We collect information about how you interact with our platform, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Pages viewed and jobs browsed</li>
                    <li>Search queries and filters used</li>
                    <li>Job view counts and application counts</li>
                    <li>Date and time of visits</li>
                  </ul>
                  <p><span className="text-white font-semibold">Device Information:</span> Browser type, operating system, IP address (for security), and device identifiers.</p>
                  <p><span className="text-white font-semibold">Cookies:</span> We use cookies and similar technologies for authentication, preferences, and analytics. See Section 4 for details.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">1.3 Information From Third Parties</h3>
                <div className="space-y-2 text-silver-300 leading-relaxed">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Payment confirmations and transaction data from Stripe</li>
                    <li>Email deliverability information from email service providers</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                We use your personal information for the following purposes, based on the following lawful bases:
              </p>

              <div className="glass rounded-lg p-6 space-y-3">
                <p><span className="text-white font-semibold">Contract Performance:</span> To provide our job board services, process job postings, facilitate applications, and manage your account.</p>

                <p><span className="text-white font-semibold">Legitimate Interests:</span> To improve our platform, prevent fraud, ensure security, analyze usage patterns (in aggregate), and communicate about platform updates.</p>

                <p><span className="text-white font-semibold">Consent:</span> To send you job alerts and newsletters (you can withdraw consent anytime by unsubscribing).</p>

                <p><span className="text-white font-semibold">Legal Obligations:</span> To comply with tax laws, payment processing regulations, and respond to legal requests.</p>
              </div>

              <p className="mt-4">
                <span className="text-white font-semibold">Specific Uses:</span>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Facilitate job postings and applications between employers and job seekers</li>
                <li>Process payments for job listings via Stripe</li>
                <li>Send job alerts and newsletters to subscribers (with consent)</li>
                <li>Respond to support requests and inquiries</li>
                <li>Improve platform functionality and user experience</li>
                <li>Prevent fraud, spam, and ensure platform security</li>
                <li>Comply with legal obligations and enforce our Terms of Service</li>
                <li>Analyze platform usage in aggregate (non-identifying) form</li>
              </ul>
            </div>
          </section>

          {/* Section 3: How We Share Your Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Share Your Information</h2>
            <GlassCard className="bg-ice-500/5 border-ice-500/20 mb-6">
              <p className="text-lg text-white font-semibold mb-2">
                We DO NOT Sell Your Personal Information
              </p>
              <p className="text-silver-300">
                We do not sell, rent, or share your personal information with third parties for their marketing purposes.
              </p>
            </GlassCard>

            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p className="text-white font-semibold">We Share Information With:</p>

              <div>
                <p className="text-white font-semibold mb-2">1. Other Users (As Necessary for Platform Function):</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Employers can view job seeker applications (resume, cover letter, contact information) for jobs they posted</li>
                  <li>Job seekers can view employer job postings, company information, and application contact details</li>
                  <li>We act as an intermediary platform; direct sharing occurs between users</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-2">2. Service Providers:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="text-white">Stripe:</span> For secure payment processing (see Stripe's privacy policy for how they handle payment data)</li>
                  <li><span className="text-white">Cloudinary:</span> For hosting company logos and images</li>
                  <li><span className="text-white">Email Service Providers:</span> For sending transactional emails, job alerts, and newsletters</li>
                  <li><span className="text-white">Hosting/Infrastructure:</span> For platform operation and data storage</li>
                </ul>
                <p className="mt-2 text-sm">These providers are contractually obligated to protect your data and use it only for specified purposes.</p>
              </div>

              <div>
                <p className="text-white font-semibold mb-2">3. Legal Requirements:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To comply with laws, regulations, legal processes, or government requests</li>
                  <li>To enforce our Terms of Service and protect our rights, property, or safety</li>
                  <li>To protect the rights, property, or safety of our users or the public</li>
                  <li>In connection with a merger, acquisition, or sale of assets (users will be notified)</li>
                </ul>
              </div>

              <p className="mt-4 text-white font-semibold">
                We Do NOT share your data with advertisers or use it for unrelated marketing purposes.
              </p>
            </div>
          </section>

          {/* Section 4: Cookies & Tracking */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">4. Cookies & Tracking Technologies</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our platform.
              </p>

              <div>
                <p className="text-white font-semibold mb-2">Types of Cookies We Use:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="text-white">Essential Cookies:</span> Required for login, authentication, and basic platform functionality. These cannot be disabled without affecting core features.</li>
                  <li><span className="text-white">Functional Cookies:</span> Remember your preferences, settings, and choices to improve your experience.</li>
                  <li><span className="text-white">Analytics Cookies:</span> Help us understand how users interact with our platform in aggregate form (non-identifying).</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-2">Managing Cookies:</p>
                <p>
                  You can control cookies through your browser settings. However, disabling essential cookies may prevent you from using certain features like logging in or posting jobs.
                </p>
                <p className="mt-2">
                  Most browsers allow you to refuse cookies or delete existing cookies. Check your browser's help documentation for instructions.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                We retain your personal information only as long as necessary for the purposes outlined in this Privacy Policy or as required by law.
              </p>

              <div className="glass rounded-lg p-6">
                <p className="text-white font-semibold mb-3">Specific Retention Periods:</p>
                <ul className="space-y-2">
                  <li><span className="text-white">Active User Accounts:</span> Retained while your account remains active</li>
                  <li><span className="text-white">Deleted Accounts:</span> Personal data deleted within 30 days of account deletion, except where legally required to retain (e.g., payment records)</li>
                  <li><span className="text-white">Job Postings:</span> Active for 30 days, then archived for 90 days before permanent deletion (unless deleted earlier by employer)</li>
                  <li><span className="text-white">Job Applications:</span> Retained while the related job posting exists plus 90 days</li>
                  <li><span className="text-white">Newsletter Subscriptions:</span> Retained until you unsubscribe</li>
                  <li><span className="text-white">Payment Records:</span> Retained for 7 years for tax and legal compliance</li>
                  <li><span className="text-white">Contact Form Submissions:</span> Retained for 2 years</li>
                  <li><span className="text-white">Cookies:</span> Session cookies expire when you close your browser; persistent cookies last up to 1 year</li>
                </ul>
              </div>

              <p className="mt-4">
                Data is automatically purged after these retention periods through scheduled deletion processes. You can request deletion of your data at any time by exercising your privacy rights (see Section 6).
              </p>
            </div>
          </section>

          {/* Section 6: Your Privacy Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Privacy Rights</h2>

            <GlassCard className="bg-ice-500/5 border-ice-500/20 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-ice-400 flex-shrink-0 mt-1" />
                <div className="space-y-4 text-silver-300 leading-relaxed">
                  <p className="text-xl text-white font-semibold">
                    You Have Control Over Your Data
                  </p>
                  <p>
                    Depending on your location, you have specific rights regarding your personal information. We honor these rights for all users regardless of location.
                  </p>
                </div>
              </div>
            </GlassCard>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">CCPA/CPRA Rights (California Residents)</h3>
                <div className="space-y-3 text-silver-300 leading-relaxed">
                  <ul className="space-y-3">
                    <li>
                      <span className="text-white font-semibold">Right to Know:</span> You can request to know what personal information we collect, use, disclose, and sell (we don't sell).
                    </li>
                    <li>
                      <span className="text-white font-semibold">Right to Delete:</span> You can request deletion of your personal information, subject to legal exceptions.
                    </li>
                    <li>
                      <span className="text-white font-semibold">Right to Correct:</span> You can request correction of inaccurate personal information.
                    </li>
                    <li>
                      <span className="text-white font-semibold">Right to Opt-Out:</span> You can opt out of the sale or sharing of personal information (we don't sell your data).
                    </li>
                    <li>
                      <span className="text-white font-semibold">Right to Limit:</span> You can limit our use of sensitive personal information.
                    </li>
                    <li>
                      <span className="text-white font-semibold">Right to Non-Discrimination:</span> We will not discriminate against you for exercising your privacy rights.
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">GDPR Rights (EU/EEA Residents)</h3>
                <div className="space-y-3 text-silver-300 leading-relaxed">
                  <ul className="space-y-3">
                    <li>
                      <span className="text-white font-semibold">Right to Access:</span> Obtain a copy of your personal data we hold.
                    </li>
                    <li>
                      <span className="text-white font-semibold">Right to Rectification:</span> Request correction of inaccurate or incomplete data.
                    </li>
                    <li>
                      <span className="text-white font-semibold">Right to Erasure:</span> Request deletion of your personal data ("right to be forgotten").
                    </li>
                    <li>
                      <span className="text-white font-semibold">Right to Restrict Processing:</span> Limit how we process your data under certain circumstances.
                    </li>
                    <li>
                      <span className="text-white font-semibold">Right to Data Portability:</span> Receive your data in a machine-readable format.
                    </li>
                    <li>
                      <span className="text-white font-semibold">Right to Object:</span> Object to certain types of data processing.
                    </li>
                    <li>
                      <span className="text-white font-semibold">Right to Withdraw Consent:</span> Withdraw consent for consent-based processing (e.g., newsletters).
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">How to Exercise Your Rights</h3>
                <div className="glass rounded-lg p-6">
                  <p className="text-silver-300 mb-4">
                    You can submit privacy rights requests through any of the following methods:
                  </p>
                  <ul className="space-y-3 text-silver-300">
                    <li>
                      <span className="text-white font-semibold">Email:</span> <a href="mailto:privacy@workindatacenter.com" className="text-ice-400 hover:text-ice-300 underline">privacy@workindatacenter.com</a> or <a href="mailto:support@workindatacenter.com" className="text-ice-400 hover:text-ice-300 underline">support@workindatacenter.com</a>
                    </li>
                    <li>
                      <span className="text-white font-semibold">Contact Form:</span> Visit our <Link href="/contact" className="text-ice-400 hover:text-ice-300 underline">Contact Page</Link>
                    </li>
                    <li>
                      <span className="text-white font-semibold">Account Settings:</span> For certain actions like deleting your account or unsubscribing from emails
                    </li>
                  </ul>
                  <p className="text-silver-400 text-sm mt-4">
                    We will respond to verified requests within 45 days (CCPA) or 30 days (GDPR). We may need to verify your identity before processing requests.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">7. Data Security</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li><span className="text-white">Encryption:</span> Data transmitted over the internet is encrypted using HTTPS/TLS</li>
                <li><span className="text-white">Password Security:</span> Passwords are hashed and never stored in plain text</li>
                <li><span className="text-white">Payment Security:</span> Stripe handles payment processing and is PCI-DSS Level 1 compliant</li>
                <li><span className="text-white">Access Controls:</span> Limited employee access to personal data on a need-to-know basis</li>
                <li><span className="text-white">Regular Updates:</span> We regularly update our security practices and software</li>
              </ul>

              <GlassCard className="bg-amber-500/5 border-amber-500/20 mt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-semibold mb-2">Important Security Notice</p>
                    <p className="text-silver-300">
                      While we use industry-standard security measures, no method of transmission over the internet or electronic storage is 100% secure. You are responsible for maintaining the confidentiality of your account credentials. Please notify us immediately if you become aware of any unauthorized access to your account.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>

          {/* Section 8: Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                Our platform is not directed at children under 18 years of age. To use our services, you must be at least 18 years old or the age of majority in your jurisdiction.
              </p>
              <p>
                We do not knowingly collect personal information from anyone under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete that information promptly.
              </p>
              <p>
                If you believe we have collected information from a child under 18, please contact us at <a href="mailto:privacy@workindatacenter.com" className="text-ice-400 hover:text-ice-300 underline">privacy@workindatacenter.com</a>.
              </p>
            </div>
          </section>

          {/* Section 9: International Data Transfers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                Our platform is operated in the United States. If you are accessing our services from outside the United States, please be aware that your information will be transferred to, stored, and processed in the United States.
              </p>
              <p>
                By using our platform, you consent to the transfer of your information to the United States and processing in accordance with this Privacy Policy.
              </p>
              <p>
                For users in the European Economic Area (EEA), we ensure that data transfers comply with GDPR requirements through appropriate safeguards such as Standard Contractual Clauses or adequacy decisions.
              </p>
            </div>
          </section>

          {/* Section 10: Third-Party Links */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">10. Third-Party Links & Services</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                Our platform contains links to employer websites and third-party application portals. When you apply for a job, you may be directed to an external website to complete your application.
              </p>
              <p className="text-white font-semibold">
                We are not responsible for the privacy practices or content of third-party websites.
              </p>
              <p>
                We encourage you to review the privacy policies of any third-party sites you visit. Once you leave our platform via a link, our Privacy Policy no longer applies.
              </p>
              <p>
                Employers who receive your applications through our platform are responsible for their own data handling practices. We recommend reviewing employer privacy policies before applying.
              </p>
            </div>
          </section>

          {/* Section 11: California Shine the Light */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">11. California "Shine the Light" Law</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                California Civil Code Section 1798.83 permits California residents to request information about disclosure of personal information to third parties for their direct marketing purposes.
              </p>
              <p className="text-white font-semibold">
                We do not share your personal information with third parties for their direct marketing purposes.
              </p>
              <p>
                If you have questions about this, please contact us at <a href="mailto:privacy@workindatacenter.com" className="text-ice-400 hover:text-ice-300 underline">privacy@workindatacenter.com</a>.
              </p>
            </div>
          </section>

          {/* Section 12: Changes to Privacy Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Privacy Policy</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.
              </p>
              <p>
                When we make changes, we will:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Update the "Last Updated" date at the top of this page</li>
                <li>Post the updated Privacy Policy on our website</li>
                <li>For material changes, provide prominent notice or send email notifications</li>
              </ul>
              <p>
                Your continued use of our platform after changes become effective constitutes acceptance of the updated Privacy Policy. We recommend reviewing this policy periodically to stay informed about how we protect your information.
              </p>
              <p className="text-white font-semibold">
                We update this policy at least annually as required by CCPA.
              </p>
            </div>
          </section>

          {/* Section 13: Contact Us */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>

              <GlassCard>
                <div className="space-y-3">
                  <p className="text-white font-semibold text-lg">Privacy Inquiries</p>
                  <div>
                    <p className="text-silver-400 text-sm">Email</p>
                    <p>
                      <a href="mailto:privacy@workindatacenter.com" className="text-ice-400 hover:text-ice-300 underline">privacy@workindatacenter.com</a>
                    </p>
                    <p className="mt-1">
                      <a href="mailto:support@workindatacenter.com" className="text-ice-400 hover:text-ice-300 underline">support@workindatacenter.com</a>
                    </p>
                  </div>
                  <div>
                    <p className="text-silver-400 text-sm">Contact Form</p>
                    <p>
                      <Link href="/contact" className="text-ice-400 hover:text-ice-300 underline">Visit our Contact Page</Link>
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-white font-semibold">Work In Data Center</p>
                    <p className="text-silver-400 text-sm mt-1">Premium Data Center Careers Platform</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>

          {/* Summary */}
          <GlassCard className="bg-ice-500/5 border-ice-500/20">
            <div className="space-y-3 text-center">
              <p className="text-lg text-white font-semibold">
                Key Privacy Principles
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-silver-300">
                <div>
                  <Eye className="w-6 h-6 text-ice-400 mx-auto mb-2" />
                  <p className="font-semibold text-white">Transparency</p>
                  <p>We're clear about what data we collect and why</p>
                </div>
                <div>
                  <Lock className="w-6 h-6 text-ice-400 mx-auto mb-2" />
                  <p className="font-semibold text-white">Security</p>
                  <p>Your data is protected with industry-standard measures</p>
                </div>
                <div>
                  <CheckCircle className="w-6 h-6 text-ice-400 mx-auto mb-2" />
                  <p className="font-semibold text-white">Control</p>
                  <p>You have rights to access, update, and delete your data</p>
                </div>
              </div>
              <p className="text-silver-400 pt-4">
                By using Work In Data Center, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
