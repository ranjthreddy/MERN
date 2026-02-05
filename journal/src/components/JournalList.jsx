import JournalItem from "./JournalItem";

function JournalList({
  user,
  entries,
  search,
  viewMode,
  unlockedSession,
  lockPinHash,
  deleteEntry,
  updateEntry,
  archiveEntry,
  restoreEntry,
  lockEntry,
  unlockEntry,
  onOpenSetPin,
  onOpenUnlock,
}) {
  const filteredEntries = entries.filter(
    (entry) =>
      (entry.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (entry.content || "").toLowerCase().includes(search.toLowerCase())
  );

  if (viewMode === "locked" && !unlockedSession) {
    return (
      <div className="list list-locked-placeholder">
        <p>🔒 Locked folder. Set a PIN or enter PIN to view.</p>
        <div className="locked-placeholder-actions">
          {lockPinHash ? (
            <button type="button" className="btn btn-primary" onClick={onOpenUnlock}>
              Enter PIN
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onOpenSetPin}>
              Set PIN
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="list">
      {filteredEntries.length === 0 ? (
        <p>
          {viewMode === "archive"
            ? "No archived entries."
            : viewMode === "locked"
              ? "No locked entries."
              : "No matching journal entries found."}
        </p>
      ) : (
        filteredEntries.map((entry) => (
          <JournalItem
            key={entry.id}
            entry={entry}
            user={user}
            viewMode={viewMode}
            unlockedSession={unlockedSession}
            deleteEntry={deleteEntry}
            updateEntry={updateEntry}
            archiveEntry={archiveEntry}
            restoreEntry={restoreEntry}
            lockEntry={lockEntry}
            unlockEntry={unlockEntry}
          />
        ))
      )}
    </div>
  );
}

export default JournalList;
