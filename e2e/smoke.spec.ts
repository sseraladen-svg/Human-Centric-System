import { expect, test } from '@playwright/test';

test('new profile requires consent before saving progress in this browser', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/player\.html$/);
  await expect(page.locator('#app')).not.toBeEmpty();
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Create a local profile' })).toBeVisible();
  await page.getByLabel('Display name').fill('Browser player');
  await page.getByRole('button', { name: 'Save consent and create profile' }).click();
  await expect(page.getByText('Confirm browser storage consent')).toBeVisible();
  await page.getByRole('checkbox', { name: /I agree to save my progress in this browser/ }).check();
  await page.getByRole('button', { name: 'Save consent and create profile' }).click();
  await expect(page.getByRole('heading', { name: 'Baseline Assessment' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Baseline Assessment' })).toBeVisible();
});

test('state endpoint is reachable from the app shell', async ({ page }) => {
  const response = await page.request.get('/api/state');
  expect(response.status()).toBe(200);
  const json = await response.json();
  expect(json.profile.displayName).toBe('Demo user');
  expect(json.quests.length).toBeGreaterThan(0);
});
