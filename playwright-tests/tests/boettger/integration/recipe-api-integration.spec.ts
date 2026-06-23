import { test, expect, APIRequestContext } from '@playwright/test';

const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'Test1234!';

async function login(request: APIRequestContext): Promise<string> {
  const response = await request.post('/api/auth/token', {
    form: {
      username: TEST_EMAIL,
      password: TEST_PASSWORD,
    },
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  expect(body.access_token).toBeTruthy();

  return body.access_token;
}

test('user endpoint rejects unauthenticated requests', async ({ request }) => {
  const response = await request.get('/api/users/self');

  expect([401, 403]).toContain(response.status());
});

test('api login returns an access token', async ({ request }) => {
  const token = await login(request);

  expect(token.length).toBeGreaterThan(10);
});

test('authenticated user endpoint returns the test user', async ({ request }) => {
  const token = await login(request);

  const response = await request.get('/api/users/self', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  expect(body.email).toBe(TEST_EMAIL);
});
