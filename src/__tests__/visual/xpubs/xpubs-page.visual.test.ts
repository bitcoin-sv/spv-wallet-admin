import { expect, test } from '@playwright/test';
import { LoginPage } from '@/__tests__/visual/_page-objects/login.pageobject.ts';
import { AdminXpubsPage } from '@/__tests__/visual/_page-objects/xpubs.pageobject.ts';

test.describe('xpubs page', () => {
  test('xpubs table with data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const xpubsPage = new AdminXpubsPage(page);
    await xpubsPage.willLoadXpubsListsFromServer();

    await loginPage.open();
    await loginPage.loginAsAdmin();

    await xpubsPage.waitToBeLoaded();

    await expect(page).toHaveScreenshot();
  });
});
