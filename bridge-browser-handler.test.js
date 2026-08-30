'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
(async function run() {

const dailyHtml = fs.readFileSync('daily-check-in.html', 'utf8');
const dashHtml = fs.readFileSync('subscriber-dashboard-shell.html', 'utf8');
const dailyOrigin = 'https://whattodo-skills.github.io';
const wixOrigin = 'https://www.whattodo.coach';

function extract(html, start, end) {
  const a = html.indexOf(start); const b = html.indexOf(end, a);
  assert(a >= 0 && b > a, `missing extracted handler: ${start}`);
  return html.slice(a, b);
}

const dailyPost = extract(dailyHtml, 'function e(', 'function say(').replace(/^function e[\s\S]*?\}function post/, 'function post');
const dailyListener = extract(dailyHtml, 'window.addEventListener("message"', 'window.addEventListener("beforeunload"');
const dailyApi = extract(dailyHtml, 'function api(', 'function opts(');
const dashRequest = extract(dashHtml, 'function bridgeRequest(', 'function loadLiveProgress');
const dashListener = extract(dashHtml, 'var bridgeRequests=new Map()', 'renderValuesCompass({});');

const dailySent = []; const dailyHandlers = [];
const dailyParent = { postMessage(message, origin) { dailySent.push({ message, origin }); } };
const dailyContext = { BRIDGE_ORIGIN: dailyOrigin, pendingBridge: new Map(), bridgeReady: false, st: {}, render() {}, restore() {}, api() { return Promise.resolve({ pendingLoop: null }); }, say() {}, report() {}, parent: dailyParent, window: { parent: dailyParent, addEventListener(type, fn) { if (type === 'message') dailyHandlers.push(fn); } }, document: { getElementById() { return { textContent: '' }; } }, clearTimeout, setTimeout, Error, Map };
vm.createContext(dailyContext);
vm.runInContext(`var BRIDGE_ORIGIN='${dailyOrigin}',pendingBridge=new Map(),bridgeReady=false,st={},functionPost=undefined;function post(m){parent.postMessage(m,BRIDGE_ORIGIN)};function render(){};${dailyListener}`, dailyContext);
assert.strictEqual(dailyHandlers.length, 1);
vm.runInContext('post({type:"dailyCheckInReady"})', dailyContext);
assert.strictEqual(dailySent.length, 1);
assert.strictEqual(dailySent[0].origin, dailyOrigin);
assert.strictEqual(dailySent[0].message.type, 'dailyCheckInReady');
dailyHandlers[0]({ origin: dailyOrigin, source: dailyParent, data: { type: 'bridgeReady' } });
assert.strictEqual(dailyContext.bridgeReady, true);
dailyHandlers[0]({ origin: wixOrigin, source: dailyParent, data: { type: 'bridgeReady' } });
assert.strictEqual(dailyContext.bridgeReady, true, 'wrong origin must not change established state');
vm.runInContext(dailyApi, dailyContext);
const dailyRequestPromise = dailyContext.api('markSkillOpened', { checkinId: 'check-1' });
const dailyRequest = dailySent.at(-1).message;
assert.strictEqual(dailyRequest.type, 'dailyCheckInRequest');

const dashSent = []; const dashHandlers = []; const wixWindow = { postMessage(message, origin) { dashSent.push({ message, origin }); } }; const iframeWindow = { postMessage(message, origin) { dashSent.push({ message, origin, iframe: true }); } }; const decisionWindow = { postMessage() {} };
const dashContext = { DAILY_CHECKIN_ORIGIN: dailyOrigin, TARGET_ORIGIN: wixOrigin, bridgeReady: false, bridgeRequests: new Map(), bridgeSeen: new Set(), bridgePending: new Map(), checkinFrame: { contentWindow: iframeWindow }, decisionFrame: { contentWindow: decisionWindow }, window: { parent: wixWindow, addEventListener(type, fn) { if (type === 'message') dashHandlers.push(fn); } }, loadLiveProgress() {}, clearTimeout, setTimeout, clearInterval() {}, setInterval() { return 1; } };
vm.createContext(dashContext);
vm.runInContext(`var BRIDGE_ACTIONS=new Set(['list','previewRecommendations','startLoop','markSkillOpened','completeLoop','dismissLoop','getReflection']),bridgeRequests=new Map(),bridgeSeen=new Set(),bridgePending=new Map(),bridgeReady=false;window.addEventListener=function(type,fn){if(type==='message')this._handler=fn};${dashListener}`, dashContext);
const dh = dashContext.window._handler; assert(dh, 'dashboard handler extracted');
const dailyForwarded = [];
iframeWindow.postMessage = (message, origin) => { dailyForwarded.push({ message, origin }); dailyHandlers[0]({ origin, source: dailyParent, data: message }); };
dh({ origin: dailyOrigin, source: iframeWindow, data: { type: 'dailyCheckInReady' } });
assert.strictEqual(dashSent.at(-1).message.type, 'dashboardBridgeReady');
assert.strictEqual(dashSent.at(-1).origin, wixOrigin);
dh({ origin: wixOrigin, source: wixWindow, data: { type: 'bridgeReady' } });
assert.strictEqual(dashContext.bridgeReady, true);
assert.strictEqual(dailyForwarded.some(x => x.message.type === 'bridgeReady' && x.origin === dailyOrigin), true, 'Wix readiness must reach Daily Check-In');
dh({ origin: dailyOrigin, source: iframeWindow, data: dailyRequest });
const dailyRelay = dashSent.at(-1).message;
assert.strictEqual(dailyRelay.type, 'dailyCheckInBridgeRequest');
dh({ origin: wixOrigin, source: wixWindow, data: { type: 'dailyCheckInBridgeResponse', requestId: dailyRelay.requestId, action: dailyRelay.action, ok: true, data: { loopStatus: 'learn_pending' } } });
assert.strictEqual((await dailyRequestPromise).loopStatus, 'learn_pending');

// A Help Me Decide response must return only to the Decision Loop iframe.
const decisionForwarded = [];
decisionWindow.postMessage = (message, origin) => { decisionForwarded.push({ message, origin }); };
const dailyForwardedBeforeDecision = dailyForwarded.length;
dh({ origin: dailyOrigin, source: decisionWindow, data: { type: 'dailyCheckInRequest', requestId: 'decision-1', action: 'list', entry: {} } });
dh({ origin: wixOrigin, source: wixWindow, data: { type: 'dailyCheckInBridgeResponse', requestId: 'decision-1', action: 'list', ok: true, data: { checkins: [] } } });
assert.strictEqual(decisionForwarded.length, 1, 'Decision Loop response must reach its requesting iframe');
assert.strictEqual(decisionForwarded[0].message.requestId, 'decision-1');
assert.strictEqual(dailyForwarded.length, dailyForwardedBeforeDecision, 'Decision Loop response must not leak into Daily Check-In');

// Exercise the actual dashboard request function and resolve it with a matched response.
vm.runInContext(`var bridgeReady=true,bridgePending=new Map(),TARGET_ORIGIN='${wixOrigin}';${dashRequest}`, dashContext);
const p = dashContext.bridgeRequest('markSkillOpened', { checkinId: 'check-1' });
assert.strictEqual(dashSent.at(-1).message.action, 'markSkillOpened');
assert.strictEqual(dashSent.at(-1).origin, wixOrigin);
const requestId = dashSent.at(-1).message.requestId;
const pending = dashContext.bridgePending.get(requestId); assert(pending);
dh({ origin: wixOrigin, source: wixWindow, data: { type: 'dailyCheckInBridgeResponse', requestId: 'unknown', action: 'markSkillOpened', ok: true } });
dh({ origin: wixOrigin, source: wixWindow, data: { type: 'dailyCheckInBridgeResponse', requestId, action: 'startLoop', ok: true } });
assert.strictEqual(dashContext.bridgePending.has(requestId), true);
dh({ origin: wixOrigin, source: wixWindow, data: { type: 'dailyCheckInBridgeResponse', requestId, action: 'markSkillOpened', ok: true, data: { loopStatus: 'learn_pending' } } });
const result = await p;
assert.strictEqual(result.loopStatus, 'learn_pending');
assert.strictEqual(dashContext.bridgePending.has(requestId), false, 'matched response must delete dashboard pending request');
clearTimeout(pending.timer);
dh({ origin: wixOrigin, source: wixWindow, data: { type: 'dailyCheckInBridgeResponse', requestId, action: 'markSkillOpened', ok: true } });
assert.strictEqual(dashContext.bridgePending.has(requestId), false);
const retry = dashContext.bridgeRequest('markSkillOpened', { checkinId: 'check-1' });
const retryId = dashSent.at(-1).message.requestId;
assert.notStrictEqual(retryId, requestId);
assert.strictEqual(dashSent.at(-1).message.entry.checkinId, 'check-1');
const retryPending = dashContext.bridgePending.get(retryId);
dh({ origin: wixOrigin, source: wixWindow, data: { type: 'dailyCheckInBridgeResponse', requestId: retryId, action: 'markSkillOpened', ok: false, error: 'failed' } });
await retry.catch(error => assert.strictEqual(error.message, 'failed'));
clearTimeout(retryPending.timer);

// Negative protocol checks.
dh({ origin: 'https://evil.example', source: iframeWindow, data: { type: 'dailyCheckInRequest', requestId: 'evil', action: 'startLoop', entry: {} } });
dh({ origin: dailyOrigin, source: {}, data: { type: 'dailyCheckInRequest', requestId: 'wrong-source', action: 'startLoop', entry: {} } });
assert.strictEqual(dashContext.bridgeSeen.has('evil'), false);
assert.strictEqual(dashContext.bridgeSeen.has('wrong-source'), false);
console.log('Browser-handler harness (extracted HTML handlers): PASS');
process.exit(0);
})();
