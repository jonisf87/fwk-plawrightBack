import { Page } from '@playwright/test';

export class SortablePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://demoqa.com/sortable');
  }

  async goToGridTab() {
    await this.page.click('a#demo-tab-grid');
  }

  async getGridItems() {
    return this.page.locator('.create-grid .list-group-item');
  }

  async shuffleGridItems() {
    // This is a UI shuffle simulation: drag and drop items randomly
    const items = await this.getGridItems();
    const count = await items.count();
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      if (i !== j) {
        await items.nth(i).dragTo(items.nth(j));
      }
    }
  }

  async getGridOrder() {
    const items = await this.getGridItems();
    const count = await items.count();
    const order: string[] = [];
    for (let i = 0; i < count; i++) {
      order.push(await items.nth(i).innerText());
    }
    return order;
  }
}
