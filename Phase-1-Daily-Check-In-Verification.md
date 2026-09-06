# Phase 1 Daily Check-In verification

Status: implemented and tested locally only. No Wix code, CMS schema, collection permissions, records, Git branch, or published site has been changed.

## Production baseline captured before implementation

- Site: What To Do! (`56e5218e-c828-4e3b-ad4c-e0a2b10ce22f`)
- Published wrapper: `https://www-whattodo-coach.filesusr.com/html/f22dd2_d042b6cf50609766cb76b3418a0ffebe.html`
- Wrapper source URL: `https://whattodo-skills.github.io/SubscriberDashboard/subscriber-dashboard-shell.html?v=d6961c4`
- Downloaded shell content matched repository commit `d076e5545947619068a0be45278c783291dd8225`, despite the stale `v=d6961c4` query label.
- Downloaded shell SHA-256: `668cc88c4dd741f8617987215e900e518901bf602996a3e451d37e77ede90494`
- `MoodCheckIns`: 17 rows across 3 member IDs. All 17 had `memberId`; 8 had matching `_owner`, 7 had a different `_owner`, and 2 had no `_owner`.
- The audited signed-in member had 4 legacy `MoodCheckIns` rows. The active interface displayed 3 because its Recent Check-Ins list was incorrectly restricted to the 14-day mood-analysis window.

These counts are a read-only audit snapshot, not a rollback export. Immediately before any approved production deployment, export the complete `MoodCheckIns` collection with system fields and capture the Wix page/backend source and collection permission settings again.

## Reproduced failure and root cause

The active Emotion/Feeling iframe emitted `saveCheckin`, but both the Wix page bridge and `daily-check-in.web.js` action allowlists omitted it. The request was discarded before reaching the persistence function, producing the interface's save failure. The separate Decision Loop used `startLoop`; it was not the correct persistence action for this simpler check-in.

History had a separate presentation defect: only check-ins inside the current 14-day mood window were rendered. This made valid older member history disappear and conflated "not enough recent entries to calculate a mood" with "no history."

## Implemented local repair

- Added `saveCheckin` end to end through iframe, dashboard shell's existing bridge route, Wix page bridge, web method, service, and backend persistence.
- Kept every Decision Loop action and pending-loop behavior intact.
- Derives `memberId` only from `currentMember.getMember()` in a `Permissions.SiteMember` web method. The iframe request schema rejects unknown fields, including a supplied `memberId`.
- Uses a stable logical `submissionId` as the new CMS item `_id`. Wix item-ID uniqueness is the concurrency boundary: retries return the same owned row; a different payload for the same key is rejected; a different member cannot claim or overwrite the key.
- Returns `checkinId`, normalized `savedRecord`, refreshed complete history, and `idempotentReplay`.
- Shows success only after receiving a complete backend receipt. Save and history failures remain error states.
- Keeps the seven-entry threshold solely for the 14-day mood calculation while rendering up to 10 rows from complete member history.
- Follows Wix query pagination for member history instead of silently stopping at 1,000 rows.
- Preserves the older HTTP `save` action on its prior compatibility path; the active iframe uses `saveCheckin`.
- Does not modify or migrate legacy records, and does not depend on `_owner` matching `memberId`.

## Isolated verification results

Automated local tests: 14 passed, 0 failed.

- First save returns the record ID, normalized saved record, and refreshed history: PASS
- Retry after the response is lost returns the same row: PASS
- Two concurrent requests create one row: PASS
- Same key with different contents is rejected: PASS
- Another member cannot retrieve or overwrite the row by reusing its key: PASS
- Browser-supplied `memberId` is absent from the request contract and rejected as an unknown field: PASS
- Unauthenticated access is gated by `Permissions.SiteMember` and the explicit current-member check: PASS (static contract; live staging verification pending)
- Failed or incomplete backend receipt cannot display success: PASS
- History errors differ from genuine empty history: PASS
- History pagination is present and the 30-row truncation was removed: PASS
- Decision Loop regression suite and canonical recommendation routes: PASS
- Existing bridge origin/source/request-correlation security suite: PASS
- Existing Skills Stack confirmed-save regression suite: PASS
- Whitespace and credential-pattern scans: PASS

No production CMS row was created because production writes were explicitly out of scope. A true Wix persistence proof—returned production/staging row ID, CMS row inspection, new-session reload, and second-member direct-request denial—must be run after an approved deployment to a Wix test environment or the approved production release.

## Paid-plan decision

The current Daily Check-In contract is signed-in-member-only, not paid-plan-only. No existing paid-plan check was found on this route, so Phase 1 does not silently add one. If Daily Check-In should require an active paid plan, that is a separate product/access decision and must be added and tested before release.

## Separate containment plan (not implemented)

### WTD-FavoriteSkills

Current risk: collection permissions allow all site members to create, read, update, and delete. The dashboard code already routes reads/writes through the authenticated backend and filters by `memberId`, but changing permissions could affect other site clients.

Plan: inventory every Wix dataset, page, automation, hook, and external client first; move any direct client access behind authenticated backend methods; verify member isolation; export the collection; then change permissions to backend/admin-only in a separately approved release. Do not rewrite `_owner` merely to make permissions work.

### SkillSessions

Current risk: read access is public. No caller was found in this repository, so its actual site-wide clients must be inventoried in Wix before containment.

Plan: classify public versus member-specific fields, route private reads through an authenticated backend, test existing Skills Hub/session clients, export records, and only then tighten permissions in a separate release.

### SubscriberGoalCards

Current risk: site-member read access can expose records unless every client query and permission model enforces ownership. No caller was found in this repository.

Plan: inventory Wix datasets and external clients, establish the authoritative owner field for every legacy row, add backend member-scoped access, verify cross-member denial, export records, and tighten permissions separately. Any ambiguous legacy association must be quarantined for review rather than guessed.

## Deployment and rollback gate

Before deployment approval:

1. Export `MoodCheckIns` with system fields and record its row count/checksum.
2. Capture the current Wix page code, backend modules, collection schema, hooks, indexes, and permissions.
3. Commit the reviewed files and record the exact SHA.
4. Deploy the HTML assets immutably and update Wix code to the same reviewed release.
5. Verify with test Member A: save receipt ID, exact CMS row, reload, sign-out/sign-in, and legacy history.
6. Verify with Member B and unauthenticated requests that Member A's row cannot be read or modified.
7. Verify retry, concurrent click, and simulated lost-response behavior against Wix.
8. Re-run Decision Loop, desktop, and mobile checks on the published URL.

Rollback: restore the captured Wix page/backend source and prior immutable HTML asset. This Phase 1 repair requires no schema migration, so rollback must not delete or rewrite check-in records created after release.
