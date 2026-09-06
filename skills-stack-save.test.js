'use strict';

const assert = require('assert');
const fs = require('fs');

const html = fs.readFileSync('The_Skills_Hub.html', 'utf8');
const backend = fs.readFileSync('wix-backend/http-functions.js', 'utf8');

assert(html.includes("type:'stackSkill'"), 'Skills Hub must send a stackSkill request');
assert(html.includes("msg.type==='stackSkillResult'"), 'Skills Hub must wait for a Wix stackSkillResult');
assert(html.includes("skills=msg.skills.map(cleanSkill).filter(s=>s.isPublished)"), 'Wix CMS skills must replace fallback records after initialization');
assert(!html.includes("skills=mergeSkills(msg.skills)"), 'fallback IDs must not remain after Wix CMS initialization');
assert(html.includes("String(saved.skillId)===pending.skillId"), 'success must match the requested CMS skill ID');
assert(html.includes('saved._id'), 'success must require the saved CMS row ID');
assert(html.includes('Array.isArray(msg.data.stacks)'), 'success must require the refreshed four-slot stack');
assert(html.includes('clearTimeout(pending.timer)'), 'a confirmed result must clear the failure timeout');
assert(html.includes('pendingStackRequests.delete(requestId)'), 'an unconfirmed request must leave the pending state');
assert(html.includes("alert('Wix did not confirm the Skills Stack save. Please try again.')"), 'timeout must report failure');
assert(backend.includes("item.stacked !== true && item.status === 'archived'"), 'replacement history must exclude removed and uncertain records');
assert(backend.includes("replacedBySkillId: skill._id"), 'successful replacements must identify the incoming skill');
assert(backend.includes("if (current && current.skillId === skill._id)"), 'saving the same skill must be idempotent');
assert(backend.includes("duplicate: true"), 'same-skill retry must be reported as a duplicate');
assert(backend.includes("const saved = await wixData.insert(STACKS, values, OPTIONS);\n  await Promise.all(result.items.filter(item => item.stacked === true)"), 'new current skill must persist before outgoing records are archived');

console.log('Skills Stack confirmed-save regression checks: PASS');
