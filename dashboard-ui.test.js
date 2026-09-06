'use strict';
const assert = require('assert');
const fs = require('fs');

const dashboard = fs.readFileSync('subscriber-dashboard-shell.html', 'utf8');
const decision = fs.readFileSync('daily-check-in.html', 'utf8');

assert(dashboard.includes('sectionOrder=["daily-check-in","help-me-decide","stack","practice","learning","learning-progress","deeper","support"]'));
for (const id of ['daily-check-in', 'help-me-decide', 'practice', 'learning']) {
  assert(dashboard.includes(`ensureCollapsible("${id}"`), `${id} must be an accordion`);
}
assert(dashboard.includes('toggle.textContent=open?"▲":"▼"'));
assert(dashboard.includes('window.open(url,"_blank","noopener,noreferrer")'));
assert(dashboard.includes('terribot:"https://www.whattodo.coach/terribot-premium"'));
assert(dashboard.includes('button.disabled=state.allowed===false'));
assert(dashboard.includes('Search more skills here'));
assert(!dashboard.includes('Explore More Skills'));
assert(!dashboard.includes('Browse by category'));
assert(!dashboard.includes('checkin-panel-head"><h3>Help Me Decide</h3>'));
assert(!decision.includes('<h1>Help Me Decide</h1>'));
assert(!decision.includes('emotion:st.emotion||null'));
assert(decision.includes('if(st.emotion)p.emotion=st.emotion'));
assert(decision.includes('if(Number.isInteger(st.before))p.intensityBefore=st.before'));
assert(!dashboard.includes('Choose something to practice'));
assert(decision.includes('"_blank","noopener,noreferrer"'));
assert(!decision.includes('"_top"'));
assert(dashboard.includes('if(button.dataset.collapse==="help-me-decide")setDecisionOpen(opening)'));
assert(dashboard.includes('Practice history could not load. Please retry.'));
assert(dashboard.includes('Your Skills Stack could not load. Please retry.'));
assert(dashboard.includes('Learning summary could not load. Please retry.'));
assert(dashboard.includes('feeling:String(item&&item.feeling||"").trim()'));
assert(dashboard.includes('No skill practice has been recorded yet.'));
assert(dashboard.includes('document.getElementById("learningMood").textContent=latest'));
assert(dashboard.includes('Saved and archived skills ('));
assert(dashboard.includes('data-practice-id='));
assert(dashboard.includes('Array.isArray(DASHBOARD_DATA.practiceHistory)'));

const backend = fs.readFileSync('wix-backend/http-functions.js', 'utf8');
assert(backend.includes("const COMPLETIONS = 'SkillCompletions'"));
assert(backend.includes("item.status === 'completed' && item.completedAt"));
assert(backend.includes("wixData.query(COMPLETIONS).eq('memberId', memberId)"));
assert(backend.includes("allQueryItems(wixData.query(STACKS).eq('memberId', memberId)"));

const completionPage = fs.readFileSync('src/pages/Skills.ndfyp.js', 'utf8');
const completionBackend = fs.readFileSync('wix-backend/skill-completion-addon.js', 'utf8');
const accessBackend = fs.readFileSync('wix-backend/skill-action-access-addon.js', 'utf8');
assert(completionPage.includes("data.type !== 'skillComplete'"));
assert(completionPage.includes('recordSkillCompletion'));
assert(completionPage.includes("data.type === 'skillReady'"));
assert(completionPage.includes("data.type === 'skillAction'"));
assert(completionPage.includes("data.type === 'skillPracticeSave' && data.action === 'saveToSkillsStack'"));
assert(completionPage.includes('getSkillActionAccess'));
assert(completionPage.includes("dailyCheckIn({ action: 'saveStack'"));
assert(completionPage.includes("wixLocationFrontend.to('/terribot-premium')"));
assert(completionBackend.includes('Permissions.SiteMember'));
assert(completionBackend.includes("if (!entitlement.paid) throw safeError('PAID_PLAN_REQUIRED')"));
assert(completionBackend.includes(".eq('memberId', entitlement.memberId).eq('sessionKey', sessionKey)"));
assert(completionBackend.includes('duplicate:true'));
assert(accessBackend.includes('getCurrentEntitlement'));
assert(accessBackend.includes('canSaveToSkillsStack: true'));
assert(accessBackend.includes('canAskTerriBot: true'));
assert(accessBackend.includes("status: 'error'"));

console.log('Dashboard order, accordion, navigation, and error-state checks: PASS');
