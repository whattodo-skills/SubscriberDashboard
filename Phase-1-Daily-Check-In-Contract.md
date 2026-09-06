# Phase 1 Daily Check-In contract

Status: local implementation only; not published to Wix or GitHub Pages.

## Canonical request

The Emotion/Feeling check-in sends one bridge request:

```json
{
  "type": "dailyCheckInBridgeRequest",
  "requestId": "unique transport request ID",
  "action": "saveCheckin",
  "entry": {
    "submissionId": "stable logical-submission ID",
    "date": "YYYY-MM-DD",
    "emotion": "selected emotion",
    "feeling": "selected feeling"
  }
}
```

`requestId` identifies one transport attempt. `submissionId` identifies the logical check-in and must remain unchanged across retries, concurrent clicks, and a retry after a successful save whose response was lost.

The iframe cannot provide `memberId`. The Wix web method derives it from `currentMember.getMember()` and rejects unauthenticated calls.

## Canonical success response

```json
{
  "checkinId": "CMS record ID",
  "savedRecord": {
    "_id": "CMS record ID",
    "submissionId": "stable logical-submission ID",
    "date": "YYYY-MM-DD",
    "emotion": "selected emotion",
    "feeling": "selected feeling"
  },
  "checkins": [],
  "idempotentReplay": false
}
```

The interface shows success only when both `checkinId` and `savedRecord` are present. The returned `checkins` collection immediately refreshes history.

## Compatibility

The separate Decision Loop continues to use `previewRecommendations`, `startLoop`, `markSkillOpened`, `completeLoop`, `dismissLoop`, and `getReflection`. Phase 1 does not rename or remove those actions.

Legacy `MoodCheckIns` records remain discoverable by authenticated `memberId`, regardless of whether `_owner` matches. No one-check-in-per-day rule is introduced.
History reads follow Wix query pagination until all rows for the authenticated member have been collected.

The older HTTP action named `save` remains on its pre-Phase-1 compatibility path. The active iframe uses only the canonical idempotent `saveCheckin` action.

## Release identity and rollback

The approved release must be committed before deployment. GitHub Pages and the Wix wrapper must both identify that exact commit SHA; a stale query label pointing at a moving `main` asset is not acceptable.

Rollback consists of restoring the previously captured Wix page/backend source and repointing the Wix wrapper to the prior immutable dashboard build. No production schema or record migration is part of this local implementation.
