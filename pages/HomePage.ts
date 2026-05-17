import { expect, Page } from '@playwright/test';
import BasePage from './BasePage';

export class HomePage extends BasePage {
  static categoryTile(page: Page, name: string) {
    return page.getByRole('link', { name }).first();
  }

  static async goto(page: Page) {
    await BasePage.open(page, '/');
    await expect(HomePage.searchInput(page)).toBeVisible();
  }

  static async search(page: Page, query: string) {
    const input = HomePage.searchInput(page);
    await input.click();
    // Wait for the help-centre search response so the assertions don't race
    // the network. Falls back to DOM polling if the URL pattern changes.
    const searchResponse = page
      .waitForResponse((r) => r.url().includes('/en/search'), {
        timeout: 15_000,
      })
      .catch(() => undefined);
    await input.fill(query);
    await searchResponse;
  }

  static async openCategory(page: Page, name: string) {
    await HomePage.categoryTile(page, name).click();
  }
}

export default HomePage;
