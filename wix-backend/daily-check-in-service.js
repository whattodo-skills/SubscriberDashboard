import { getCheckins, getValues, getStacks, getArchivedStacks, getPracticeHistory, getPendingLoop, saveCheckin, previewRecommendations, startLoop, updateStatus, restartLoop, completeLoop, getReflection } from './http-functions';
import { learningResourcesForMember } from './learning-resources';

export async function listForMember(memberId, access = {}) {
  const [checkins, values, stacks, archivedStacks, practiceHistory, pendingLoop] = await Promise.all([getCheckins(memberId), getValues(memberId), getStacks(memberId), getArchivedStacks(memberId), getPracticeHistory(memberId), getPendingLoop(memberId)]);
  const learningResources = learningResourcesForMember({ pendingLoop, practiceHistory, stacks, archivedStacks, paid: access.paid });
  return { checkins, values, stacks, archivedStacks, practiceHistory, recentActivity: practiceHistory, pendingLoop, learningResources };
}
export function saveCheckinForMember(memberId, entry) { return saveCheckin(memberId, entry); }
export function previewForMember(entry) { return previewRecommendations(entry); }
export function startForMember(memberId, entry) { return startLoop(memberId, entry); }
export function markSkillOpenedForMember(memberId, entry) { return updateStatus(memberId, entry.checkinId, 'learn_pending'); }
export function completeForMember(memberId, entry) { return completeLoop(memberId, entry, false); }
export function dismissForMember(memberId, entry) { return completeLoop(memberId, entry, true); }
export function restartForMember(memberId, entry) { return restartLoop(memberId, entry.checkinId); }
export function getReflectionForMember(memberId, entry) { return getReflection(memberId, entry.checkinId); }
