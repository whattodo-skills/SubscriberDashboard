const REQUIRED = 14;

function day(value) {
  const match = /^\d{4}-\d{2}-\d{2}/.exec(String(value || ''));
  return match ? match[0] : '';
}

export function calculateMood(checkins = []) {
  const byDate = new Map();
  checkins.filter(item => item && item.status !== 'draft' && item.status !== 'deleted' && day(item.date) && item.emotionId)
    .sort((a, b) => `${day(b.date)}|${b.completedAt || b.updatedAt || ''}`.localeCompare(`${day(a.date)}|${a.completedAt || a.updatedAt || ''}`))
    .forEach(item => { if (!byDate.has(day(item.date))) byDate.set(day(item.date), item); });
  const eligible = [...byDate.values()];
  const window = eligible.slice(0, REQUIRED);
  const base = { eligibleCheckInCount: eligible.length, remainingCheckIns: Math.max(0, REQUIRED - eligible.length), includedCheckInCount: window.length, emotionCounts: {}, leaderEmotionIds: [], currentMoodEmotionId: null, winningCount: null, windowStart: null, windowEnd: null };
  if (window.length < REQUIRED) return { ...base, status: 'building_history', displayLabel: 'Building your mood pattern' };
  const labels = {};
  window.forEach(item => { base.emotionCounts[item.emotion] = (base.emotionCounts[item.emotion] || 0) + 1; labels[item.emotionId] = item.emotion; });
  const idCounts = {};
  window.forEach(item => { idCounts[item.emotionId] = (idCounts[item.emotionId] || 0) + 1; });
  const max = Math.max(...Object.values(idCounts));
  const leaders = Object.keys(idCounts).filter(id => idCounts[id] === max).sort();
  const dates = window.map(item => day(item.date)).sort();
  const shared = { ...base, leaderEmotionIds: leaders, leaderEmotionLabels: leaders.map(id => labels[id]), winningCount: max, windowStart: dates[0], windowEnd: dates[dates.length - 1] };
  return leaders.length === 1 ? { ...shared, status: 'ready', currentMoodEmotionId: leaders[0], displayLabel: labels[leaders[0]] } : { ...shared, status: 'tied', displayLabel: 'Mixed mood' };
}
