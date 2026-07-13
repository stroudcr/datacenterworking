import { test, expect } from '@playwright/test';

test('employer landing routes into the selected checkout plan', async ({ page }) => {
  await page.goto('/employers');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Put your role');
  await page.getByRole('link', { name: /Post a job/ }).first().click();
  await expect(page).toHaveURL(/post-job\?plan=standard/);
  await expect(page.getByRole('button', { name: /secure checkout|Post a Job/ }).first()).toBeVisible();
});

test('featured query selects the featured price on mobile and employer role is normalized', async ({ page }) => {
  await page.goto('/post-job?plan=featured');
  await expect(page.locator('input[type="checkbox"]:visible')).toBeChecked();
  await expect(page.locator('button:visible').filter({ hasText: '$398' })).toBeVisible();
  await page.goto('/register?role=employer');
  await expect(page.getByRole('button', { name: 'Employer' })).toHaveClass(/border-ice-500/);
});
