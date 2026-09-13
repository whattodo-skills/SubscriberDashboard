const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const persistenceSource = fs.readFileSync(path.join(__dirname, 'wix-backend/check-in-idempotency.js'), 'utf8');
const createCheckinPersistence = new Function(`${persistenceSource.replace('export function createCheckinPersistence', 'function createCheckinPersistence')}\nreturn createCheckinPersistence;`)();

function harness() {
  const records = new Map();
  const findOwned = async (memberId, id) => {
    const item = records.get(id);
    return item?.memberId === memberId ? { ...item } : null;
  };
  const insert = async item => {
    await Promise.resolve();
    if (records.has(item._id)) throw new Error('duplicate_item_id');
    records.set(item._id, { ...item });
    return { ...item };
  };
  const listHistory = async memberId => [...records.values()].filter(item => item.memberId === memberId).map(item => ({ ...item }));
  const normalize = item => ({ _id: item._id, submissionId: item.submissionId, date: item.date, emotion: item.emotion, feeling: item.feeling });
  const matches = (item, expected) => item.date === expected.date && item.emotion === expected.emotion && item.feeling === expected.feeling;
  return { records, save: createCheckinPersistence({ findOwned, insert, listHistory, normalize, matches }) };
}

const request = { memberId: 'member-a', submissionId: 'submission-1', record: { date: '2026-09-05', emotion: 'Calm', feeling: 'Grounded' } };

test('first save returns record ID, normalized record, and refreshed history', async () => {
  const { save } = harness();
  const result = await save(request);
  assert.equal(result.checkinId, request.submissionId);
  assert.deepEqual(result.savedRecord, { _id: 'submission-1', submissionId: 'submission-1', ...request.record });
  assert.equal(result.checkins.length, 1);
  assert.equal(result.idempotentReplay, false);
});

test('retry after a lost response reuses the same logical submission', async () => {
  const { save, records } = harness();
  await save(request);
  const retry = await save(request);
  assert.equal(retry.idempotentReplay, true);
  assert.equal(retry.checkinId, request.submissionId);
  assert.equal(records.size, 1);
});

test('concurrent requests create only one record', async () => {
  const { save, records } = harness();
  const results = await Promise.all([save(request), save(request)]);
  assert.equal(records.size, 1);
  assert.deepEqual(results.map(result => result.checkinId), ['submission-1', 'submission-1']);
  assert.equal(results.filter(result => result.idempotentReplay).length, 1);
});

test('same key with different contents is rejected', async () => {
  const { save } = harness();
  await save(request);
  await assert.rejects(() => save({ ...request, record: { ...request.record, feeling: 'Peaceful' } }), /idempotency_conflict/);
});

test('another member cannot retrieve or overwrite a submission ID', async () => {
  const { save, records } = harness();
  await save(request);
  await assert.rejects(() => save({ ...request, memberId: 'member-b' }), /duplicate_item_id/);
  assert.equal(records.get(request.submissionId).memberId, 'member-a');
});

test('bridge and backend preserve Decision Loop actions and add saveCheckin', () => {
  const web = fs.readFileSync(path.join(__dirname, 'wix-backend/daily-check-in.web.js'), 'utf8');
  const bridge = fs.readFileSync(path.join(__dirname, 'wix-backend/daily-check-in-bridge-page.js'), 'utf8');
  const html = fs.readFileSync(path.join(__dirname, 'emotion-feeling-check-in.html'), 'utf8');
  const compactHtml = html.replace(/\s+/g, '');
  for (const action of ['saveCheckin', 'startLoop', 'markSkillOpened', 'completeLoop', 'dismissLoop']) {
    assert.match(web, new RegExp(`['\"]${action}['\"]`));
  }
  assert.match(bridge, /['"]saveCheckin['"]/);
  assert.match(compactHtml, /api\(["']saveCheckin["'],payload\)/);
  assert.match(compactHtml, /timezone:Intl\.DateTimeFormat\(\)\.resolvedOptions\(\)\.timeZone/);
  assert.match(web, /currentMember\.getMember\(\)/);
  assert.match(web, /entry, requestId, \.\.\.legacyEntry/);
});

test('member identity cannot be supplied by the iframe and authentication is enforced', () => {
  const web = fs.readFileSync(path.join(__dirname, 'wix-backend/daily-check-in.web.js'), 'utf8');
  const html = fs.readFileSync(path.join(__dirname, 'emotion-feeling-check-in.html'), 'utf8');
  assert.doesNotMatch(html, /memberId\s*:/);
  assert.match(web, /Permissions\.SiteMember/);
  assert.match(web, /if \(!member\?\._id\) throw new Error\('authenticated_member_required'\)/);
  assert.doesNotMatch(web.match(/saveCheckin:\s*\[[^\]]*\]/)?.[0] || '', /memberId/);
  assert.match(web, /Object\.keys\(input\).*unknown_field/);
});

test('interface confirms only a complete backend receipt and distinguishes history errors', () => {
  const html = fs.readFileSync(path.join(__dirname, 'emotion-feeling-check-in.html'), 'utf8');
  const compactHtml = html.replace(/\s+/g, '');
  assert.match(compactHtml, /if\(!result\.checkinId\|\|!result\.savedRecord\)throwError\(['"]invalid_save_confirmation['"]\)/);
  assert.match(compactHtml, /renderMood\(result\)/);
  assert.match(html, /Mood history could not load/);
  assert.match(html, /Mood history could not load/);
  assert.match(compactHtml, /rows\.slice\(0,4\)/);
});

test('every spreadsheet feeling has a specific definition and opens the five-part Feelings Wheel card', () => {
  const vm = require('node:vm');
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${fs.readFileSync(path.join(__dirname, 'daily-check-in-library.js'), 'utf8')};this.library=DAILY_CHECKIN_LIBRARY`, context);
  vm.runInContext(`${fs.readFileSync(path.join(__dirname, 'feeling-guides.js'), 'utf8')};this.definitions=FEELING_DEFINITIONS`, context);
  const feelings = Object.values(context.library.emotions).flatMap(emotion => emotion.f);
  assert.equal(Object.keys(context.library.emotions).length, 18);
  assert.equal(feelings.length, 262);
  for (const feeling of feelings) {
    assert.ok(context.definitions[feeling], `missing definition for ${feeling}`);
    assert.doesNotMatch(context.definitions[feeling], /more precise feeling associated with/i);
  }
  const html = fs.readFileSync(path.join(__dirname, 'emotion-feeling-check-in.html'), 'utf8');
  for (const section of ['What this feeling is', 'How it feels in your body', 'Thoughts it brings', 'If it feels uncomfortable', 'How to put it into words']) assert.match(html, new RegExp(section, 'i'));
  assert.match(html, /feelingGuide\(state\.emotion,state\.feeling,parentGuide\)/);
  assert.match(html, /FEELING_DEFINITIONS\[label\]/);
  assert.doesNotMatch(html, /None of these fit|Skip this step/);
  assert.doesNotMatch(html, /panel\.scrollIntoView/);
});

test('legacy HTTP save action remains separate from canonical idempotent saveCheckin', () => {
  const backend = fs.readFileSync(path.join(__dirname, 'wix-backend/http-functions.js'), 'utf8');
  assert.match(backend, /if \(action === 'save'\) result = await saveLegacy/);
  assert.match(backend, /else if \(action === 'saveCheckin'\) result = await saveCheckin/);
});

test('member history follows every Wix query page instead of silently truncating', () => {
  const backend = fs.readFileSync(path.join(__dirname, 'wix-backend/http-functions.js'), 'utf8');
  assert.match(backend, /while \(result\.hasNext\(\)\)/);
  assert.match(backend, /result = await result\.next\(\)/);
  assert.doesNotMatch(backend.match(/export async function getCheckins[\s\S]*?\n}/)?.[0] || '', /slice\(0,/);
});
