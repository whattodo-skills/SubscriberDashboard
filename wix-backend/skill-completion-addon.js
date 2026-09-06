// Deployed at the end of the existing Wix backend/skillProgress.web.js module.
// This source-only backup uses that module's existing webMethod, Permissions,
// wixData, getCurrentEntitlement, and safeError bindings.
const SKILL_COMPLETIONS = 'SkillCompletions';

export const recordSkillCompletion = webMethod(Permissions.SiteMember, async (entry) => {
  const entitlement = await getCurrentEntitlement();
  if (!entitlement.memberId) throw safeError('LOGIN_REQUIRED');
  if (!entitlement.paid) throw safeError('PAID_PLAN_REQUIRED');
  const skillSlug = String(entry?.skillSlug || '').trim().slice(0, 120);
  const skillTitle = String(entry?.skillTitle || '').trim().slice(0, 200);
  const completionType = String(entry?.completionType || 'finish').trim().slice(0, 80);
  const sessionKey = String(entry?.sessionKey || '').trim().slice(0, 120);
  if (!/^[a-z0-9-]{1,120}$/i.test(skillSlug) || !skillTitle || !/^[a-z0-9-]{8,120}$/i.test(sessionKey)) throw safeError('INVALID_COMPLETION');
  const existing = (await wixData.query(SKILL_COMPLETIONS).eq('memberId', entitlement.memberId).eq('sessionKey', sessionKey).limit(1).find({ suppressAuth:true })).items[0];
  if (existing) {
    if (existing.skillSlug !== skillSlug) throw safeError('SESSION_KEY_CONFLICT');
    return { ok:true, duplicate:true, recordId:existing._id, completedAt:existing.completedAt };
  }
  const completedAt = new Date();
  const saved = await wixData.insert(SKILL_COMPLETIONS, { memberId:entitlement.memberId, skillSlug, skillTitle, skillId:String(entry?.skillId || skillSlug).trim().slice(0,120), status:'completed', notes:completionType, sessionKey, completedAt }, { suppressAuth:true });
  return { ok:true, duplicate:false, recordId:saved._id, completedAt:saved.completedAt };
});
