import { test, expect, APIRequestContext, APIResponse } from '@playwright/test';

const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'Test1234!';

const LOAD_STAGES = [1, 5, 10, 15, 20, 15, 10, 5, 1];

type StageResult = {
  users: number;
  durationMs: number;
  successCount: number;
  errorCount: number;
};

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

async function runRecipeListStage(
  request: APIRequestContext,
  token: string,
  virtualUsers: number,
): Promise<StageResult> {
  const startTime = Date.now();

  const responses: APIResponse[] = await Promise.all(
    Array.from({ length: virtualUsers }, () =>
      request.get('/api/recipes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ),
  );

  const durationMs = Date.now() - startTime;
  const successCount = responses.filter((response) => response.ok()).length;
  const errorCount = responses.length - successCount;

  return {
    users: virtualUsers,
    durationMs,
    successCount,
    errorCount,
  };
}

test('recipe list handles ramp-up and ramp-down api load', async ({ request }) => {
  const token = await login(request);
  const results: StageResult[] = [];

  for (const users of LOAD_STAGES) {
    const result = await runRecipeListStage(request, token, users);
    results.push(result);

    console.log(
      `users=${result.users}, durationMs=${result.durationMs}, success=${result.successCount}, errors=${result.errorCount}`,
    );

    expect(result.errorCount).toBe(0);
    expect(result.durationMs).toBeLessThan(10000);
  }

  const totalRequests = results.reduce((sum, result) => sum + result.users, 0);
  const totalErrors = results.reduce((sum, result) => sum + result.errorCount, 0);
  const totalDurationMs = results.reduce((sum, result) => sum + result.durationMs, 0);
  const successRate = ((totalRequests - totalErrors) / totalRequests) * 100;

  console.log('Load test summary:', {
    stages: LOAD_STAGES,
    totalRequests,
    totalErrors,
    totalDurationMs,
    successRate: `${successRate.toFixed(2)}%`,
  });

  expect(totalRequests).toBe(82);
  expect(totalErrors).toBe(0);
  expect(successRate).toBe(100);
});
