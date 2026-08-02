'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Download, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ImportJobsButtonProps {
  disabled?: boolean;
}

export function ImportJobsButton({ disabled }: ImportJobsButtonProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleImport = async () => {
    if (disabled) return;

    setIsImporting(true);
    setError(null);
    setStats(null);

    try {
      const response = await fetch('/api/admin/jobs/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limit: 100 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import jobs');
      }

      setStats(data.stats);

      // Refresh the page to show new jobs
      router.refresh();
    } catch (err: any) {
      console.error('Import error:', err);
      setError(err.message || 'Failed to import jobs');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-3">
      <Button
        onClick={handleImport}
        disabled={disabled || isImporting}
        className="flex items-center gap-2"
      >
        {isImporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Importing...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Import Jobs
          </>
        )}
      </Button>

      {isImporting && (
        <div className="text-xs text-silver-400 text-right">
          <p>This may take 2-3 minutes...</p>
          <p>Fetching 100 pages from API</p>
        </div>
      )}

      {stats && (
        <div className="glass rounded-lg p-4 text-sm">
          <p className="text-green-400 font-medium mb-2">✓ Import Complete!</p>
          <div className="space-y-1 text-silver-400">
            <p>Fetched: {stats.totalFetched} jobs</p>
            <p>Relevant: {stats.totalScored} jobs</p>
            <p>Imported: {stats.totalImported} jobs</p>
            <p>Updated: {stats.totalUpdated} existing jobs</p>
            <p>Skipped: {stats.totalSkipped} (duplicates)</p>
            {stats.errors > 0 && (
              <p className="text-red-400">Errors: {stats.errors}</p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="glass rounded-lg p-4 text-sm bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 font-medium mb-1">Import Failed</p>
          <p className="text-silver-400">{error}</p>
        </div>
      )}
    </div>
  );
}
