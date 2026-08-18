# Decision Loop Phase 1 — Approval Package

Status: **PROPOSAL ONLY — no code, CMS, endpoint, commit, push, or publish changes made.**

Approval: **Inventory/routing approved. Schema/endpoint approved for local implementation.** Live Wix changes, commits, pushes, publishing, and real-member tests remain prohibited until separately approved.

Required implementation rules added at approval:

- Preserve one Daily Check-In per member per calendar date. If today's record exists, update it instead of inserting another.
- `I don't need a skill right now` saves today's check-in as `complete` without a selected skill or pending Learn stage.

Canonical sources inspected on 2026-08-17:

- Live Wix `Skills` collection (41 active/published records)
- Live Wix `MoodCheckIns`, `SkillRecommendations`, and `DashboardRecommendations` schemas
- Live `POST /_functions/dailyCheckIn` list response
- Current local dashboard and Daily Check-In source

## 1. Canonical active skill inventory

The stable ID below is the Wix `Skills` record ID. Practice paths are the live Skills Hub paths. The collection currently has no populated `practiceUrl` or `shortBenefit` values on these records, so the canonical page link and `description` are used respectively.

| Stable ID | Slug | Canonical title | Category | Practice path | Short benefit |
|---|---|---|---|---|---|
| 662740aa-3cb3-4470-a5a5-fadad9baea5e | be-present-single-task-focus | Be Present: Single Task Focus | Focus | /skills-hub/be-present-single-task-focus | Interrupt mental spirals and return attention to one manageable activity. |
| ab3a87ad-140c-449a-b79a-7f1c421e5a12 | set-clear-intentions-for-your-focus | Set Clear Intentions For Your Focus | Focus | /skills-hub/set-clear-intentions-for-your-focus | Turn avoidance or uncertainty into a clear starting cue and tiny first step. |
| d59a24fa-ee8a-445c-b570-804d54d573a8 | stay-consistent-with-your-focus | Stay Consistent With Your Focus | Focus | /skills-hub/stay-consistent-with-your-focus | Return to a useful habit or goal when motivation or progress slips. |
| fe4493ea-a69b-4821-b39d-da7d88aee57c | single-task-focus-practice | Managing Distractions: Single Task Focus | Focus | /skills-hub/single-task-focus-practice | Reduce distraction to one visible action and practice returning when attention drifts. |
| c991b7f7-90f2-4e68-9921-63027bd999ab | stone-focus-practice | Direct Your Attention with Stone Focus Practice | Focus | /skills-hub/stone-focus-practice | Choose where to place attention and deliberately return after distraction. |
| 32f9b822-9a9e-4274-a02e-1bbb8146c210 | the-values-compass | Choose What Matters: The Values Compass | Focus | /skills-hub/the-values-compass | Use values to decide where attention belongs when competing demands pull at it. |
| bb6c165e-c3c8-4fe9-b404-d1b2e93202a1 | pause-before-acting.html | Pause Before Acting | Focus | /skills-hub/pause-before-acting.html | Create space between an impulse and a response so you can choose effectively. |
| 87f78968-ef19-4343-a744-9ff57e15b85d | deep-breathing-practice | Deep Breathing Practice | Focus | /skills-hub/deep-breathing-practice | Steady the body and regain attention when stress produces strong physical sensations. |
| 6ca17d5b-b054-47fc-8b52-3d1f8988c6ce | notice-your-inner-world | Notice Your Inner World | Focus | /skills-hub/notice-your-inner-world | Separate observable facts and inner signals from stories, blame, or judgment. |
| 639ad66e-4f21-43a0-a9a2-00e754656cb5 | calm-down | Calm Your Body Down | Coping | /skills-hub/calm-down | Choose and test a safe calming tool when the body or thoughts feel activated. |
| 5068e864-e4df-473e-a159-ae385872ce26 | tolerate-a-hard-moment | Tolerate A Hard Moment | Coping | /skills-hub/tolerate-a-hard-moment | Get through a hard moment without making the next moment harder. |
| 12e7a522-325e-4ff6-a97a-49ddcfc69d47 | ride-the-wave | Ride the Wave | Coping | /skills-hub/ride-the-wave | Observe a strong urge without automatically acting on it. |
| e3b58240-ca1d-4d74-b74e-46bd16ed80fc | accept-what-is | Accept What Is | Coping | /skills-hub/accept-what-is | Acknowledge present facts, sort control, and choose one steady next step. |
| f22935bb-27bb-429f-8ac0-ad58509def06 | adapting-to-change | Adapting To Change | Coping | /skills-hub/adapting-to-change | Separate facts from meanings and choose a workable step after change. |
| 25056cda-c78e-4b84-a831-ed9d159b5307 | cope-ahead | Cope Ahead | Coping | /skills-hub/cope-ahead | Prepare and rehearse a first move and backup before a foreseeable difficulty. |
| f3bfdcf6-187b-434e-b8b3-9eb79afbada4 | recover-from-setbacks | Recover From Setbacks | Coping | /skills-hub/recover-from-setbacks | Learn from a setback and restart without turning against yourself. |
| eaf1b079-2c29-46be-9dfe-3dcaab6c3287 | solve-what-you-can | Solve What You Can | Coping | /skills-hub/solve-what-you-can | Define a practical problem, focus on what can change, and begin one action. |
| 5dd00528-dd37-4b9a-92cb-a0a55ce53e66 | ask-for-support | Ask for Support | Coping | /skills-hub/ask-for-support | Choose the kind of help needed and make one clear, appropriate request. |
| 631d5ba5-19d4-43ed-a938-863e33b7010c | stop-skill | The STOP Skill | Coping | /skills-hub/the-stop-skill | Interrupt an automatic reaction so you can protect what matters. |
| 006e5d99-01f0-48b0-93f7-ae2761673c22 | name-the-emotion | Name The Emotion | Feelings | /skills-hub/name-the-emotion | Identify a precise emotion, its intensity and body clues, then choose a helpful action. |
| aeecb53f-9f00-4663-a6ec-642f64848c9c | the-feelings-wheel | The Feelings Wheel | Feelings | /skills-hub/the-feelings-wheel | Identify and explore emotions in greater depth. |
| a6ca2a6f-9918-4030-b1d3-58cf39da82d7 | understand-the-trigger | Understand the Trigger | Feelings | /skills-hub/understand-the-trigger | Trace what activated an emotion and what made it more intense. |
| 272be988-5d3b-449b-802f-955266adaed6 | check-the-story | Check The Story | Feelings | /skills-hub/check-the-story | Separate facts from added meaning and consider realistic alternatives. |
| 9d9261a5-946a-44a0-b22b-b8cd7e9e70d5 | thought-mood-connection | The Thought-Mood Connection | Feelings | /skills-hub/the-thought-mood-connection | See how thoughts and feelings influence one another in real time. |
| c5581183-bc0a-48a8-97f2-09445677948f | thought-labeling | Thought Labeling | Feelings | /skills-hub/thought-labeling | Step back from an unhelpful thought by naming it instead of obeying it. |
| 0abdb9f4-7fee-46c0-af60-efee88c088ae | inner-critic | Inner Critic | Feelings | /skills-hub/inner-critic | Separate self-judgment from facts and choose a fairer next thought. |
| 433d8c47-b1ab-4f48-accc-026fa3832528 | opposite-action-decision-lab | Opposite Action Decision Lab | Feelings | /skills-hub/opposite-action-decision-lab | Check facts and safety, then build an action that opposes an ineffective urge. |
| 632de9ce-9036-4c12-8570-76644001a2d0 | choose-an-effective-response | Choose an Effective Response | Feelings | /skills-hub/choose-an-effective-response | Compare realistic responses and choose one that supports goals, values, and relationships. |
| fe4ab622-2342-45dd-83eb-c2c04cc2414b | think-it-through | Think It Through | Feelings | /skills-hub/think-it-through | Weigh facts, risks, and priorities before an emotionally influenced decision. |
| 869f1c78-1d5d-4a93-a0b9-1b9f0a5b23fc | define-the-real-problem | Define the Real Problem | Feelings | /skills-hub/define-the-real-problem | Separate facts, assumptions, emotions, and outside stress to identify what needs attention. |
| b20b79d1-0bb2-48b3-97c1-c148d509cfc8 | active-listening | Active Listening | Connecting | /skills-hub/active-listening | Hear what someone is saying before deciding how to answer. |
| c9fc833f-d210-46ca-9a28-a770b4c0fe63 | listen-to-understand | Listen to Understand | Connecting | /skills-hub/listen-to-understand | Clarify and reflect another person's meaning before responding. |
| e6f5c095-7973-4939-972a-1054699fdf39 | ask-for-what-you-need | Ask for What You Need | Connecting | /skills-hub/ask-for-what-you-need | Build and rehearse one clear request and prepare for a realistic response. |
| 8fe79ad9-34f6-4b38-92bd-22431c0e44af | set-healthy-boundaries | Set Healthy Boundaries | Connecting | /skills-hub/set-healthy-boundaries | Prepare and rehearse a clear limit you can realistically carry out. |
| f9fb0245-e6d8-4d90-9215-117b214acb21 | saying-no | Saying No | Connecting | /skills-hub/saying-no | Say no clearly and kindly without over-explaining or people-pleasing. |
| 7ba29d80-5db5-4f4b-9f0e-40d717ce6ca3 | navigate-conflict | Navigate Conflict | Connecting | /skills-hub/navigate-conflict | Slow down a disagreement and prepare a clear, usable response. |
| 0b0f1d31-c147-47e5-b9b9-c86fef92c3e6 | connecting-after-conflict | Connecting After Conflict | Connecting | /skills-hub/connecting-after-conflict | Reconnect after a hard moment without rehashing, defending, or pretending. |
| c02412fb-3452-4510-a2ee-354d5fa1cd59 | build-trust | Build Trust | Connecting | /skills-hub/build-trust | Create and rehearse a realistic commitment or repair plan. |
| 32e21088-6c74-442f-95ed-ff3ba2ea4863 | show-appreciation | Show Appreciation | Connecting | /skills-hub/show-appreciation | Build a genuine appreciation message around a specific action or effort. |
| e15b2121-bdff-40ad-9d67-5bd685287d05 | show-empathy | Show Empathy | Connecting | /skills-hub/show-empathy | Move from judgment to curiosity while keeping appropriate boundaries. |
| 5e1c3af6-c720-4310-96ac-f22c15dac92f | express-yourself-clearly | Express Yourself Clearly | Connecting | /skills-hub/express-yourself-clearly | Rehearse a clear message, reaction, request, refusal, or expectation. |

## 2. Proposed outcome-to-skill routing table

Order is primary first, then alternatives. Every recommendation remains inside the member-selected category.

| Category | Approved outcome | Primary recommendation and rationale | Alternatives and rationales |
|---|---|---|---|
| Focus | Be present | **Be Present: Single Task Focus** — practices noticing attention drift and returning to one manageable present activity. | **Direct Your Attention with Stone Focus Practice** — supplies a concrete anchor for deliberate return; **Managing Distractions: Single Task Focus** — practices noticing distraction and returning attention to one visible action. |
| Focus | Start something | **Set Clear Intentions For Your Focus** — converts avoidance or uncertainty into a cue and tiny first action. | **Choose What Matters: The Values Compass** — clarifies why beginning matters; **Managing Distractions: Single Task Focus** — reduces the start to one visible physical action. |
| Focus | Stay with something | **Stay Consistent With Your Focus** — explicitly practices returning when motivation, progress, or consistency slips. | **Managing Distractions: Single Task Focus** — trains return after distraction; **Be Present: Single Task Focus** — treats each return as the practice rather than as failure. |
| Focus | Organize my attention | **Managing Distractions: Single Task Focus** — narrows competing pulls to one visible action. | **Direct Your Attention with Stone Focus Practice** — practices choosing an anchor; **Choose What Matters: The Values Compass** — prioritizes attention according to what matters. |
| Focus | Make a decision | **Choose What Matters: The Values Compass** — uses values to decide where attention and effort belong. | **Notice Your Inner World** — separates facts and inner signals from judgment; **Pause Before Acting** — creates enough space to choose rather than react. |
| Focus | Follow through | **Stay Consistent With Your Focus** — builds a realistic return plan across full, reduced, and minimum effort. | **Set Clear Intentions For Your Focus** — defines the cue and next step; **Managing Distractions: Single Task Focus** — supports deliberate return when attention leaves the task. |
| Coping | Get steadier | **Calm Your Body Down** — helps choose and test a safe tool when activation is high. | **The STOP Skill** — interrupts automatic reaction; **Tolerate A Hard Moment** — supports staying present without making the moment harder. |
| Coping | Tolerate something I cannot change | **Accept What Is** — directly distinguishes acknowledging facts from approving of them. | **Tolerate A Hard Moment** — supports enduring the present without worsening it; **Ride the Wave** — helps observe urges without obeying them. |
| Coping | Adapt to change | **Adapting To Change** — separates what changed from the meaning added to it and identifies a workable next step. | **Accept What Is** — anchors in present facts; **Solve What You Can** — directs effort toward the changeable part. |
| Coping | Prepare for something difficult | **Cope Ahead** — rehearses a first move, backup, and realistic complication before a foreseeable challenge. | **Ask for Support** — plans appropriate help before the difficult moment; **The STOP Skill** — supplies an immediate pause plan if emotion takes over. |
| Coping | Recover from a setback | **Recover From Setbacks** — explicitly supports learning, restarting, and avoiding self-attack after a setback. | **Accept What Is** — separates the event from resistance and exaggeration; **Solve What You Can** — identifies one practical restart action. |
| Coping | Solve what I can | **Solve What You Can** — defines the problem, sorts control, compares options, and starts one observable action. | **Accept What Is** — separates controllable facts from what must be accepted; **Ask for Support** — identifies where another person or resource can help. |
| Coping | Ask for support | **Ask for Support** — identifies the needed support type, appropriate source, and clear request. | **Cope Ahead** — rehearses making the request and handling possible responses; **Solve What You Can** — clarifies which part needs outside help. |
| Feelings | Name what I'm feeling | **Name The Emotion** — directly practices precise emotion naming, intensity, and body clues. | **The Feelings Wheel** — broadens emotion vocabulary and specificity; **The Thought-Mood Connection** — helps distinguish the feeling from the thought associated with it. |
| Feelings | Understand what triggered it | **Understand the Trigger** — traces the event, interpretation, vulnerability factors, and emotional chain. | **Check The Story** — examines whether added meaning intensified the response; **Define the Real Problem** — separates the trigger from outside stress and emotional spillover. |
| Feelings | Check my interpretation | **Check The Story** — directly separates observable facts from the story and tests alternatives. | **The Thought-Mood Connection** — reveals how an interpretation affects emotion; **Thought Labeling** — creates distance from a thought before treating it as fact. |
| Feelings | Reduce emotional reactivity | **Opposite Action Decision Lab** — checks facts, safety, and urge effectiveness before rehearsing a different action. | **Choose an Effective Response** — pauses the urge and compares responses; **Thought Labeling** — reduces the power of thoughts that amplify reactivity. |
| Feelings | Respond differently | **Choose an Effective Response** — identifies what matters and selects one response that supports it. | **Opposite Action Decision Lab** — builds a whole-body alternative to an ineffective urge; **Think It Through** — compares risks, priorities, and proportionate next steps. |
| Feelings | Express the feeling constructively | **Choose an Effective Response** — selects a response that supports goals, relationships, values, and self-respect. | **Name The Emotion** — clarifies what is actually being expressed; **Define the Real Problem** — identifies whether the constructive action is expression, problem-solving, coping, or connection. |
| Connecting | Listen and understand | **Listen to Understand** — practices clarification, accurate reflection, and checking understanding before responding. | **Active Listening** — keeps attention on the speaker rather than planning a reply; **Show Empathy** — adds curiosity and perspective-taking without requiring agreement. |
| Connecting | Ask for what I need | **Ask for What You Need** — directly builds, checks, and rehearses one clear request. | **Express Yourself Clearly** — strengthens the observable facts, reaction, and request; **Set Healthy Boundaries** — fits when the need includes a limit. |
| Connecting | Set a boundary | **Set Healthy Boundaries** — builds and rehearses a clear limit and realistic follow-through. | **Saying No** — fits a boundary whose clearest form is refusal; **Express Yourself Clearly** — helps state the limit without blame or ambiguity. |
| Connecting | Navigate conflict | **Navigate Conflict** — slows one disagreement, checks interpretation, and rehearses a clear response. | **Listen to Understand** — reduces conflict driven by misunderstanding; **Express Yourself Clearly** — supports a direct, specific response. |
| Connecting | Repair after conflict | **Connecting After Conflict** — directly practices returning after a hard moment with a concise repair. | **Build Trust** — creates a repeatable commitment or repair plan; **Show Empathy** — helps acknowledge the other person's perspective while retaining boundaries. |
| Connecting | Strengthen a relationship | **Build Trust** — turns relationship strengthening into one repeatable behavior or repair commitment. | **Show Appreciation** — reinforces specific valued behavior; **Show Empathy** — strengthens connection through curiosity and accurate perspective-taking. |
| Connecting | Offer support | **Show Empathy** — prepares a supportive response grounded in curiosity rather than assumption. | **Listen to Understand** — helps identify what kind of support the other person actually wants; **Show Appreciation** — supports offering specific, genuine encouragement when appreciation is the fitting form of support. |
| Connecting | Receive support | **Ask for What You Need** — supports receiving help by identifying the need and making one clear request. | **Express Yourself Clearly** — helps communicate the situation and requested support without ambiguity; **Set Healthy Boundaries** — helps define what kind of help is and is not workable. |

## 3. Smallest backward-compatible Wix schema/API proposal

### What exists now

- `MoodCheckIns` is the member-owned history collection. It currently contains `memberId`, `date`, `emotion`, `feeling`, and `mood` plus system fields.
- The collection permissions are member insert and author-only read/update/remove.
- The endpoint accepts `POST /_functions/dailyCheckIn` with `action: "list"` or `action: "save"`.
- The current save normalizes `date`, `emotion`, and `feeling`, then updates or inserts one member record for the same calendar date.
- The live list response is `{ok, loggedIn, firstName, checkins, values, stacks}`.
- `SkillRecommendations` is public/reference routing data and `DashboardRecommendations` is member-owned, but neither can by itself preserve the entire resumable Decision Loop. Adding another collection would create avoidable synchronization and duplicate-save risk.

### Proposed collection change

Extend `MoodCheckIns`; do not replace it and do not migrate legacy records. Keep the existing fields unchanged and add optional fields only:

| Field key | Wix type | Purpose |
|---|---|---|
| loopVersion | TEXT | `decision-loop-v1`; absent means legacy record. |
| loopStatus | TEXT | `recommended`, `learn_pending`, or `complete`. |
| noticeSelection | TEXT | Stage 1 answer. |
| intensityBefore | NUMBER | Optional 1–10 value. |
| understandInfluence | TEXT | First Understand answer. |
| understandPriority | TEXT | Second Understand answer. |
| selectedCategory | TEXT | Focus, Coping, Feelings, or Connecting. |
| selectedOutcome | TEXT | Approved outcome text. |
| recommendedSkillIds | ARRAY_STRING | Ordered approved IDs shown to the member, primary first. |
| selectedSkillId | TEXT | Stable canonical Wix Skills record ID. |
| selectedSkillTitleSnapshot | TEXT | Historical display snapshot. |
| selectedSkillPracticeUrlSnapshot | URL | Historical destination snapshot. |
| recommendationRationaleSnapshot | TEXT | Historical rationale snapshot. |
| practiceAction | TEXT | Selected practice action. |
| learnResult | TEXT | Optional Stage 5 result. |
| intensityAfter | NUMBER | Optional 1–10 follow-up. |
| carryForward | TEXT | Optional carry-forward choice. |
| privateReflection | TEXT | Written only after explicit consent. |
| reflectionSaved | BOOLEAN | Explicit proof of consent to save reflection. |
| completedDate | DATETIME | Set only when the loop becomes complete. |

Use Wix system `_id`, `_createdDate`, and `_updatedDate`; do not duplicate them with custom record/date fields. Continue using Text `memberId` as the ownership/query field.

### Proposed endpoint contract

Keep the same URL and response envelope. Add actions without removing the legacy ones:

1. `list` — unchanged, but include a normalized `pendingLoop` when a non-complete Decision Loop exists. Legacy check-ins remain readable. The standard response and `pendingLoop` must never contain `privateReflection`.
2. `save` — legacy behavior unchanged for the current check-in until the new UI replaces it.
3. `startLoop` — first checks for an existing incomplete loop for the authenticated member. If one exists, it returns that record rather than creating another. Otherwise it validates the selected outcome and stable skill ID against the approved routing table and live canonical Skills record, creates exactly one logical record with status `recommended`, and returns its `checkinId` and canonical recommendation payload.
4. `markSkillOpened` — updates that same `checkinId` from `recommended` to `learn_pending` after the member opens the selected skill; never inserts.
5. `completeLoop` — updates that same `checkinId` with Learn fields and status `complete`; never inserts.
6. `dismissLoop` — updates the same record to `complete` only when the member explicitly declines the Learn stage.

Status transitions are intentionally limited to:

- `recommended` — the initial check-in and selected recommendation saved successfully.
- `learn_pending` — the member opened the selected skill.
- `complete` — the member submitted Learn or explicitly dismissed it.

There is no `practicing` status because opening the skill is the only durable transition needed before Learn becomes pending.

### One-active-loop rule

- An authenticated member may have only one Decision Loop whose status is not `complete`.
- Before any insert, `startLoop` queries by `memberId` for an incomplete Decision Loop.
- If one exists, the endpoint returns it as the active loop and performs no insert.
- The member must finish or explicitly dismiss that loop before starting another.
- The `submissionId` idempotency check remains an additional retry safeguard; it does not replace the one-active-loop check.

### Private reflection isolation

- `privateReflection` is written only after the member deliberately selects the explicit Save My Reflection control.
- It is excluded from the standard `list` response, `pendingLoop`, all dashboard messages, analytics data, and recommendation payloads.
- It may be returned only through a deliberate authenticated member-only reflection request for the owning member and specific `checkinId`.
- That request queries by both `_id` and `memberId`; it never exposes another member's reflection.

All update actions must query by both `_id` and `memberId`. The authenticated current member remains authoritative. `subscriberId`, `memberId`, or `clientId` fallback behavior may remain for existing non-production/local behavior, but it must never authorize access to another authenticated member's record.

### Duplicate-save protection

- Generate a client-side `submissionId` once when the initial save begins and add optional `submissionId` TEXT to the record.
- Disable the submit control while saving.
- `startLoop` first enforces the one-active-loop rule, then checks the authenticated member plus `submissionId`; either condition returns the existing logical record instead of inserting another.
- Every later action requires the returned `checkinId` and updates that record.
- The iframe remains the only save caller; the dashboard receives completion/recommendation messages but does not relay a second save.

### Canonical recommendation payload

The endpoint resolves `selectedSkillId` from `Skills` and returns:

```json
{
  "id": "<Skills record ID>",
  "title": "<Skills.name>",
  "category": "<Skills.category>",
  "practiceUrl": "<Skills practiceUrl or canonical page link>",
  "shortBenefit": "<Skills.shortBenefit or description>",
  "reason": "<approved outcome rationale>"
}
```

The snapshots stored on `MoodCheckIns` preserve history; the active dashboard handoff uses current canonical data. Missing/deactivated skills return an explicit unavailable state and never silently substitute an unrelated skill.

## Approval gates

Please approve or revise these separately:

1. **Canonical inventory and routing table**
2. **Backward-compatible `MoodCheckIns` and `dailyCheckIn` proposal**

Implementation must not begin until both are approved.
