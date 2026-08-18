'use strict';
const assert = require('assert');
const fs = require('fs');

const web = fs.readFileSync('wix-backend/daily-check-in.web.js', 'utf8');
const page = fs.readFileSync('wix-backend/daily-check-in-bridge-page.js', 'utf8');
const dashboard = fs.readFileSync('subscriber-dashboard-shell.html', 'utf8');

assert(web.includes('Permissions.SiteMember'));
assert(web.includes('currentMember.getMember()'));
assert(web.includes("if (!member?._id) throw new Error('authenticated_member_required')"));
assert(web.includes("const safe = validate(action, { ...entry });"));
assert(web.includes('never spread `safe` into a record'));
assert(page.includes("data.type !== 'dashboardBridgeReady'"));
assert(page.includes("component.postMessage({ type: 'bridgeReady' })"));
assert(page.includes("data.type !== 'dailyCheckInBridgeRequest'"));
assert(page.includes('seen.has(data.requestId)'));
assert(page.includes('seen.add(data.requestId)'));
assert(page.includes('requestId: data.requestId'));
for (const action of ['list', 'previewRecommendations', 'startLoop', 'markSkillOpened', 'completeLoop', 'dismissLoop', 'getReflection']) {
  assert(web.includes(`'${action}'`), `web method missing ${action}`);
  assert(page.includes(`'${action}'`), `bridge allowlist missing ${action}`);
}
assert(!web.includes('client:'));

assert(dashboard.includes('bridgeRequest("markSkillOpened",{checkinId:pending.checkinId||pending._id||""})'));
assert(dashboard.includes('bridgePending.delete(m.requestId)'));
assert(dashboard.includes('checkinFrame.contentWindow.postMessage({type:"bridgeReady"},DAILY_CHECKIN_ORIGIN)'));

// Executable message-flow simulation: one request, one service invocation.
const service = { calls: 0, invoke(message) { this.calls += 1; return { ok: true, value: message.action }; } };
const seen = new Set(); const outstanding = new Map();
function wixPage(message) {
  if (message.type !== 'dailyCheckInBridgeRequest' || seen.has(message.requestId)) return null;
  seen.add(message.requestId); const result = service.invoke(message);
  return { type: 'dailyCheckInBridgeResponse', requestId: message.requestId, action: message.action, ...result };
}
function dashboardFromDaily(message) {
  if (message.origin !== 'https://whattodo-skills.github.io') return null;
  outstanding.set(message.requestId, message.action);
  return wixPage({ type: 'dailyCheckInBridgeRequest', requestId: message.requestId, action: message.action, entry: message.entry });
}
const request = { origin: 'https://whattodo-skills.github.io', requestId: 'req-1', action: 'startLoop', entry: { submissionId: 'sub-1' } };
const response = dashboardFromDaily(request);
assert.strictEqual(service.calls, 1);
assert.strictEqual(response.requestId, 'req-1');
assert.strictEqual(outstanding.get(response.requestId), response.action);
dashboardFromDaily(request);
assert.strictEqual(service.calls, 1, 'duplicate request must not invoke service twice');
assert.strictEqual(dashboardFromDaily({ ...request, origin: 'https://evil.example' }), null, 'wrong origin must be rejected');
assert.strictEqual(response.action, 'startLoop');
console.log('Bridge security/mock message-flow tests: PASS');
