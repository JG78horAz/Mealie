import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test('recipe found by search can be opened', async ({ page }) => {
  const recipeName = `WAT4 Test Search Open Recipe ${Date.now()}`;

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

  const searchInput = page.getByRole('textbox', {
    name: /Search|Suche|Suchen/i,
  });

  await expect(searchInput).toBeVisible();
  await searchInput.fill(recipeName);

  const recipeLink = page.getByRole('link', {
    name: new RegExp(recipeName),
  });

  await expect(recipeLink).toBeVisible();
  await recipeLink.click();

  await expect(page.getByText(recipeName).first()).toBeVisible();
  await expect(page).toHaveURL(/\/g\/home\/r\//);
});
