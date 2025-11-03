'use server';

import { redirect } from 'next/navigation';
import { clearAuthCookie } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function logout() {
  await clearAuthCookie();
  revalidatePath('/', 'layout'); // Revalidate entire layout tree
  redirect('/');
}
