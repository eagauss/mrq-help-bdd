# Bugs

## 1. "Back to MrQ.com" link goes to app.mrq.com

**Preconditions:** anonymous visitor, default English locale.

**Steps:**
1. Open `https://help.mrq.com`.
2. Inspect the header link labelled "Back to MrQ.com".

**Expected:** the href points at the marketing site, `https://mrq.com`.

**Actual:** the href is `https://app.mrq.com/secure/lobby/casino/home`. An anonymous visitor lands at the authenticated lobby, which presumably bounces them off the login wall.

**Useful info:** the test allows any `*.mrq.com` host so it doesn't fail today.

---

## 2. Clearing the search input does not clear the no-results state

**Preconditions:** anonymous visitor on the help-centre homepage.

**Test data:** any query that returns no matches, e.g. `gibberishnonsense`.

**Steps:**
1. Open `https://help.mrq.com`.
2. Type `gibberishnonsense` into the search input. URL updates to `https://help.mrq.com/en/?q=yeees`.
3. Click the clear button (`[data-testid="search-clear-button"]`).

**Expected:** the search input empties, the URL drops the `?q=` parameter, and the results area returns to the default state (no message, original category tiles visible).

**Actual:** the URL correctly returns to `https://help.mrq.com/en/` and the input is empty, but the message `We couldn't find any articles for:gibberishnonsense` is still rendered. The UI now contradicts the URL — the page implies there is a query when there isn't.

**Useful info:** Refreshing the page resets the state. Looks like the clear-button handler clears the URL and the input value but does not re-render the search results area.
