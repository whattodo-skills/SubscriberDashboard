import { recordSkillCompletion } from 'backend/skillProgress.web';

$w.onReady(() => {
  const components = $w('HtmlComponent');
  const html = components && components[0];
  if (!html) return;

  html.onMessage(async ({ data = {} }) => {
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
});
