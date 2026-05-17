import { Page } from '@playwright/test';
import assertions from '../fixtures/assertions.json';

export class BasePage {
  static nav(page: Page) {
    return page.getByRole('navigation').first();
  }

  static searchInput(page: Page) {
    return page.locator(
      `input[placeholder*="${assertions.placeholders.search}"]`,
    );
  }

  static articleLink(page: Page) {
    return page.locator(
      'a[href*="help.mrq.com"][href*="/articles/"], a[href^="/"][href*="/articles/"]',
    );
  }

  static async open(page: Page, path: string) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}

export default BasePage;
