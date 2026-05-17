# Goosicorn lobby & Björn-to-be-Wild — bugs

Bug log from the bonus exploratory task (Bjorn to be Wild via `lobby.goosicorn.com` → Staging → Björn). Captured for the interview discussion. URLs use the Staging connector.

Environment used for all reports: `https://bjorn.goosicorn.games/?server=https://connector.stg.goosicorn.dev/game&gameId=bjorn&playerSessionId=<PS-…>&accountType=PRACTICE`.

---

## 1. Closing the Game Rules modal also closes the burger menu

**Preconditions:** game loaded.

**Steps:**
1. Click the burger menu (bottom-left of the game UI).
2. Click "GAME RULES".
3. Click the [x] button on the Game Rules modal.

**Expected:** the Game Rules modal closes and the burger menu remains open (consistent with closing other panels like Pay Table or Rewards).

**Actual:** both the modal and the burger menu close. The user has to re-open the burger menu to pick another option.

**Useful info:** the same bug exists for the Play History modal (see bug #5).

---

## 2. "Opt in for rewards" leaves the Rewards modal blank

**Preconditions:** game loaded, player has not yet opted in to Goosicorn Rewards.

**Steps:**
1. Open the burger menu.
2. Click "REWARDS".
3. Click the "Opt in for rewards" button.

**Expected:** the modal updates to show the opted-in state (e.g. token balance, mystery-prize progress, "Opt out" CTA).

**Actual:** the "Opt in for rewards" button disappears and the modal body is blank — no confirmation, no new content, no error. The user has no way to know whether the opt-in succeeded without leaving and re-entering the modal.

**Useful info:** see also bug #3 for the same blank-modal state reachable via the egg menu.

---

## 3. The egg menu (right side) opens the same broken Rewards modal

**Preconditions:** game loaded, player previously clicked "Opt in for rewards".

**Steps:**
1. Click the small egg / Goosegg icon on the bottom-right of the game UI.

**Expected:** a Rewards summary showing the opted-in state.

**Actual:** the same Rewards modal as the burger-menu route opens, and because the player already opted in (bug #2), the modal body is blank.

**Useful info:** the egg-icon entry and the burger-menu "REWARDS" entry appear to render the same component. The blank-state regression affects both surfaces.

---

## 4. Pay Table carousel shows a scrollbar on pages 1 and 2 even though the content fits

**Preconditions:** game loaded.

**Steps:**
1. Open the burger menu.
2. Click "PAY TABLE".
3. Observe the right edge of the modal on page 1.
4. Click `>` to advance to page 2 and observe again.
5. Continue through pages 3, 4, 5.

**Expected:** no scrollbar where the content fits the modal.

**Actual:** pages 1 and 2 render a vertical scrollbar even though there's no overflow. Pages 3, 4, and 5 correctly omit the scrollbar.

**Useful info:** likely a `overflow: scroll` rather than `overflow: auto` on the panel container, applied conditionally on the wrong pages.

---

## 5. Closing the Play History modal also closes the burger menu

**Preconditions:** game loaded.

**Steps:**
1. Open the burger menu.
2. Click "PLAY HISTORY".
3. Click the [x] button on the Play History modal.

**Expected:** the Play History modal closes and the burger menu stays open (consistent with Rewards and Pay Table).

**Actual:** both close. Same pattern as bug #1.

**Useful info:** root cause is likely shared with #1 — the [x] handler on certain panels propagates a `close` to the menu container.

---

## 6. "LEAVE GAME" silently does nothing

**Preconditions:** game launched directly from `lobby.goosicorn.com` (no `returnUrl` query parameter).

**Steps:**
1. Open the burger menu.
2. Click "LEAVE GAME".

**Expected:** the player is returned to a game-selection / lobby page (e.g. `https://bjorn.goosicorn.games/` or the originating lobby URL).

**Actual:** nothing happens. The menu stays open, the URL is unchanged, there is no confirmation dialog and no console error visible to the player.

**Useful info:** likely a missing fallback when no `returnUrl` is supplied at launch. Even when launched without a return target, the player should land somewhere predictable (a default lobby, a "thanks for playing" screen, or a confirmation dialog) rather than at a dead button.

---

## 7. "Session ended" modal's "Close" button does nothing

**Preconditions:** the same game is open in two browser windows for the same `playerSessionId`. The newer window forces a "session ended" modal in the older window.

**Steps:**
1. Open the game in browser window A.
2. Open the same game (same player id, same env) in browser window B.
3. Return to window A — a modal appears stating the session has ended, with a "Close" button.
4. Click the "Close" button.

**Expected:** the modal closes; the player is returned somewhere actionable (lobby, login, or at least a clearly disabled game state).

**Actual:** the button click does nothing. The modal remains. The player is stuck — no way to dismiss it, no way to leave the page through the in-game UI.

**Useful info:** browser back / closing the tab works, but those are escape hatches, not the documented affordance. Severity is moderate because it traps the player when they accidentally open a second tab.

---

## 8. Clicking the burger menu icon while the menu is open does not close it

**Preconditions:** game loaded.

**Steps:**
1. Click the burger menu icon (the menu opens).
2. Click the burger menu icon again.

**Expected:** the menu closes (toggle behaviour consistent with the [x] button on the menu panel).

**Actual:** nothing happens. The menu stays open. The only way to close it is via the [x] button on the panel header.

**Useful info:** common UX expectation for hamburger icons is toggle-on-click. Without it, the burger icon becomes a one-way action.

---

## 9. Play History list does not show a scrollbar when entries overflow the viewport

**Preconditions:** game loaded, player has more spin history rows than the Play History modal can display at once.

**Steps:**
1. Open the burger menu.
2. Click "PLAY HISTORY".
3. Observe the modal when it contains many rows.

**Expected:** a vertical scrollbar appears so the player can review older spins.

**Actual:** no scrollbar appears. The rows that don't fit are simply cut off. Mouse-wheel scrolling inside the modal does not work either, so older spins are inaccessible.

**Useful info:** the Pay Table modal correctly handles overflow (with the over-eager opposite — see bug #4); the Play History modal seems to skip overflow handling entirely.

---

## 10. Play History spin-details view does not scroll when details overflow

**Preconditions:** at least one spin in Play History; that spin has detail content (symbol breakdown, payline list, etc.) that exceeds the modal height.

**Steps:**
1. Open the burger menu → "PLAY HISTORY".
2. Click on a spin row to open its detail view.

**Expected:** when the details exceed the modal height, a scrollbar appears so the player can read the full breakdown.

**Actual:** no scrollbar appears. Detail content past the modal height is inaccessible.

**Useful info:** same family of overflow-handling regression as bug #9.

---

## Patterns and severity

A few of these cluster into shared root causes worth flagging to the team:

- **#1 + #5** — modal [x] handlers in Game Rules and Play History also dismiss the parent menu. Likely a single fix in the modal-component close logic.
- **#2 + #3** — the Rewards modal's post-opt-in state is broken; both entry points (burger menu and egg icon) render the same broken component.
- **#4 + #9 + #10** — overflow handling across modals is inconsistent: some show scrollbars when not needed, others fail to show them when needed. Worth a CSS/component audit.
- **#6 + #7** — both are "user is stuck with no way forward". For a real-money product these are higher severity than the visual bugs above; for Practice mode they're annoying but recoverable.

The blank-modal state in #2/#3 has the most user impact — a player who's just opted in to a loyalty programme should at minimum see "you're in". Silent success looks like silent failure.
