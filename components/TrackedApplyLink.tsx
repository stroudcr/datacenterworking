'use client';

export function TrackedApplyLink({ jobId, href, children }: { jobId: string; href: string; children: React.ReactNode }) {
  function record() {
    const key = `widc:apply-click:${jobId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
      fetch(`/api/jobs/${jobId}/apply-click`, { method: 'POST', keepalive: true }).catch(() => undefined);
    } catch {}
  }
  return <a href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" onClick={record}>{children}</a>;
}
