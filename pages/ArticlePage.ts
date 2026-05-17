import { expect, Page } from '@playwright/test';
import BasePage from './BasePage';

export class ArticlePage extends BasePage {
  static heading(page: Page) {
    return page.locator('h1').first();
  }

  static body(page: Page) {
    return page.locator('article, main').first();
  }

  static async waitForLoaded(page: Page) {
    await expect(ArticlePage.heading(page)).toBeVisible();
    const bodyText = await ArticlePage.body(page).innerText();
    expect(bodyText.trim().length).toBeGreaterThan(50);
  }
}

export default ArticlePage;
