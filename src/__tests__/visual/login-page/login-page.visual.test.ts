import { expect, test } from '@playwright/test';
import { LoginPage } from '@/__tests__/visual/_page-objects/login.pageobject.ts';

test.describe('login page', () => {
  test('login form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();

    await expect(loginPage.page).toHaveScreenshot();
  });

  test('login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();

    await loginPage.loginAsAdmin('invalid-xpriv-key');

    await expect(loginPage.page).toHaveScreenshot();
  });
});
