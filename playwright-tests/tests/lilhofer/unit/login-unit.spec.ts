import { test, expect } from '@playwright/test';
import { scorePassword } from '../../../../frontend/app/lib/validators/password';

// Unit Test 1
test('empty password gets score zero', () => {
  expect(scorePassword('')).toBe(0);
});

// Unit Test 2
test('short password gets score zero', () => {
  expect(scorePassword('Ab1!')).toBe(0);
});

// Unit Test 3
test('password with blocked login word gets score zero', () => {
  expect(scorePassword('Login1234!')).toBe(0);
});

// Unit Test 4
test('mixed password gets a higher score than plain lowercase password', () => {
  expect(scorePassword('Test1234!')).toBeGreaterThan(scorePassword('testtest'));
});

// Unit Test 5
test('password score never goes above one hundred', () => {
  expect(scorePassword('SehrLangesPasswort1234!MitSonderzeichen')).toBeLessThanOrEqual(100);
});
