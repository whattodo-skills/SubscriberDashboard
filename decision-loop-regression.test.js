'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const frontend = fs.readFileSync('daily-check-in.html', 'utf8');
const dashboard = fs.readFileSync('subscriber-dashboard-shell.html', 'utf8');
const backend = fs.readFileSync('wix-backend/http-functions.js', 'utf8');
const webValidator = fs.readFileSync('../Subscriber-Dashboard-AUG2026/src/backend/daily-check-in.web.js', 'utf8');
const approval = fs.readFileSync('Decision-Loop-Phase-1-Approval.md', 'utf8');

function contextFor(code) {
  const context = {};
  vm.createContext(context);
  vm.runInContext(code, context);
  return context;
}

const frontStart = frontend.indexOf('var CATS=');
const frontEnd = frontend.indexOf('var LEARN=');
const front = contextFor(frontend.slice(frontStart, frontEnd));
const backStart = backend.indexOf('const ROUTES =');
const backEnd = backend.indexOf('export function options_dailyCheckIn');
const backCode = backend.slice(backStart, backEnd).replace(/const ROUTES =/, 'var ROUTES =').replace(/const APPROVED_RATIONALES =/, 'var APPROVED_RATIONALES =');
const back = contextFor(backCode);
const canonicalIds = new Set([...approval.matchAll(/^\| ([0-9a-f-]{36}) \|/gm)].map(match => match[1]));

assert.strictEqual(canonicalIds.size, 41, 'canonical inventory must contain 41 unique Wix IDs');

// 1. Every frontend and backend route must use a canonical ID; Listen to Understand is exact everywhere.
const correctListenId = 'c9fc833f-d210-46ca-9a28-a770b4c0fe63';
const frontendRouteIds = Object.values(front.R).flat().map(key => front.S[key][0]);
const backendRouteIds = Object.values(back.ROUTES).flat();
for (const id of [...frontendRouteIds, ...backendRouteIds]) assert(canonicalIds.has(id), `non-canonical routed Wix ID: ${id}`);
assert.strictEqual(front.S.listen[0], correctListenId);
assert(back.ROUTES['Offer support'].includes(correctListenId));
assert(!frontend.includes('c9fc833f-d210-46be-9dfe-3dcaab6c3287'));
assert(!backend.includes('c9fc833f-d210-46be-9dfe-3dcaab6c3287'));

// 2. Both layers normalize Skills Hub paths to the What To Do domain.
assert(frontend.includes("'https://www.whattodo.coach'+url"), 'frontend absolute URL normalization missing');
assert(backend.includes('https://www.whattodo.coach${value}'), 'backend absolute URL normalization missing');

// 3. A completed same-day loop returns before route resolution or mutation.
const startLoop = backend.slice(backend.indexOf('async function startLoop'), backend.indexOf('async function updateStatus'));
const completedGuard = startLoop.indexOf("sameDay?.loopVersion === 'decision-loop-v1' && sameDay.loopStatus === 'complete'");
assert(completedGuard > -1);
assert(startLoop.indexOf('alreadyCompletedToday: true') > completedGuard);
assert(completedGuard < startLoop.indexOf('wixData.get(SKILLS'), 'completed guard must precede skill lookup');
assert(completedGuard < startLoop.indexOf('Object.assign(item'), 'completed guard must precede mutation');

// 4. Dashboard navigation occurs only after markSkillOpened succeeds.
const practiceHandler = dashboard.slice(dashboard.indexOf('document.getElementById("practiceButton").addEventListener'), dashboard.indexOf('renderValuesCompass({})'));
assert(!practiceHandler.includes('.finally('), 'navigation must not occur in finally');
assert(practiceHandler.indexOf('.then(function(){button.disabled=false;var skill=') > -1);
assert(practiceHandler.includes('The skill could not open because the Learn handoff did not save. Please try again.'));
assert(practiceHandler.includes('loopStatus:"learn_pending"'), 'successful Practice handoff must update local pending state');
assert(practiceHandler.includes('Practice handoff saved. Return here to finish the Learn stage.'), 'handoff status must settle before navigation');
assert(dashboard.includes('window.addEventListener("pageshow",function(){loadLiveProgress()})'), 'browser back/forward must refresh read-only progress');
assert(dashboard.includes('document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible")loadLiveProgress()})'), 'visibility return must refresh read-only progress');
assert(dashboard.includes('button.textContent="Finish the Check-In"'), 'learn-pending refresh must expose Finish the Check-In');

// 5. Completed and no-skill messages clear stale Practice state.
assert(dashboard.includes('function resetPracticeHandoff()'));
assert(dashboard.includes('message.completedWithoutSkill||message.alreadyCompletedToday'));
assert(dashboard.includes('message.type==="dailyCheckInLearnComplete"'));
assert(dashboard.includes('DASHBOARD_DATA.pendingLoop=null;resetPracticeHandoff()'));

// 6. The browser does not submit rationale; the backend creates and stores it.
assert(!frontend.includes('p.recommendationRationaleSnapshot='), 'frontend must not submit a trusted rationale');
assert(backend.includes('const approvedRationale = noSkill ? \'\' : serverRationale(entry.selectedOutcome, skill)'));
assert(backend.includes('recommendationRationaleSnapshot: approvedRationale'));
assert(backend.includes('function serverRationale(outcome, skill)'));

// 7. Every approved outcome + skill ID pair has its own backend rationale.
let rationaleCount = 0;
for (const [outcome, ids] of Object.entries(back.ROUTES)) {
  const rationales = back.APPROVED_RATIONALES[outcome];
  assert(rationales, `missing rationale map for ${outcome}`);
  assert.deepStrictEqual(Object.keys(rationales).sort(), [...ids].sort(), `rationale IDs do not match route IDs for ${outcome}`);
  const values = ids.map(id => rationales[id]);
  assert(values.every(value => typeof value === 'string' && value.length > 10), `empty rationale for ${outcome}`);
  assert.strictEqual(new Set(values).size, ids.length, `rationales are not skill-specific for ${outcome}`);
  rationaleCount += values.length;
}
assert.strictEqual(rationaleCount, 81, 'all 81 outcome-skill rationale combinations must be present');
assert(backend.includes("APPROVED_RATIONALES[outcome]?.[skill?._id]"), 'backend must resolve rationale by outcome and skill ID');
assert(backend.includes("action === 'previewRecommendations'"), 'frontend rationale preview endpoint missing');
assert(frontend.includes('api("previewRecommendations",{selectedCategory:st.category,selectedOutcome:st.outcome})'), 'Practice must load backend-approved rationales');
assert(!frontend.includes('var WHY='), 'generic browser rationale map must be removed');

// 8. startLoop queries authenticated memberId + submissionId before other insert paths.
const submissionQuery = startLoop.indexOf(".eq('memberId', memberId)\n      .eq('submissionId', submissionId)");
assert(submissionQuery > -1, 'memberId + submissionId query missing');
assert(startLoop.indexOf('idempotentReplay: true') > submissionQuery, 'existing submission must be returned');
assert(submissionQuery < startLoop.indexOf('const items = await memberLoops(memberId)'), 'idempotency query must run before active-loop and insert logic');
assert(submissionQuery < startLoop.indexOf('wixData.insert'), 'idempotency query must run before insert');

// 9. Practice-stage failures retain the original action, Retry resubmits it,
// and a failed Learn handoff cannot be mislabeled as a failed check-in save.
assert(frontend.includes('st.retryAction=function(){begin(open)}'), 'Practice/Save action must be retained for Retry');
assert(frontend.includes('st.retryAction=none'), 'no-skill action must be retained for Retry');
assert(frontend.includes('if(st.retryAction){var retry=st.retryAction;st.saving=false;retry()}'), 'Retry must resubmit the retained action');
assert(frontend.includes('Your check-in was saved, but the practice page could not open.'), 'post-save handoff failure must be distinguished from save failure');
assert(frontend.includes('Error: "+code'), 'the Wix backend error code must be visible for diagnosis');

// 10. Help Me Decide and Daily Check-In persist to separate CMS collections.
assert(backend.includes("const DECISION_LOOPS = 'DecisionLoops'"), 'dedicated DecisionLoops collection is required');
assert(startLoop.includes('wixData.query(DECISION_LOOPS)'), 'Decision Loop idempotency must query DecisionLoops');
assert(startLoop.includes('wixData.insert(DECISION_LOOPS'), 'Decision Loop start must insert into DecisionLoops');
const dailySave = backend.slice(backend.indexOf('async function saveLegacy'), backend.indexOf('export async function getCheckins'));
assert(dailySave.includes('wixData.insert(CHECKINS'), 'Daily Check-In must remain in MoodCheckIns');
assert(!dailySave.includes('DECISION_LOOPS'), 'Daily Check-In must not write to DecisionLoops');
assert(webValidator.includes("input[key] !== undefined && input[key] !== null"), 'optional intensity ratings must allow null');

console.log('Decision Loop regression tests: 10/10 PASS');
console.log(`Canonical routed ID validation: ${canonicalIds.size} skills, ${frontendRouteIds.length} frontend route slots, ${backendRouteIds.length} backend route slots PASS`);
console.log(`Skill-specific rationale validation: ${rationaleCount} outcome-skill combinations PASS`);
console.log('memberId + submissionId idempotency enforcement: PASS');
