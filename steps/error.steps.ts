import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import BasePage from '../pages/BasePage';

const { When, Then } = createBdd();

When('I open a non-existent article URL', async ({ page }) => {
  await BasePage.open(page, '/en/articles/000000-does-not-exist');
});

Then('I see a not-found message', async ({ page }) => {
  await expect(page.getByText('Uh oh.')).toBeVisible();
});

Then('the search input is still available', async ({ page }) => {
  await expect(BasePage.searchInput(page)).toBeVisible();
});
