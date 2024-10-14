import { Page } from '@playwright/test';

export class LoginPage {
  constructor(public readonly page: Page) {}

  async open() {
    await this.page.goto('/');

    await this.page.waitForSelector('form#login-form');
  }

  async loginAsAdmin(xprivKey?: string) {
    const loginKey =
      xprivKey ||
      'xprv9s21ZrQH143K3CbJXirfrtpLvhT3Vgusdo8coBritQ3rcS7Jy7sxWhatuxG5h2y1Cqj8FKmPp69536gmjYRpfga2MJdsGyBsnB12E19CESK';

    await this.open();

    await this.page.route('**/status', async (route) => {
      await route.fulfill({ json: [] });
    });

    await this.page.locator('input[type="password"]').fill(loginKey);

    await this.page.getByText('Sign in').click();
  }
}
