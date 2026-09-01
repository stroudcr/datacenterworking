'use client';

export function TrackedApplyLink({ jobId, href, children }: { jobId: string; href: string; children: React.ReactNode }) {
  function record() {
    const key = `widc:apply-click:${jobId}`;
    const analyticsWindow = window as Window & {
      gtag?: (...args: unknown[]) => void;
    };
    if (!analyticsWindow.gtag) return;

    try {
      if (sessionStorage.getItem(key)) return;
    } catch {}

    analyticsWindow.gtag('event', 'job_apply_click', {
      job_id: jobId,
      application_method: href.startsWith('mailto:') ? 'email' : 'external',
    });

    try {
      sessionStorage.setItem(key, '1');
    } catch {}
  }
  return <a href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" onClick={record}>{children}</a>;
}
