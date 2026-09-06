'use strict';
const assert = require('assert');
const fs = require('fs');

const dashboard = fs.readFileSync('subscriber-dashboard-shell.html', 'utf8');

assert(dashboard.includes('sectionOrder=["daily-check-in","help-me-decide","stack","practice","learning","learning-progress","deeper","support"]'));
for (const id of ['daily-check-in', 'help-me-decide', 'practice', 'learning']) {
  assert(dashboard.includes(`ensureCollapsible("${id}"`), `${id} must be an accordion`);
}
assert(dashboard.includes('toggle.textContent=open?"▲":"▼"'));
assert(dashboard.includes('window.open(url,"_blank","noopener,noreferrer")'));
assert(dashboard.includes('Search more skills here'));
assert(!dashboard.includes('Explore More Skills'));
assert(!dashboard.includes('Browse by category'));
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
assert(completionPage.includes("data.type !== 'skillComplete'"));
assert(completionPage.includes('recordSkillCompletion'));
assert(completionBackend.includes('Permissions.SiteMember'));
assert(completionBackend.includes(".eq('memberId', entitlement.memberId).eq('sessionKey', sessionKey)"));
assert(completionBackend.includes('duplicate:true'));

console.log('Dashboard order, accordion, navigation, and error-state checks: PASS');
