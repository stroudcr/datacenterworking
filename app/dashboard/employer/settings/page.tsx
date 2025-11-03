import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { GlassCard } from '@/components/GlassCard';
import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm';
import { UpdateProfileForm } from '@/components/settings/UpdateProfileForm';
import { NotificationPreferencesForm } from '@/components/settings/NotificationPreferencesForm';
import { DeleteAccountDialog } from '@/components/settings/DeleteAccountDialog';
import { User, Bell, CreditCard, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function EmployerSettings() {
  const session = await getSession();

  if (!session || session.role !== 'EMPLOYER') {
    redirect('/login');
  }

  // Fetch user's payment history
  const payments = await db.payment.findMany({
    where: {
      userId: session.userId,
      status: 'completed',
    },
    include: {
      job: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/employer"
            className="inline-flex items-center text-ice-400 hover:text-ice-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-silver-400">Manage your account, notifications, and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Account Information */}
          <section id="account">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-ice-500/20">
                <User className="w-5 h-5 text-ice-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Account Information</h2>
            </div>
            <GlassCard>
              <UpdateProfileForm />
            </GlassCard>
          </section>

          {/* Security */}
          <section id="security">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Security</h2>
            </div>
            <GlassCard>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">Change Password</h3>
                <p className="text-sm text-silver-400 mb-4">
                  Update your password to keep your account secure
                </p>
              </div>
              <ChangePasswordForm />
            </GlassCard>
          </section>

          {/* Notification Preferences */}
          <section id="notifications">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Bell className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Email Notifications</h2>
            </div>
            <GlassCard>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">Notification Preferences</h3>
                <p className="text-sm text-silver-400 mb-4">
                  Choose which emails you want to receive from us
                </p>
              </div>
              <NotificationPreferencesForm />
            </GlassCard>
          </section>

          {/* Billing History */}
          <section id="billing">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <CreditCard className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Billing History</h2>
            </div>
            <GlassCard>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">Recent Payments</h3>
                <p className="text-sm text-silver-400 mb-4">
                  View your payment history and receipts
                </p>
              </div>

              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-silver-600 mx-auto mb-3" />
                  <p className="text-silver-400 text-sm">No payment history yet</p>
                </div>
              ) : (
                <>
                  {/* Mobile Card Layout */}
                  <div className="md:hidden space-y-3">
                    {payments.map((payment) => (
                      <div key={payment.id} className="glass rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            {payment.job ? (
                              <Link
                                href={`/jobs/${payment.job.slug}`}
                                className="text-white hover:text-ice-400 transition-colors font-medium text-sm"
                              >
                                {payment.job.title}
                              </Link>
                            ) : (
                              <span className="text-silver-500 text-sm">Deleted job</span>
                            )}
                          </div>
                          <span className="text-white font-semibold text-sm ml-2">
                            ${(payment.amount / 100).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-silver-400">
                            {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                          </span>
                          {payment.isFeatured ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                              Featured
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-ice-500/20 text-ice-400 font-medium">
                              Standard
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-dark-400">
                          <th className="text-left py-3 px-4 text-sm font-medium text-silver-300">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-silver-300">Job Title</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-silver-300">Type</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-silver-300">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="border-b border-dark-400/50 hover:bg-white/5">
                            <td className="py-3 px-4 text-sm text-silver-300">
                              {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                            </td>
                            <td className="py-3 px-4 text-sm text-white">
                              {payment.job ? (
                                <Link
                                  href={`/jobs/${payment.job.slug}`}
                                  className="hover:text-ice-400 transition-colors"
                                >
                                  {payment.job.title}
                                </Link>
                              ) : (
                                <span className="text-silver-500">Deleted job</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {payment.isFeatured ? (
                                <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                                  Featured
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full bg-ice-500/20 text-ice-400 text-xs font-medium">
                                  Standard
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm text-white text-right font-medium">
                              ${(payment.amount / 100).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </GlassCard>
          </section>

          {/* Danger Zone */}
          <section id="danger-zone">
            <GlassCard className="border-red-500/30">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-silver-400 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
              <DeleteAccountDialog />
            </GlassCard>
          </section>
        </div>
      </div>
    </main>
  );
}
