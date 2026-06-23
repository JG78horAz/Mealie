import { test, expect } from '@playwright/test';

function normalizeRecipeTitle(title: string): string {
  return title.trim().replace(/\s+/g, ' ');
}

function isValidRecipeTitle(title: string): boolean {
  return normalizeRecipeTitle(title).length >= 3;
}

function createRecipeSlug(title: string): string {
  return normalizeRecipeTitle(title)
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function calculateTotalPreparationTime(prepTimeMinutes: number, cookTimeMinutes: number): number {
  return prepTimeMinutes + cookTimeMinutes;
}

function formatServingText(servings: number): string {
  if (servings === 1) {
    return '1 serving';
  }

  return `${servings} servings`;
}

test('normalizes recipe title by trimming spaces', async () => {
  expect(normalizeRecipeTitle('  WAT4 Test Pasta  ')).toBe('WAT4 Test Pasta');
});

test('normalizes multiple spaces inside recipe title', async () => {
  expect(normalizeRecipeTitle('WAT4   Test   Pasta')).toBe('WAT4 Test Pasta');
});

test('rejects recipe titles with less than three characters', async () => {
  expect(isValidRecipeTitle('A')).toBe(false);
  expect(isValidRecipeTitle('  AB  ')).toBe(false);
});

test('creates a URL friendly recipe slug', async () => {
  expect(createRecipeSlug('Käse Spätzle mit Öl')).toBe('kaese-spaetzle-mit-oel');
});

test('calculates total preparation time', async () => {
  expect(calculateTotalPreparationTime(15, 25)).toBe(40);
});

test('formats serving text for one and multiple servings', async () => {
  expect(formatServingText(1)).toBe('1 serving');
  expect(formatServingText(4)).toBe('4 servings');
});
