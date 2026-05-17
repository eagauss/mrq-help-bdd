import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import HomePage from '../pages/HomePage';
import SearchResultsPage from '../pages/SearchResultsPage';

const { When, Then } = createBdd();

When('I search for {string}', async ({ page }, query: string) => {
  await HomePage.search(page, query);
});

Then('I see at least one matching article in the results', async ({ page }) => {
  await expect(SearchResultsPage.results(page).first()).toBeVisible();
  await expect(SearchResultsPage.noResultsMessage(page)).toBeHidden();
});

Then('I see a no-results state', async ({ page }) => {
  await expect(SearchResultsPage.noResultsMessage(page)).toBeVisible();
  await expect(SearchResultsPage.results(page)).toHaveCount(0);
});

When('I clear the search input', async ({ page }) => {
  await SearchResultsPage.clearButton(page).click();
});

Then('I no longer see the no-results message', async ({ page }) => {
  await expect(SearchResultsPage.noResultsMessage(page)).toBeHidden();
});
