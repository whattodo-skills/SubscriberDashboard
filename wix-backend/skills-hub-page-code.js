import { dailyCheckIn } from 'backend/daily-check-in.web';

// Page code for the existing Skills Hub HTML component. The component ID is
// #html17 in the current Wix page; #skillsHubHtml is supported if it is renamed.
function getSkillsHubHtml($w) {
  try { return $w('#skillsHubHtml'); } catch (_) {
    try { return $w('#html17'); } catch (__) { return null; }
  }
}

$w.onReady(() => {
  const html = getSkillsHubHtml($w);
  if (!html) return;
  html.onMessage(async ({ data = {} }) => {
    if (data.source !== 'wtd-skills-hub') return;
    if (!['stack', 'skip'].includes(data.action) || !data.skill || !data.skill.skillId) return;
    const response = { type: data.action === 'stack' ? 'stackSkillResult' : 'skipSkillResult', requestId: data.requestId || '', ok: true };
    try {
      if (data.action === 'stack') {
        response.data = await dailyCheckIn({ action: 'saveStack', entry: { skill: data.skill } });
      }
    } catch (error) {
      response.ok = false;
      response.error = error?.message || 'skill_stack_save_failed';
    }
    html.postMessage(response);
  });
  html.postMessage({ type: 'skillsHubBridgeReady' });
});
