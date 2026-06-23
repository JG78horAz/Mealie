import { test, expect } from '@playwright/test';
import { login } from '../../helpers/auth';

test('creates a recipe with a unique title', async ({ page }) => {
  const recipeName = `WAT4 Test Recipe ${Date.now()}`;

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

test('finds a created recipe via search and opens it', async ({ page }) => {
  const recipeName = `WAT4 Test Search Recipe ${Date.now()}`;

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
