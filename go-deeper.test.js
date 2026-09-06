'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('wix-backend/learning-resources.js', 'utf8')
  .replace('export function learningResourcesForMember', 'function learningResourcesForMember')
  + '\nmodule.exports = { learningResourcesForMember };';
const sandbox = { module: { exports: {} } };
vm.runInNewContext(source, sandbox);
const { learningResourcesForMember } = sandbox.module.exports;

const focus = learningResourcesForMember({
  paid: true,
  practiceHistory: [{ skillId: '662740aa-3cb3-4470-a5a5-fadad9baea5e', skillName: 'Be Present: Single Task Focus' }],
  stacks: [], archivedStacks: []
});
assert.equal(focus[0].id, '4d7f6ca7-2641-4553-8b3e-6289fc887441');
assert.match(focus[0].reason, /recent practice.*Be Present: Single Task Focus/);

const feelings = learningResourcesForMember({
  paid: true,
  pendingLoop: { selectedSkill: { id: '272be988-5d3b-449b-802f-955266adaed6', title: 'Check The Story', category: 'Feelings' } },
  practiceHistory: focus, stacks: [], archivedStacks: []
});
assert.equal(feelings[0].id, '9fbea750-b711-4c9f-8872-699867836221');
assert.equal(feelings[0].relevanceRank, 0);
assert.notEqual(feelings[0].id, focus[0].id);
assert.equal(new Set(feelings.map(item => item.id)).size, feelings.length);

const empty = learningResourcesForMember({ paid: false, practiceHistory: [], stacks: [], archivedStacks: [] });
assert.equal(empty.length, 0);

const dashboard = fs.readFileSync('subscriber-dashboard-shell.html', 'utf8');
assert(dashboard.includes('Loading related learning…'));
assert(dashboard.includes('No related published learning is available'));
assert(dashboard.includes('Related learning could not load. Please retry.'));
assert(dashboard.includes('data-learning-url'));
assert(dashboard.includes('Browse all learning'));
