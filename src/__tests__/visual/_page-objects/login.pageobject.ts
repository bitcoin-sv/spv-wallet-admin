import { Page } from '@playwright/test';
import { DEFAULT_WAIT_FOR_TIMEOUT } from '@/__tests__/visual/_page-objects/defaults.ts';

export class LoginPage {
  constructor(public readonly page: Page) {}

  async open() {
    await this.page.goto('/');

    await this.page.waitForSelector('form#login-form', { timeout: DEFAULT_WAIT_FOR_TIMEOUT });
  }

  async loginAsAdmin(xprivKey?: string) {
    const loginKey =
      xprivKey ||
      'xprv9s21ZrQH143K3CbJXirfrtpLvhT3Vgusdo8coBritQ3rcS7Jy7sxWhatuxG5h2y1Cqj8FKmPp69536gmjYRpfga2MJdsGyBsnB12E19CESK';

    await this.page.route('**/status', async (route) => {
      await route.fulfill({ json: [] });
    });

    await this.page.locator('input[type="password"]').fill(loginKey);

    await this.page.getByText('Sign in').click();
  }
}
