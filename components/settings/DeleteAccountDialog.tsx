'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { AlertTriangle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DeleteAccountDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (confirmation !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, confirmation }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      // Redirect to home page after successful deletion
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setIsLoading(false);
    }
  };

  const closeDialog = () => {
    setIsOpen(false);
    setPassword('');
    setConfirmation('');
    setError('');
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="border-red-500 text-red-400 hover:bg-red-500/10"
      >
        Delete Account
      </Button>

      {/* Dialog Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="relative w-full max-w-md bg-dark-200 border border-dark-400 rounded-xl shadow-2xl">
            {/* Close Button */}
            <button
              onClick={closeDialog}
              className="absolute top-4 right-4 text-silver-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dialog Content */}
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Delete Account</h3>
                  <p className="text-sm text-silver-400">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-300">
                  <strong>Warning:</strong> Deleting your account will permanently remove:
                </p>
                <ul className="mt-2 text-xs text-red-300 list-disc list-inside space-y-1">
                  <li>All your job postings</li>
                  <li>Payment history</li>
                  <li>Applications received</li>
                  <li>Account information</li>
                </ul>
              </div>

              <form onSubmit={handleDelete} className="space-y-4">
                <div>
                  <label
                    htmlFor="delete-password"
                    className="block text-sm font-medium text-silver-300 mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="delete-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-dark-300 border border-dark-400 rounded-lg text-white placeholder-silver-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter your password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="delete-confirmation"
                    className="block text-sm font-medium text-silver-300 mb-1"
                  >
                    Type DELETE to confirm
                  </label>
                  <input
                    type="text"
                    id="delete-confirmation"
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-dark-300 border border-dark-400 rounded-lg text-white placeholder-silver-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Type DELETE"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex space-x-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={closeDialog}
                    disabled={isLoading}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    fullWidth
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    {isLoading ? 'Deleting...' : 'Delete Account'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
