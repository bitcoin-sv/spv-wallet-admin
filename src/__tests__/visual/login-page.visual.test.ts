import { expect, test } from '@playwright/test';

test.describe('login page', () => {
  test('login form', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('form#login-form');

    await expect(page).toHaveScreenshot();
  });
});
