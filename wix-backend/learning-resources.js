const RESOURCES = [
  { id: '929dedb4-7b79-4808-87b7-100a40e31a1f', type: 'Article', title: 'Deep Breathing Exercises to Cope When Stress Takes Over Your Body', description: 'Use intentional breathing to help your body shift out of high alert.', url: 'https://www.whattodo.coach/post/deep-breathing-exercises', access: 'paid_blog', skillIds: ['87f78968-ef19-4343-a744-9ff57e15b85d'], categories: ['Focus', 'Coping'] },
  { id: '9fbea750-b711-4c9f-8872-699867836221', type: 'Article', title: 'Check The Story: How to Separate What Happened from What Your Mind Added', description: 'Separate facts from assumptions and choose a more balanced response.', url: 'https://www.whattodo.coach/post/check-the-story-how-to-separate-what-happened-from-what-your-mind-added', access: 'paid_blog', skillIds: ['272be988-5d3b-449b-802f-955266adaed6'], categories: ['Feelings'] },
  { id: 'de14a80b-685a-422d-b23a-4dc9c0880a9b', type: 'Article', title: 'How To Calm Down: 5 Body-First Tools That Actually Work', description: 'Five body-first tools for regulating your nervous system when emotions feel too big.', url: 'https://www.whattodo.coach/post/how-to-calm-down', access: 'paid_blog', skillIds: ['639ad66e-4f21-43a0-a9a2-00e754656cb5'], categories: ['Coping'] },
  { id: '4d7f6ca7-2641-4553-8b3e-6289fc887441', type: 'Article', title: 'How to Be Present by Learning to "Begin Again"', description: 'Practice noticing attention drift and gently returning to the present task.', url: 'https://www.whattodo.coach/post/how-to-focus-begin-again', access: 'paid_blog', skillIds: ['662740aa-3cb3-4470-a5a5-fadad9baea5e'], categories: ['Focus'] },
  { id: '52351205-ea75-41d4-a3ec-1d3bfee85aa4', type: 'Article', title: 'How To Deepen Your Active Listening Skills With the Great Listener Practice', description: 'Build communication and emotional intimacy through active listening.', url: 'https://www.whattodo.coach/post/active-listening-skills', access: 'paid_blog', skillIds: ['b20b79d1-0bb2-48b3-97c1-c148d509cfc8', 'c9fc833f-d210-46ca-9a28-a770b4c0fe63'], categories: ['Connecting'] },
  { id: '3672d25c-64ea-48c3-a355-1b1574feecdd', type: 'Article', title: 'How To Build Emotional Strength With The Skills Hub', description: 'Learn how small, practical skills build emotional strength over time.', url: 'https://www.whattodo.coach/post/how-to-build-emotional-strength-with-the-skills-hub', access: 'paid_blog', skillIds: [], categories: ['Focus', 'Coping', 'Feelings', 'Connecting'] },
  { id: '71f58b57-32b8-44e7-918d-a611536346c2', type: 'Starter Camp', title: 'What To Do! 4-Week Starter Camp', description: 'A four-week program for practicing the dashboard tools and building a personal skills toolkit.', url: 'https://www.whattodo.coach/self-guided-programs/71f58b57-32b8-44e7-918d-a611536346c2', access: 'public_program', skillIds: [], categories: ['Focus', 'Coping', 'Feelings', 'Connecting'] }
];

function key(value) { return String(value || '').trim().toLowerCase(); }
function distinct(items) { return [...new Set(items.filter(Boolean))]; }
function skillId(item) { return String(item?.skillId || item?.id || '').trim(); }
function skillTitle(item) { return String(item?.skillName || item?.skillTitle || item?.title || '').trim(); }
function category(item) { return String(item?.catLabel || item?.category || item?.catKey || '').trim(); }

export function learningResourcesForMember({ pendingLoop, practiceHistory, stacks, archivedStacks, paid }) {
  const pending = pendingLoop || {};
  const current = pending.selectedSkill || pending.recommendedSkill || {};
  const contexts = [];
  if (skillId(current)) contexts.push({ rank: 0, skillId: skillId(current), title: skillTitle(current), category: category(current), reason: `Related to ${skillTitle(current) || 'your selected skill'}` });
  (practiceHistory || []).slice(0, 12).forEach(item => contexts.push({ rank: 1, skillId: skillId(item), title: skillTitle(item), category: category(item), reason: `Related to your recent practice${skillTitle(item) ? `: ${skillTitle(item)}` : ''}` }));
  (stacks || []).forEach(item => contexts.push({ rank: 2, skillId: skillId(item), title: skillTitle(item), category: category(item), reason: `Related to your current Skills Stack${skillTitle(item) ? `: ${skillTitle(item)}` : ''}` }));
  (archivedStacks || []).forEach(item => contexts.push({ rank: 3, skillId: skillId(item), title: skillTitle(item), category: category(item), reason: `Related to a saved or archived skill${skillTitle(item) ? `: ${skillTitle(item)}` : ''}` }));
  const categoryContexts = distinct(contexts.map(item => item.category)).map(value => ({ rank: 4, category: value, reason: `Related to your ${value} skills` }));
  const matches = [];
  RESOURCES.forEach(resource => {
    let match = contexts.find(context => context.skillId && resource.skillIds.includes(context.skillId));
    if (!match) match = categoryContexts.find(context => resource.categories.some(value => key(value) === key(context.category)));
    if (!match) return;
    matches.push({ ...resource, reason: match.reason, relevanceRank: match.rank, available: resource.access === 'public_program' || Boolean(paid), accessLabel: resource.access === 'public_program' ? 'Public program' : paid ? 'Available with your subscription' : 'A qualifying plan may be required' });
  });
  return matches.sort((a, b) => a.relevanceRank - b.relevanceRank || a.title.localeCompare(b.title)).slice(0, 6);
}
