import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  pageObj: any;
  credentials: { userName: string; password: string } | null = null;
  _registrationMessage?: string;
  _registrationError?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async close() {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);

// Hooks
import { Before, After } from '@cucumber/cucumber';

Before(async function (this: CustomWorld) {
  await this.init();
});

After(async function (this: CustomWorld) {
  await this.close();
});
