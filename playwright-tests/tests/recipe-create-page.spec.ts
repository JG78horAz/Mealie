import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test('opens manual recipe creation page and enters recipe name', async ({ page }) => {
  const recipeName = `WAT4 Test Pasta mit Leberkas ${Date.now()}`;

  await login(page);

  await page.goto('/g/home/r/create/new');

  const recipeNameInput = page.getByRole('textbox', {
    name: /Rezeptname|Recipe Name/i,
  });

  await expect(recipeNameInput).toBeVisible();
  await recipeNameInput.fill(recipeName);

  await Promise.all([
    page.waitForURL(/\/g\/home\/r\/.+\?edit=true/),
    page
      .getByRole('main')
      .getByRole('button', { name: 'Create', exact: true })
      .click(),
  ]);

  await expect(page.locator(`input[value="${recipeName}"]`)).toBeVisible();
});
