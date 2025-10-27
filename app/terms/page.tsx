import { GlassCard } from '@/components/GlassCard';
import { Scale, AlertTriangle, Info } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - Work In Data Center',
  description: 'Terms and conditions for using Work In Data Center job board platform. Read our terms of service for employers and job seekers.',
};

export default function TermsPage() {
  const lastUpdated = 'January 26, 2025';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-6">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Terms of Service
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
                <h2 className="text-xl font-bold text-white mb-3">Agreement to Terms</h2>
                <div className="space-y-3 text-silver-300 leading-relaxed">
                  <p>
                    Welcome to Work In Data Center. By accessing or using our platform, you agree to be bound by these Terms of Service ("Terms"). Please read them carefully.
                  </p>
                  <p>
                    These Terms constitute a legally binding agreement between you and Work In Data Center. If you do not agree to these Terms, you must not access or use our services.
                  </p>
                  <p>
                    These Terms should be read in conjunction with our <Link href="/privacy" className="text-ice-400 hover:text-ice-300 underline">Privacy Policy</Link>, which is incorporated by reference.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Section 1: Eligibility */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">1. Eligibility</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                To use Work In Data Center, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years old or the age of majority in your jurisdiction</li>
                <li>Be legally capable of entering into binding contracts</li>
                <li>Provide accurate and complete registration information</li>
                <li>Not have been previously banned or suspended from our platform</li>
                <li>Comply with all applicable local, state, and federal laws</li>
              </ul>
              <p>
                If you are using our platform on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
              </p>
            </div>
          </section>

          {/* Section 2: User Accounts */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">2. User Accounts</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <h3 className="text-lg font-semibold text-white">Account Registration</h3>
              <p>
                Employers must create an account to post job listings. Job seekers may browse jobs without an account but must create one to apply for positions or receive job alerts.
              </p>

              <h3 className="text-lg font-semibold text-white">Account Security</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use a strong, unique password</li>
                <li>Not share your account credentials with others</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Log out from your account at the end of each session</li>
              </ul>

              <h3 className="text-lg font-semibold text-white">Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account at any time for violations of these Terms, suspicious activity, or at our sole discretion. You may delete your account at any time through your account settings.
              </p>
            </div>
          </section>

          {/* Section 3: Job Postings & User Content */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">3. Job Postings & User Content</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <h3 className="text-lg font-semibold text-white">For Employers</h3>
              <p>
                When posting a job listing, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You have a legitimate hiring intent and authority to recruit for the position</li>
                <li>All information provided is accurate, complete, and not misleading</li>
                <li>The job posting complies with all applicable employment laws and regulations</li>
                <li>The posting does not contain discriminatory language or requirements</li>
                <li>You will not use false, deceptive, or misleading job titles or descriptions</li>
                <li>You will honor the terms and compensation described in your posting</li>
              </ul>

              <h3 className="text-lg font-semibold text-white">For Job Seekers</h3>
              <p>
                When creating a profile or applying for jobs, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and truthful information about your qualifications</li>
                <li>Not misrepresent your credentials, experience, or certifications</li>
                <li>Own the rights to any resume or portfolio materials you upload</li>
                <li>Not apply for positions you are not qualified for or have no intention of accepting</li>
              </ul>

              <h3 className="text-lg font-semibold text-white">Content Review & Removal</h3>
              <p>
                We manually review job postings but do not guarantee the accuracy or legitimacy of any listing. We reserve the right to reject, remove, or modify any content that violates these Terms, is illegal, harmful, offensive, or inappropriate at our sole discretion.
              </p>

              <h3 className="text-lg font-semibold text-white">License to User Content</h3>
              <p>
                By posting content on our platform, you grant us a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your content for the purpose of operating and promoting our services. You retain all ownership rights to your content.
              </p>
            </div>
          </section>

          {/* Section 4: Payment Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">4. Payment Terms</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <h3 className="text-lg font-semibold text-white">Pricing</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="text-white font-semibold">Standard Listing:</span> $249 USD for a 30-day active job posting</li>
                <li><span className="text-white font-semibold">Featured Listing:</span> $398 USD total (includes 7 days of homepage placement plus 30-day standard listing)</li>
              </ul>

              <h3 className="text-lg font-semibold text-white">Payment Processing</h3>
              <p>
                All payments are processed securely through Stripe. We do not store your credit card information. By making a payment, you agree to Stripe's terms of service and privacy policy.
              </p>

              <h3 className="text-lg font-semibold text-white">Refund Policy</h3>
              <p className="text-white font-semibold">
                All job posting fees are generally non-refundable, subject to the following exceptions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds may be issued within 48 hours of purchase if you are unsatisfied</li>
                <li>Refunds may be issued if there is a platform error preventing your listing from displaying</li>
                <li>No refunds are provided if you fill the position early or remove your listing voluntarily</li>
                <li>No refunds are provided for lack of applicants or hiring outcomes</li>
              </ul>

              <h3 className="text-lg font-semibold text-white">Listing Duration</h3>
              <p>
                Job postings remain active for 30 days from the date of payment, regardless of when the position is filled. You may edit your listing at any time during this period through your employer dashboard.
              </p>

              <h3 className="text-lg font-semibold text-white">No Auto-Renewal</h3>
              <p>
                We do not automatically renew or charge for job postings. Each posting is a one-time purchase for the specified duration.
              </p>

              <h3 className="text-lg font-semibold text-white">Price Changes</h3>
              <p>
                We reserve the right to modify our pricing at any time. Price changes will not affect active listings purchased prior to the change.
              </p>
            </div>
          </section>

          {/* Section 5: Prohibited Uses */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">5. Prohibited Uses & User Conduct</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                You agree NOT to use our platform to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Post fake, fraudulent, or spam job listings</li>
                <li>Harvest, scrape, or collect user data or email addresses</li>
                <li>Use automated bots, scrapers, or data mining tools</li>
                <li>Conduct competitor research by systematically downloading content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Introduce viruses, malware, or malicious code</li>
                <li>Impersonate any person or entity</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Post discriminatory, offensive, or illegal content</li>
                <li>Violate any applicable employment laws or regulations</li>
                <li>Use the platform for any purpose other than legitimate job searching or recruitment</li>
              </ul>
            </div>
          </section>

          {/* Section 6: Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property Rights</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <h3 className="text-lg font-semibold text-white">Platform Ownership</h3>
              <p>
                Work In Data Center and all associated logos, designs, text, graphics, code, and other content are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-lg font-semibold text-white">User Content Ownership</h3>
              <p>
                You retain all ownership rights to content you post (job listings, resumes, profiles). However, you grant us a license to use, display, and distribute this content as necessary to operate our platform.
              </p>

              <h3 className="text-lg font-semibold text-white">Restrictions</h3>
              <p>
                You may not copy, modify, distribute, sell, or reverse engineer any part of our platform without our express written permission.
              </p>

              <h3 className="text-lg font-semibold text-white">DMCA Compliance</h3>
              <p>
                If you believe your copyright has been infringed, please contact us at <a href="mailto:support@workindatacenter.com" className="text-ice-400 hover:text-ice-300 underline">support@workindatacenter.com</a> with details of the alleged infringement.
              </p>
            </div>
          </section>

          {/* Section 7: Third-Party Services */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">7. Third-Party Services</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                Our platform integrates with or links to third-party services, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Stripe for payment processing</li>
                <li>External employer websites for job applications</li>
                <li>Third-party email services</li>
              </ul>
              <p>
                We are not responsible for the content, privacy practices, or terms of service of any third-party services. Your interactions with third parties are solely between you and them.
              </p>
            </div>
          </section>

          {/* Section 8: Disclaimers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimers & Warranties</h2>
            <GlassCard className="bg-amber-500/5 border-amber-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                <div className="space-y-4 text-silver-300 leading-relaxed">
                  <p className="text-white font-semibold">
                    IMPORTANT DISCLAIMERS - PLEASE READ CAREFULLY
                  </p>

                  <p>
                    <span className="text-white font-semibold">Platform Intermediary Status:</span> Work In Data Center operates solely as an intermediary platform connecting employers with job seekers. We are NOT a party to any employment relationship, contract, or agreement between employers and candidates. We do not employ, recommend, endorse, or verify any employers or job seekers.
                  </p>

                  <p>
                    <span className="text-white font-semibold">No Verification:</span> We do not conduct background checks, verify credentials, confirm security clearances, or validate certifications of job seekers or employers. All verification is the responsibility of the hiring parties.
                  </p>

                  <p>
                    <span className="text-white font-semibold">Job Posting Accuracy:</span> While we manually review job postings, we do NOT guarantee the accuracy, completeness, legitimacy, or legality of any job listing. Employers are solely responsible for the content of their postings and compliance with employment laws.
                  </p>

                  <p>
                    <span className="text-white font-semibold">No Employment Guarantees:</span> We do not guarantee that employers will find suitable candidates or that job seekers will find employment. Success depends on many factors outside our control.
                  </p>

                  <p>
                    <span className="text-white font-semibold">"AS-IS" Service:</span> THE PLATFORM IS PROVIDED "AS-IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                  </p>

                  <p>
                    <span className="text-white font-semibold">Service Availability:</span> We do not guarantee uninterrupted, timely, secure, or error-free operation of our platform. We may suspend or discontinue services at any time.
                  </p>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Section 9: Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p className="text-white font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Our total liability to you for any claims arising from your use of the platform is limited to the amount you paid us in the 12 months preceding the claim, or $249, whichever is less</li>
                <li>We are NOT liable for any indirect, incidental, consequential, special, or punitive damages</li>
                <li>We are NOT liable for lost profits, lost data, lost opportunities, or business interruption</li>
                <li>We are NOT liable for the conduct, content, or actions of third parties (employers or job seekers)</li>
                <li>We are NOT liable for employment outcomes, hiring decisions, or workplace issues</li>
                <li>We are NOT liable for technical failures, data loss, or security breaches beyond our control</li>
              </ul>
              <p>
                Some jurisdictions do not allow limitations on implied warranties or limitation of liability for incidental or consequential damages. In such jurisdictions, our liability is limited to the greatest extent permitted by law.
              </p>
            </div>
          </section>

          {/* Section 10: Indemnification */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                You agree to indemnify, defend, and hold harmless Work In Data Center, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising from or relating to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your violation of these Terms</li>
                <li>Your use or misuse of the platform</li>
                <li>Content you post or transmit through the platform</li>
                <li>Your violation of any third-party rights, including intellectual property or privacy rights</li>
                <li>Your violation of any applicable laws or regulations</li>
                <li>Any employment-related disputes or claims</li>
              </ul>
            </div>
          </section>

          {/* Section 11: Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">11. Privacy & Data Protection</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                Your privacy is important to us. Our collection, use, and disclosure of personal information is governed by our <Link href="/privacy" className="text-ice-400 hover:text-ice-300 underline">Privacy Policy</Link>.
              </p>
              <p>
                By using our platform, you consent to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Collection of personal and usage data as described in our Privacy Policy</li>
                <li>Use of cookies and similar technologies</li>
                <li>Processing of your data in accordance with applicable privacy laws</li>
              </ul>
            </div>
          </section>

          {/* Section 12: Dispute Resolution */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">12. Dispute Resolution</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <h3 className="text-lg font-semibold text-white">Governing Law</h3>
              <p>
                These Terms are governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions.
              </p>

              <h3 className="text-lg font-semibold text-white">Informal Resolution</h3>
              <p>
                Before filing any formal dispute, you agree to contact us at <a href="mailto:support@workindatacenter.com" className="text-ice-400 hover:text-ice-300 underline">support@workindatacenter.com</a> to seek an informal resolution.
              </p>

              <h3 className="text-lg font-semibold text-white">Jurisdiction</h3>
              <p>
                Any legal action or proceeding arising under these Terms shall be brought exclusively in the federal or state courts located in the United States, and you consent to personal jurisdiction in such courts.
              </p>
            </div>
          </section>

          {/* Section 13: Modifications to Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">13. Modifications to Terms</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                We reserve the right to modify these Terms at any time. When we make changes, we will:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Update the "Last Updated" date at the top of this page</li>
                <li>Notify you via email or platform notice for material changes</li>
                <li>Post the updated Terms on our website</li>
              </ul>
              <p>
                Your continued use of the platform after changes become effective constitutes acceptance of the modified Terms. If you do not agree to the changes, you must stop using our services.
              </p>
              <p>
                We recommend reviewing these Terms periodically to stay informed of any updates.
              </p>
            </div>
          </section>

          {/* Section 14: General Provisions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">14. General Provisions</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                <span className="text-white font-semibold">Severability:</span> If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
              </p>
              <p>
                <span className="text-white font-semibold">No Waiver:</span> Our failure to enforce any provision of these Terms does not constitute a waiver of that provision.
              </p>
              <p>
                <span className="text-white font-semibold">Assignment:</span> You may not assign or transfer these Terms without our written consent. We may assign these Terms without restriction.
              </p>
              <p>
                <span className="text-white font-semibold">Entire Agreement:</span> These Terms, together with our Privacy Policy, constitute the entire agreement between you and Work In Data Center regarding use of the platform.
              </p>
              <p>
                <span className="text-white font-semibold">Force Majeure:</span> We are not liable for any failure to perform due to circumstances beyond our reasonable control.
              </p>
              <p>
                <span className="text-white font-semibold">No Agency:</span> No agency, partnership, joint venture, or employment relationship is created between you and Work In Data Center as a result of these Terms or your use of the platform.
              </p>
            </div>
          </section>

          {/* Section 15: Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">15. Contact Information</h2>
            <div className="space-y-4 text-silver-300 leading-relaxed">
              <p>
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="glass rounded-lg p-6 mt-4">
                <p className="text-white font-semibold mb-2">Work In Data Center</p>
                <p>Email: <a href="mailto:support@workindatacenter.com" className="text-ice-400 hover:text-ice-300 underline">support@workindatacenter.com</a></p>
                <p className="mt-3">
                  Or visit our <Link href="/contact" className="text-ice-400 hover:text-ice-300 underline">Contact Page</Link>
                </p>
              </div>
            </div>
          </section>

          {/* Acknowledgment */}
          <GlassCard className="bg-ice-500/5 border-ice-500/20">
            <p className="text-center text-silver-300 leading-relaxed">
              By using Work In Data Center, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
