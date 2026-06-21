import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test('opens manual recipe creation page and enters recipe name', async ({ page }) => {
  const recipeName = `WAT4 Test Pasta mit Leberkas ${Date.now()}`;

  await login(page);

  await page.getByRole('button', { name: 'Create', exact: true }).click();

  await page
    .getByRole('link', {
      name: /Erstellen Ein Rezept manuell|Ein Rezept manuell|Create.*recipe manually/i,
    })
    .click();

  const recipeNameInput = page.getByRole('textbox', {
    name: /Rezeptname|Recipe Name/i,
  });

  await expect(recipeNameInput).toBeVisible();
  await recipeNameInput.fill(recipeName);

  await page
    .getByRole('main')
    .getByRole('button', { name: 'Create', exact: true })
    .click();

  await expect(page.getByText(recipeName).first()).toBeVisible();
});