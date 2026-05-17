import { expect, Page } from '@playwright/test';
import BasePage from './BasePage';

export class CollectionPage extends BasePage {
  static articleLinks(page: Page) {
    return BasePage.articleLink(page);
  }

  static async waitForLoaded(page: Page) {
    await expect(CollectionPage.articleLinks(page).first()).toBeVisible();
  }

  static async openFirstArticle(page: Page) {
    await CollectionPage.articleLinks(page).first().click();
  }
}

export default CollectionPage;
