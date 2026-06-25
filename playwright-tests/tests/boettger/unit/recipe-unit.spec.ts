import { test, expect } from '@playwright/test';
import { useRecipePermissions } from '../../../../frontend/app/composables/recipes/use-recipe-permissions';

function createRecipe(overrides = {}) {
  return {
    userId: 'recipe-owner',
    groupId: 'group-1',
    householdId: 'household-1',
    settings: {
      locked: false,
    },
    ...overrides,
  } as any;
}

function createUser(overrides = {}) {
  return {
    id: 'user-1',
    groupId: 'group-1',
    householdId: 'household-1',
    ...overrides,
  } as any;
}

function createHousehold(value: any) {
  return {
    value,
  } as any;
}

test('recipe owner can edit recipe', async () => {
  const recipe = createRecipe({
    userId: 'user-1',
  });

  const user = createUser({
    id: 'user-1',
  });

  const recipeHousehold = createHousehold(undefined);

  const { canEditRecipe } = useRecipePermissions(recipe, recipeHousehold, user);

  expect(canEditRecipe.value).toBe(true);
});

test('user without id cannot edit recipe', async () => {
  const recipe = createRecipe();
  const user = createUser({
    id: undefined,
  });

  const recipeHousehold = createHousehold(undefined);

  const { canEditRecipe } = useRecipePermissions(recipe, recipeHousehold, user);

  expect(canEditRecipe.value).toBe(false);
});

test('user from different group cannot edit recipe', async () => {
  const recipe = createRecipe({
    groupId: 'group-1',
  });

  const user = createUser({
    groupId: 'group-2',
  });

  const recipeHousehold = createHousehold(undefined);

  const { canEditRecipe } = useRecipePermissions(recipe, recipeHousehold, user);

  expect(canEditRecipe.value).toBe(false);
});

test('user cannot edit locked recipe', async () => {
  const recipe = createRecipe({
    settings: {
      locked: true,
    },
  });

  const user = createUser();

  const recipeHousehold = createHousehold(undefined);

  const { canEditRecipe } = useRecipePermissions(recipe, recipeHousehold, user);

  expect(canEditRecipe.value).toBe(false);
});

test('user from another household cannot edit when household locks recipe edits', async () => {
  const recipe = createRecipe({
    householdId: 'household-1',
  });

  const user = createUser({
    householdId: 'household-2',
  });

  const recipeHousehold = createHousehold({
    preferences: {
      lockRecipeEditsFromOtherHouseholds: true,
    },
  });

  const { canEditRecipe } = useRecipePermissions(recipe, recipeHousehold, user);

  expect(canEditRecipe.value).toBe(false);
});
