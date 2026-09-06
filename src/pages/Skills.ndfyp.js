import wixLocationFrontend from 'wix-location-frontend';
import { dailyCheckIn } from 'backend/daily-check-in.web';
import { getSkillActionAccess, recordSkillCompletion } from 'backend/skillProgress.web';

function postAccess(html, access) {
  html.postMessage({
    type: 'skillEntitlement',
    status: access.status,
    canSaveToSkillsStack: access.canSaveToSkillsStack === true,
    canAskTerriBot: access.canAskTerriBot === true,
    message: access.message || ''
  });
}

async function refreshAccess(html) {
  try {
    postAccess(html, await getSkillActionAccess());
  } catch (error) {
    postAccess(html, {
      status: 'error',
      canSaveToSkillsStack: false,
      canAskTerriBot: false,
      message: 'We could not check your account access. Please reload or try again.'
    });
  }
}

function postActionResult(html, action, requestId, ok, message, receipt) {
  html.postMessage({ type: 'skillActionResult', action, requestId, ok, message, receipt });
}

$w.onReady(() => {
  const components = $w('HtmlComponent');
  const html = components && components[0];
  if (!html) return;

  html.onMessage(async ({ data = {} }) => {
    if (data.type === 'skillReady') {
      await refreshAccess(html);
      return;
    }

    if (data.type === 'skillAction') {
      const action = String(data.action || '');
      const requestId = String(data.requestId || '');
      try {
        const access = await getSkillActionAccess();
        if (action === 'saveToSkillsStack') {
          if (!access.canSaveToSkillsStack) {
            postActionResult(html, action, requestId, false, access.message || 'A qualifying paid subscription is required.');
            postAccess(html, access);
            return;
          }
          const skillId = String($w('#dynamicDataset').getCurrentItem()?._id || '');
          if (!skillId) throw new Error('SKILL_RECORD_UNAVAILABLE');
          const receipt = await dailyCheckIn({ action: 'saveStack', entry: { skill: { skillId } }, requestId });
          postActionResult(html, action, requestId, true, 'Saved to your Skills Stack account.', receipt);
          return;
        }
        if (action === 'askTerriBot') {
          if (!access.canAskTerriBot) {
            postActionResult(html, action, requestId, false, access.message || 'A qualifying paid subscription is required.');
            postAccess(html, access);
            return;
          }
          postActionResult(html, action, requestId, true, 'Opening TerriBot Premium.');
          wixLocationFrontend.to('/terribot-premium');
          return;
        }
        postActionResult(html, action, requestId, false, 'That action is not available.');
      } catch (error) {
        const message = error?.message === 'paid_plan_required'
          ? 'A qualifying paid subscription is required.'
          : 'We could not complete that account action. Please try again.';
        postActionResult(html, action, requestId, false, message);
        await refreshAccess(html);
      }
      return;
    }

    if (data.type !== 'skillComplete') return;
    const sessionKey = data.payload?.sessionKey;
    try {
      const receipt = await recordSkillCompletion({
        skillSlug: data.skillSlug,
        skillTitle: data.skillTitle,
        skillId: data.skillId || data.skillSlug,
        completionType: data.completionType,
        sessionKey
      });
      html.postMessage({ type: 'skillCompleteResult', sessionKey, ok: true, receipt });
    } catch (error) {
      html.postMessage({ type: 'skillCompleteResult', sessionKey, ok: false, error: error?.message || 'COMPLETION_SAVE_FAILED' });
    }
  });

  [0, 700, 1800].forEach((delay) => setTimeout(() => refreshAccess(html), delay));
});
