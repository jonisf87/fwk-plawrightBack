
import { setWorldConstructor, World, IWorldOptions, Before, After, ITestCaseHookParameter } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, request, APIRequestContext } from '@playwright/test';


import type { RegistrationPage } from '../pages/RegistrationPage';
import type { LoginPage } from '../pages/LoginPage';


export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  pageObj?: RegistrationPage | LoginPage;
  apiRequestContext?: APIRequestContext;
  credentials: { userName: string; password: string } | null = null;
  _registrationMessage?: string;
  _registrationError?: string;

  // API test state
  apiUser?: { userName: string; password: string };
  apiResponse?: import('@playwright/test').APIResponse;
  apiResponseBody?: unknown;
  apiToken?: string;
  apiUserId?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }


  async init(isApi: boolean) {
    if (isApi) {
      this.apiRequestContext = await request.newContext();
    } else {
      this.browser = await chromium.launch({ headless: true });
      this.context = await this.browser.newContext();
      this.page = await this.context.newPage();
    }
  }

  async close(isApi: boolean) {
    if (isApi) {
      await this.apiRequestContext?.dispose();
    } else {
      await this.page?.close();
      await this.context?.close();
      await this.browser?.close();
    }
  }
}


setWorldConstructor(CustomWorld);


// Hooks


Before(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  const isApi = scenario.pickle.tags.some(tag => tag.name === '@api');
  await this.init(isApi);
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  const isApi = scenario.pickle.tags.some(tag => tag.name === '@api');
  await this.close(isApi);
});
