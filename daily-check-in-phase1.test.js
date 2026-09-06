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
  for (const action of ['saveCheckin', 'startLoop', 'markSkillOpened', 'completeLoop', 'dismissLoop']) {
    assert.match(web, new RegExp(`['\"]${action}['\"]`));
  }
  assert.match(bridge, /['"]saveCheckin['"]/);
  assert.match(html, /api\('saveCheckin',\{submissionId:submissionId\(\),date:/);
  assert.match(html, /sessionStorage\.removeItem\(SUBMISSION_KEY\)/);
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
  assert.match(html, /if\(!result\.checkinId\|\|!result\.savedRecord\)throw Error\('invalid_save_confirmation'\)/);
  assert.match(html, /updateMood\(result\);sessionStorage\.removeItem\(SUBMISSION_KEY\)/);
  assert.match(html, /Mood history could not load/);
  assert.match(html, /History error:/);
  assert.match(html, /rows\.slice\(0,10\)/);
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
