import { expect, test } from '@playwright/test';

test('root loads the original prototype frontend', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/player\.html$/);
  await expect(page.locator('#app')).not.toBeEmpty();
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
});

test('state endpoint is reachable from the app shell', async ({ page }) => {
  const response = await page.request.get('/api/state');
  expect(response.status()).toBe(200);
  const json = await response.json();
  expect(json.profile.displayName).toBe('Demo user');
  expect(json.quests.length).toBeGreaterThan(0);
});
