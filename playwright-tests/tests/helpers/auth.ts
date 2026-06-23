import { Page, expect } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('/login');

  await page.locator('input').nth(0).fill('test@example.com');
  await page.locator('input').nth(1).fill('Test1234!');

  await page.getByRole('button', { name: /Anmeldung|Login/i }).click();

  await expect(page).not.toHaveURL(/\/login/);

  await page.goto('/g/home');
  await expect(page).toHaveURL(/\/g\/home/);
}