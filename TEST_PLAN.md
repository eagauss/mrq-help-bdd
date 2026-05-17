# Test plan

A short note on what this suite tests, what it doesn't, and why.

## Scope

End-to-end smoke tests for the public help centre at `help.mrq.com`. Run against live production — no staging environment exposed to the test runner.

## What's in scope

The "find help" journey for an anonymous visitor:

1. The homepage renders the entry points (search, category tiles, header link back to the main site).
2. Search returns relevant results for common queries and a clean "no results" state for nonsense.
3. Browsing into a category surfaces an article list, and clicking through reaches a renderable article page.
4. A non-existent article URL surfaces a not-found indication rather than crashing or redirecting silently.

These cover the path an anonymous user is most likely to take if they hit the help centre with a problem. If any of these break, the help centre fails its job.

## What's deliberately out of scope

| Area | Why not |
| --- | --- |
| Authenticated flows | The help centre is anonymous-only. Anything behind a login lives on `app.mrq.com` and would need its own suite with credential management and `storageState` |
| Mobile viewports | Help-centre traffic is predominantly desktop search-and-read. Adding a `devices['iPhone 13']` project is a one-liner when there's evidence mobile coverage is worth the CI time |
| Accessibility (`axe-core`) | Not asked for in the brief. A11y testing on a third-party Intercom theme would mostly flag Intercom issues, not MrQ ones — limited signal |
| Cross-browser (Firefox / WebKit) | Help.mrq.com is a hosted Intercom site. Differences across engines would be Intercom theme bugs, not MrQ regressions. Adding browsers triples CI time |
| Visual regression | Content changes weekly (new promos, new articles). The diff would be 99% noise |
| Performance / Core Web Vitals | Out of scope for functional smoke. Would belong in a separate Lighthouse workflow |
| API tests against Intercom's internal endpoints | We don't own them; they can change without notice |
| Multi-language | Only English is exposed on the site today |

## Risk map

Top user-visible risks, ranked, with the scenario(s) that cover each:

| Risk | Impact | Covered by |
| --- | --- | --- |
| Search is broken (no results returned for any query) | Users can't self-serve; support tickets spike | `Search` `@search` scenarios |
| All categories disappear from the homepage | Browsing path collapses | `Homepage › Homepage renders core help-centre elements` |
| A specific category's collection page is broken or empty | A whole sub-section of the help centre becomes unreachable | `Category navigation › Each category lists at least one article` (outline across all 9 categories) |
| Category → article → back navigation broken | Users find the topic, read it, but can't return to browse siblings | `Category navigation › Opening a category, reading an article, and returning to the category list` |
| Users can't find a way to contact support | Regulatory exposure for a gambling product; blocked escalation path | `Category navigation › Getting in touch category exposes a contact path` |
| 404 / dead-link UX (e.g. shared link to a removed article) | Users hit a blank page or a crash | `Help Centre error handling › A non-existent article URL` |
| Header "back to main site" link points somewhere wrong | Users lose their way back to MrQ | `Homepage › Back to MrQ.com link points to the main site` |

## What this isn't

This is **E2E smoke**, not a full regression suite. It covers the journey, not every individual element on every page. If we owned the help centre frontend, the test pyramid would have:

- A lot of unit tests in the frontend repo (we don't have access)
- Integration tests around the Intercom data layer (we don't own that)
- This suite as the top of the pyramid: 19 scenarios, run against the real site

Since we're black-boxing a third-party platform, E2E is the only layer we can test. That's why the suite is broader than a usual E2E smoke pass.

## How to extend it

When adding a scenario, ask:

1. **Is it a journey, or a detail?** Journeys live here. Details (typo in an article body) belong in content review, not E2E.
2. **Will the assertion still pass next week?** If it depends on a specific article being present, no. If it depends on category names, probably yes — those rarely change.
3. **Is the page predictable?** Avoid scenarios that depend on third-party state we don't control (live chat queue, marketing banners, etc.).

If the answer to any is "no", consider whether the test is worth the maintenance load before adding it.
