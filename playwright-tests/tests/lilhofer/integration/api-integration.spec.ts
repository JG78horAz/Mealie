import { test, expect, APIRequestContext } from '@playwright/test';

const user = {
  email: 'test@example.com',
  password: 'Test1234!',
};

async function login(request: APIRequestContext) {
  const response = await request.post('/api/auth/token', {
    form: {
      username: user.email,
      password: user.password,
      remember_me: 'false',
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.access_token).toBeTruthy();

  return body.access_token as string;
}

// Integration Test 1
test('user endpoint needs authentication', async ({ request }) => {
  const response = await request.get('/api/users/self');

  expect(response.status()).toBe(401);
});

// Integration Test 2
test('api login returns the current user', async ({ request }) => {
  const token = await login(request);
  const response = await request.get('/api/users/self', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.email).toBe(user.email);
  expect(body.groupSlug).toBe('home');
});

// Integration Test 3
test('recipe can be created and loaded through the api', async ({ request }) => {
  const token = await login(request);
  const name = `Lilhofer Integration Recipe ${Date.now()}`;
  const createResponse = await request.post('/api/recipes', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      name,
    },
  });

  expect(createResponse.status()).toBe(201);

  const slug = await createResponse.json();
  const recipeResponse = await request.get(`/api/recipes/${slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  expect(recipeResponse.status()).toBe(200);

  const recipe = await recipeResponse.json();
  expect(recipe.name).toBe(name);
  expect(recipe.slug).toBe(slug);
});
