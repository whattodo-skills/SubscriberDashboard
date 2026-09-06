export function createCheckinPersistence({ findOwned, insert, listHistory, normalize, matches }) {
  if (![findOwned, insert, listHistory, normalize, matches].every(value => typeof value === 'function')) {
    throw new Error('invalid_checkin_persistence_adapter');
  }

  return async function persistCheckin({ memberId, submissionId, record }) {
    const existing = await findOwned(memberId, submissionId);
    if (existing) {
      if (!matches(existing, record)) throw new Error('idempotency_conflict');
      return {
        checkinId: existing._id,
        savedRecord: normalize(existing),
        checkins: await listHistory(memberId),
        idempotentReplay: true
      };
    }

    let saved;
    let idempotentReplay = false;
    try {
      saved = await insert({ ...record, _id: submissionId, submissionId, memberId });
    } catch (error) {
      const raced = await findOwned(memberId, submissionId);
      if (!raced) throw error;
      if (!matches(raced, record)) throw new Error('idempotency_conflict');
      saved = raced;
      idempotentReplay = true;
    }

    return {
      checkinId: saved._id,
      savedRecord: normalize(saved),
      checkins: await listHistory(memberId),
      idempotentReplay
    };
  };
}
