[![Tests](https://github.com/eagauss/mrq-help-bdd/actions/workflows/tests.yml/badge.svg)](https://github.com/eagauss/mrq-help-bdd/actions/workflows/tests.yml)
[![Playwright](https://img.shields.io/badge/playwright-1.59-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev)
[![Node](https://img.shields.io/badge/node-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)

# MrQ Help Centre BDD tests

Gherkin scenarios for help.mrq.com, executed with Playwright + playwright-bdd in TypeScript. A GitHub Actions runner fires nightly and on demand.

## What's tested

19 scenarios across 4 features, run against live `help.mrq.com`:

- **Homepage**: the search input, the "Back to MrQ.com" header link, and all 9 category tiles are visible, and the back link actually goes to an `mrq.com` host.
- **Search**: `deposit`, `withdraw`, `verification` each return at least one article; a gibberish query shows the "We couldn't find any articles" state.
- **Category navigation**: each of the 9 categories surfaces at least one article (outline); the Deposits & Withdrawals → first article → back-navigation round trip lands the user on the category list with content intact; the Getting in touch category exposes a contact path (mailto or chat anchor).
- **Error handling**: a non-existent article URL shows the "Uh oh. That page doesn't exist" state with the search input still available, so the user can recover.

The selection covers the "find help" journey end to end without depending on copy that the content team will change next week. See [`TEST_PLAN.md`](TEST_PLAN.md) for the reasoning and what was deliberately left out.

## Run locally

Node 20+ and npm.

```bash
npm ci
npx playwright install chromium
npm test
```

Other useful commands:

```bash
npm run test:headed                                 # watch the browser
npm run test:report                                 # open the last HTML report
npx bddgen && npx playwright test --grep @smoke     # run a tag subset
```

`npm test` runs `bddgen` first, which turns the `.feature` files into Playwright tests under `.features-gen/` (gitignored), and then runs the standard Playwright runner.

## Run in CI

The workflow runs nightly at 06:00 UTC and can also be triggered manually from **Actions → Tests → Run workflow**. Optional input: `grep` (e.g. `@smoke`).

When it's done, the `playwright-report` artifact has the HTML report (steps, screenshots, traces). On failure there's also a `test-results` artifact with raw videos and trace zips.

## Layout

```
features/                  Gherkin specs
steps/                     step implementations (one createBdd() call per file)
pages/                     static page-object classes; BasePage owns the shared chrome (nav, search input)
fixtures/                  JSON test data (categories, expected strings, host substring)
playwright.config.ts
.github/workflows/tests.yml
TEST_PLAN.md               scope, risk map, and what was left out
BUGS.md                    bugs found on help.mrq.com while writing the tests
```

## A few choices worth flagging

- **Chromium only.** A help-centre smoke suite doesn't need a cross-browser matrix. Adding Firefox or WebKit is a one-line `projects` change in `playwright.config.ts`.
- **No `data-cy` hooks.** help.mrq.com is a hosted Intercom site, not a MrQ frontend, so the locators are ARIA roles, placeholders, visible text, and href substrings. If MrQ ships their own help centre one day, the page objects are the only files that need to learn the new selectors.
- **Cookie banner is ignored.** Its DOM contains hidden third-party `/articles/` links that polluted the search-results selector at first (see BUGS.md #2). The fix is to scope every article-link locator to `help.mrq.com` hrefs only.
- **One retry in CI, zero locally.** Soaks up transient network flake on shared runners; failures during development surface immediately.
