# Safe rollback plan

The historical bridge commit `2070275` is recoverable but must not be used as a backend rollback target because it restores the anonymous `client:` fallback.

For a production rollback:

1. Keep the hardened backend from `987b75b` (or a later hardened commit).
2. If needed, restore only the previously published frontend shell, Daily Check-In file, and Wix page bridge state.
3. Do not restore the legacy anonymous fallback.
4. Do not delete, update, or migrate the existing anonymous test record.
5. Reconcile any uncertain write through the authenticated read-only `list` path before retrying.

Recoverable references:

- Hardened release: `987b75b`
- Historical bridge tag: `bridge-rollback-2070275`
- Hardened release tag: `bridge-release-987b75b`
