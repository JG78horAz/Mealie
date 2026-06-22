import { test, expect } from '@playwright/test';
import { login } from '../../helpers/auth';

// E2E Test 1
test('login shows the recipe start page', async ({ page }) => {
  await login(page);

  await expect(page.getByRole('link', { name: 'Recipes', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create', exact: true })).toBeVisible();
});

// E2E Test 2
test('new recipe can be created with the form', async ({ page }) => {
  const recipeName = `Lilhofer E2E Recipe ${Date.now()}`;

  await login(page);
  await page.goto('/g/home/r/create/new');

  await page.getByRole('textbox', { name: /Rezeptname|Recipe Name/i }).fill(recipeName);

  await Promise.all([
    page.waitForURL(/\/g\/home\/r\/.+\?edit=true/),
    page.getByRole('main').getByRole('button', { name: 'Create', exact: true }).click(),
  ]);

  await expect(page.locator(`input[value="${recipeName}"]`)).toBeVisible();
});
