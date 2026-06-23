import { test, expect } from '@playwright/test';

test('login with valid credentials opens the Mealie start page', async ({ page }) => {
  await page.goto('/login');

  await page.locator('input').nth(0).fill('test@example.com');
  await page.locator('input').nth(1).fill('Test1234!');

  await page.getByRole('button', { name: /Anmeldung|Login|Einloggen/i }).click();

  await expect(page).not.toHaveURL(/\/login/);
  await expect(page.getByText(/Mealie/i)).toBeVisible();
});