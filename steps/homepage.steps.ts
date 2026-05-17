import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import BasePage from '../pages/BasePage';
import HomePage from '../pages/HomePage';
import routes from '../fixtures/routes.json';
import testData from '../fixtures/testData.json';

const { Given, Then } = createBdd();

Given('I am on the MrQ Help Centre home page', async ({ page }) => {
  await HomePage.goto(page);
});

Then('I see the article search input', async ({ page }) => {
  const input = HomePage.searchInput(page);
  await expect(input).toBeVisible();
  await expect(input).toBeEditable();
});

Then('I see the {string} link in the header', async ({ page }, name: string) => {
  await expect(BasePage.nav(page).getByRole('link', { name })).toBeVisible();
});

Then('I see all expected help categories', async ({ page }) => {
  for (const name of testData.categories) {
    await expect(HomePage.categoryTile(page, name)).toBeVisible();
  }
});

Then('the {string} link points to the main MrQ site', async ({ page }, name: string) => {
  const href = await BasePage.nav(page)
    .getByRole('link', { name })
    .getAttribute('href');
  expect(href, 'link must have an href').not.toBeNull();
  expect(href).toContain(routes.external.mainSiteHostSubstring);
});
