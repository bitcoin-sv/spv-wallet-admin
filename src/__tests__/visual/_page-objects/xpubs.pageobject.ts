import { Page } from '@playwright/test';
import { XpubExtended } from '@/interfaces';
import { DEFAULT_WAIT_FOR_TIMEOUT } from '@/__tests__/visual/_page-objects/defaults.ts';

export class AdminXpubsPage {
  constructor(public readonly page: Page) {}

  async willLoadXpubsListsFromServer() {
    await this.page.route('**/admin/xpubs/search', async (route) => {
      const json: XpubExtended[] = [
        {
          created_at: new Date('2024-08-02T09:22:06.184649Z'),
          updated_at: new Date('2024-08-02T09:22:06.184649Z'),
          id: 'e7d96399df6400de6a16d34adf63fcb500b0b6cd9f016db4b8201b99d24679df',
          current_balance: 0,
          next_internal_num: 0,
          next_external_num: 1,
          status: '',
        },
        {
          created_at: new Date('2024-08-02T09:22:06.184649Z'),
          updated_at: new Date('2024-08-02T09:22:06.184649Z'),
          id: 'd996ee8eaec948344cc786869631b5b6d8da946022dbdd620e44af39d4676dde',
          current_balance: 0,
          next_internal_num: 0,
          next_external_num: 0,
          status: '',
        },
        {
          created_at: new Date('2024-08-02T09:22:06.184649Z'),
          updated_at: new Date('2024-08-02T09:22:06.184649Z'),
          id: '8d15111d656d7b7034d08b007ff66d3e78ba38228a7cfa4be18f91296b8632dc',
          current_balance: 125,
          next_internal_num: 35,
          next_external_num: 2,
          status: '',
        },
        {
          created_at: new Date('2024-08-02T09:22:06.184649Z'),
          updated_at: new Date('2024-08-02T09:22:06.184649Z'),
          id: '378aa9182fc61b1c6b8e132bb6f1b52f3c85320407d259a95a8cf2dcbbfa9d8c',
          current_balance: 121,
          next_internal_num: 8,
          next_external_num: 2,
          status: '',
        },
      ];

      await route.fulfill({ json });
    });
  }

  async open() {
    await this.page.goto('/admin/xpub');

    await this.waitToBeLoaded();
  }

  async waitToBeLoaded() {
    const total = this.page.getByTestId('table_total');
    await total.waitFor({ state: 'visible', timeout: DEFAULT_WAIT_FOR_TIMEOUT });
  }
}
