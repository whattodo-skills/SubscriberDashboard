const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const source = fs.readFileSync(path.join(__dirname, 'wix-backend/daily-check-in-mood.js'), 'utf8');
const calculateMood = new Function(`${source.replace('export function calculateMood', 'function calculateMood')}\nreturn calculateMood;`)();
const librarySource = fs.readFileSync(path.join(__dirname, 'daily-check-in-library.js'), 'utf8');
const library = new Function(`${librarySource.replace('const DAILY_CHECKIN_LIBRARY=', 'return ')}`)();
const ui = fs.readFileSync(path.join(__dirname, 'emotion-feeling-check-in.html'), 'utf8');
const entry = (date, emotion, extra = {}) => ({ date, emotion, emotionId: emotion.toLowerCase(), status: 'completed', ...extra });

test('renders all 18 spreadsheet emotions with parent-scoped feelings', () => {
  assert.equal(Object.keys(library.emotions).length, 18);
  assert.equal(library.emotions.Joyful.f.includes('Thrilled'), true);
  assert.equal(library.emotions.Afraid.f.includes('Overwhelmed'), true);
  assert.equal(library.emotions.Overwhelmed.f.includes('Stressed'), true);
});

test('complete check-in flow keeps categories separate and supplies hover definitions', () => {
  assert.match(ui, /What emotion are you noticing right now/);
  assert.match(ui, /Which word describes it more precisely/);
  assert.match(ui, /What does the situation feel like/);
  assert.match(ui, /What do you notice in your body/);
  assert.match(ui, /What was happening when you noticed this/);
  assert.match(ui, /data-definition/);
  assert.match(ui, /kind==="feeling"/);
  assert.match(ui, /id="feelingDetail"/);
  assert.match(ui, /What this feeling is/);
  assert.match(ui, /How it feels in your body/);
  assert.match(ui, /Thoughts it brings/);
  assert.match(ui, /If it feels uncomfortable/);
  assert.match(ui, /How to put it into words/);
  assert.match(ui, /Your last four check-ins/);
  assert.match(ui, /rows\.slice\(0,4\)/);
  assert.match(ui, /class="recent-card"/);
  assert.match(ui, /contextWordId/);
  assert.match(ui, /bodyStateId/);
  assert.match(ui, /Edit today’s check-in/);
});

test('does not assign a mood before 14 completed daily check-ins', () => {
  const result = calculateMood(Array.from({ length: 13 }, (_, i) => entry(`2026-08-${String(i + 1).padStart(2, '0')}`, 'Sad')));
  assert.equal(result.status, 'building_history');
  assert.equal(result.remainingCheckIns, 1);
  assert.equal(result.currentMoodEmotionId, null);
});

test('uses only the latest 14 completed local dates', () => {
  const rows = [entry('2026-08-01', 'Sad'), ...Array.from({ length: 14 }, (_, i) => entry(`2026-08-${String(i + 2).padStart(2, '0')}`, i < 8 ? 'Calm' : 'Sad'))];
  const result = calculateMood(rows);
  assert.equal(result.status, 'ready');
  assert.equal(result.currentMoodEmotionId, 'calm');
  assert.equal(result.windowStart, '2026-08-02');
});

test('returns deterministic tied leaders and ignores incomplete entries', () => {
  const rows = Array.from({ length: 14 }, (_, i) => entry(`2026-08-${String(i + 1).padStart(2, '0')}`, i % 2 ? 'Sad' : 'Calm'));
  rows.push(entry('2026-08-20', 'Angry', { status: 'draft' }));
  const result = calculateMood(rows);
  assert.equal(result.status, 'tied');
  assert.deepEqual(result.leaderEmotionIds, ['calm', 'sad']);
});

test('counts no more than one completed record per local date', () => {
  const rows = Array.from({ length: 13 }, (_, i) => entry(`2026-08-${String(i + 1).padStart(2, '0')}`, 'Calm'));
  rows.push(entry('2026-08-13', 'Sad', { completedAt: '2026-08-13T20:00:00Z' }));
  assert.equal(calculateMood(rows).status, 'building_history');
});
