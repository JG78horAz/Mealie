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
  return body.access_token as string;
}

function percentile(values: number[], percent: number) {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percent / 100) * sorted.length) - 1;
  return sorted[index];
}

// Load Test 1
test('recipe list handles parallel api requests', async ({ request }) => {
  const token = await login(request);
  const durations: number[] = [];
  const requestCount = 20;

  const responses = await Promise.all(
    Array.from({ length: requestCount }, async () => {
      const startedAt = Date.now();
      const response = await request.get('/api/recipes?page=1&perPage=10', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      durations.push(Date.now() - startedAt);
      return response;
    })
  );

  for (const response of responses) {
    expect(response.status()).toBe(200);
  }

  const average = durations.reduce((sum, value) => sum + value, 0) / durations.length;
  const p95 = percentile(durations, 95);

  console.log(`Load result: requests=${requestCount}, average=${Math.round(average)}ms, p95=${p95}ms`);

  expect(p95).toBeLessThan(2000);
});
