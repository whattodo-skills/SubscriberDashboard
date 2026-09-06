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

console.log('Dashboard order, accordion, navigation, and error-state checks: PASS');
