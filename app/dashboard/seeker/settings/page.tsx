import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { GlassCard } from '@/components/GlassCard';
import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm';
import { UpdateSeekerProfileForm } from '@/components/settings/seeker/UpdateSeekerProfileForm';
import { SeekerNotificationPreferencesForm } from '@/components/settings/seeker/SeekerNotificationPreferencesForm';
import { DeleteAccountDialog } from '@/components/settings/DeleteAccountDialog';
import { User, Bell, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function SeekerSettings() {
  const session = await getSession();

  if (!session || session.role !== 'JOB_SEEKER') {
    redirect('/login');
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/seeker"
            className="inline-flex items-center text-ice-400 hover:text-ice-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-silver-400">Manage your profile, notifications, and preferences</p>
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
              <UpdateSeekerProfileForm />
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

          {/* Email Notifications */}
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
                  Choose which emails you want to receive about jobs and applications
                </p>
              </div>
              <SeekerNotificationPreferencesForm />
            </GlassCard>
          </section>

          {/* Danger Zone */}
          <section id="danger-zone">
            <GlassCard className="border-red-500/30">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-silver-400 mb-4">
                  Once you delete your account, there is no going back. All your applications and saved jobs will be permanently removed.
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
