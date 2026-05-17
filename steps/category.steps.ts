import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import ArticlePage from '../pages/ArticlePage';
import CollectionPage from '../pages/CollectionPage';
import HomePage from '../pages/HomePage';

const { When, Then } = createBdd();

When('I open the {string} category', async ({ page }, name: string) => {
  await HomePage.openCategory(page, name);
});

Then('I see a list of articles in the category', async ({ page }) => {
  await CollectionPage.waitForLoaded(page);
});

When('I open the first article in the category', async ({ page }) => {
  await CollectionPage.openFirstArticle(page);
});

Then('I see the article page with a non-empty title and body', async ({ page }) => {
  await ArticlePage.waitForLoaded(page);
  await expect(ArticlePage.body(page)).toBeVisible();
});

When('I navigate back', async ({ page }) => {
  await page.goBack();
  await page.waitForLoadState('domcontentloaded');
});

Then('I see a way to contact MrQ', async ({ page }) => {
  const contactLink = page.locator('a[href^="mailto:"], a[href*="intercom"], [data-intercom-target]').first();
  await expect(contactLink).toBeVisible();
});
