# Wix Deployment Change Log

## 2026-09-06 Daily Check-In cleanup

- `backend/export function createCheckinPersistence` — accidentally created extensionless Wix backend file. Confirmed unreferenced by Wix IDE workspace search and removed after retaining its exact contents in `wix-backend/check-in-idempotency.js`.
- `backend/ck-in-idempotency.js` — created with an unintended shortened filename, but **not removed** because the published `backend/http-functions.js` currently imports it. Its contents are retained in `wix-backend/check-in-idempotency.js`. It must only be removed after the Wix import is switched to `./check-in-idempotency` and that correctly named replacement is confirmed deployed.

No CMS records, collections, permissions, or other Wix files were deleted during this cleanup.

## 2026-09-06 dashboard history, completion, and responsive wrapper

- Published dashboard shell release `46a94bf` through the Wix wrapper for `#html6`; removed the stale `v=d6961c4` reference.
- The served shell and repository file both have SHA-256 `6940fe6f2335edf14fead3eab2cd398d9f36a64d518aa3b8451f8a3434538aa9`.
- Disabled scrolling on the wrapper's inner dashboard iframe. The containing `#section57` heights are 5,400 px desktop, 6,501 px tablet, and 7,600 px mobile; `#html6` remains stretched to the section.
- Published the `skillComplete` page bridge on `Skills.ndfyp.js` and the authenticated, session-key-idempotent writer in `skillProgress.web.js`.
- Live test completion: CMS record `5f89086a-d367-4d09-b9a6-80aa9746678a`, member `9c52eebe-53c4-4baf-8363-ac6faae0e105`, skill `be-present-single-task-focus`, completed `2026-09-06T14:45:26.836Z`.
- No existing CMS records, permissions, prices, or subscription-access rules were changed.
