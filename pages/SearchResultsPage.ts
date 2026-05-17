import { Page } from '@playwright/test';
import assertions from '../fixtures/assertions.json';
import BasePage from './BasePage';

export class SearchResultsPage extends BasePage {
  static results(page: Page) {
    return BasePage.articleLink(page);
  }

  static noResultsMessage(page: Page) {
    return page.getByText(assertions.messages.noResults).first();
  }

  static clearButton(page: Page) {
    return page.locator('[data-testid="search-clear-button"]');
  }
}

export default SearchResultsPage;
