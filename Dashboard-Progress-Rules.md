# Dashboard Progress Rules

This documents the rules already implemented by `subscriber-dashboard-shell.html`; it does not introduce or approve new scoring rules.

## Skills Points

- Daily Check-In: 10 points per saved check-in record.
- Recent skill activity: 15 points per activity in the last 30 days, capped at 20 activities.
- Skills Stack: 20 points per returned stack record.
- Saved values: 10 points per saved value.
- Current check-in streak of at least 3 days: 20 points.
- Current check-in streak of at least 7 days: an additional 35 points.
- Activity across at least 3 skill categories: 25 points.

The streak counts distinct calendar dates backwards from today. Multiple legitimate check-ins on one day earn record points but count as one streak day.

## Badges

- First Check-In: at least 1 check-in.
- Pattern Spotter: at least 7 check-ins.
- 30-Day Tracker: at least 30 check-ins.
- Feelings Explorer: at least 5 distinct emotion labels.
- Begin Again: a check-in or skill activity in the last 7 days.
- Stack Builder: at least 1 Skills Stack record.
- Values Compass: at least 2 saved values.
- Skill Sampler: activity across at least 3 skill categories.

## Current limitation

Practice activity contributes only when the backend supplies `recentActivity`. The live member currently has no records in `PracticeLog` or `SkillSessions`, so the dashboard must show a genuine empty state rather than award practice points or manufacture history.
