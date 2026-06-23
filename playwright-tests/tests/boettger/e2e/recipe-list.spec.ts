import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test('created recipe appears in recipe list', async ({ page }) => {
  const recipeName = `WAT4 Test List Recipe ${Date.now()}`;

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

  await page.getByRole('link', { name: 'Recipes', exact: true }).click();

  await expect(
    page.getByRole('link', { name: new RegExp(recipeName) })
  ).toBeVisible();
});
