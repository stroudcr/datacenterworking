'use client';

import { useState } from 'react';
import { ATTRIBUTION_KEY } from '@/lib/attribution';
import { trackFunnel } from '@/lib/analytics';
import { Button } from './Button';
import { Input } from './Input';

export function EmployerLeadForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState('sending'); setError('');
    const form = new FormData(event.currentTarget);
    let attribution = null;
    try { attribution = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || 'null'); } catch {}
    const response = await fetch('/api/employer-leads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...Object.fromEntries(form.entries()), attribution }),
    });
    if (!response.ok) { const body = await response.json(); setError(body.error || 'Please try again.'); setState('idle'); return; }
    setState('sent'); trackFunnel('employer_lead_submitted', { form: 'employer_consultation' });
  }
  if (state === 'sent') return <div className="rounded-xl border border-green-400/30 bg-green-500/10 p-6 text-green-200">Thanks — your hiring request is saved. We’ll follow up using the work email you provided.</div>;
  return <form onSubmit={submit} className="grid gap-4 md:grid-cols-2" id="consultation">
    <Input required name="name" label="Your name" fullWidth />
    <Input required name="workEmail" type="email" label="Work email" fullWidth />
    <Input required name="company" label="Company" fullWidth />
    <label className="text-sm text-silver-200">Inquiry type<select name="inquiryType" className="mt-1 w-full glass rounded-lg px-4 py-2.5 text-white"><option value="VOLUME_HIRING">Volume hiring</option><option value="SINGLE_ROLE">One role</option><option value="RECRUITER_AGENCY">Recruiter or agency</option><option value="PARTNERSHIP">Partnership</option></select></label>
    <label className="text-sm text-silver-200">Expected hiring volume<select name="hiringVolume" className="mt-1 w-full glass rounded-lg px-4 py-2.5 text-white"><option value="ONE">1 role</option><option value="TWO_TO_FIVE">2–5 roles</option><option value="SIX_TO_TWENTY">6–20 roles</option><option value="TWENTY_PLUS">20+ roles</option></select></label>
    <label className="text-sm text-silver-200">Hiring timeline<select name="timeline" className="mt-1 w-full glass rounded-lg px-4 py-2.5 text-white"><option value="NOW">Hiring now</option><option value="THIRTY_DAYS">Within 30 days</option><option value="NINETY_DAYS">Within 90 days</option><option value="EXPLORING">Exploring options</option></select></label>
    <label className="md:col-span-2 text-sm text-silver-200">Roles<textarea required name="roles" maxLength={500} className="mt-1 min-h-24 w-full glass rounded-lg px-4 py-3 text-white" placeholder="Critical facilities technicians, data center technicians…" /></label>
    <Input name="locations" label="Locations (optional)" fullWidth />
    <Input name="notes" label="Additional context (optional)" fullWidth />
    {error && <p className="md:col-span-2 text-red-400">{error}</p>}
    <div className="md:col-span-2"><Button type="submit" size="lg" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Discuss volume hiring'}</Button></div>
  </form>;
}
