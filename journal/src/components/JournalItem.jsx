import { useState, useEffect, useRef } from "react";
import EmojiPicker from "./EmojiPicker";
import DrawingCanvas from "./DrawingCanvas";

function formatDate(date) {
  if (!date) return "";
  const d = date?.toDate ? date.toDate() : new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function JournalItem({
  entry,
  user,
  viewMode,
  unlockedSession,
  deleteEntry,
  updateEntry,
  archiveEntry,
  restoreEntry,
  lockEntry,
  unlockEntry,
}) {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(entry.title || "");
  const [content, setContent] = useState(entry.content || "");
  const [drawingUrl, setDrawingUrl] = useState(entry.drawingUrl || "");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const [emojiTarget, setEmojiTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setTitle(entry.title || "");
    setContent(entry.content || "");
    setDrawingUrl(entry.drawingUrl || "");
  }, [entry.id, entry.title, entry.content, entry.drawingUrl]);

  const insertEmoji = (emoji, target) => {
    if (target === "title") {
      const el = titleRef.current;
      if (el) {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const newVal = title.slice(0, start) + emoji + title.slice(end);
        setTitle(newVal);
        setTimeout(() => el.setSelectionRange(start + emoji.length, start + emoji.length), 0);
      } else setTitle((t) => t + emoji);
    } else {
      const el = contentRef.current;
      if (el) {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const newVal = content.slice(0, start) + emoji + content.slice(end);
        setContent(newVal);
        setTimeout(() => el.setSelectionRange(start + emoji.length, start + emoji.length), 0);
      } else setContent((c) => c + emoji);
    }
    setShowEmoji(false);
  };

  const saveEdit = () => {
    updateEntry({ ...entry, title, content, drawingUrl: drawingUrl || null });
    setEdit(false);
  };

  const cancelEdit = () => {
    setTitle(entry.title || "");
    setContent(entry.content || "");
    setDrawingUrl(entry.drawingUrl || "");
    setEdit(false);
  };

  const isArchive = viewMode === "archive";
  const isLocked = viewMode === "locked";

  return (
    <div className="journal-item">
      {edit ? (
        <div className="journal-item-edit">
          <div className="form-row-with-emoji">
            <input
              ref={titleRef}
              className="journal-item-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <button
              type="button"
              className="btn-emoji"
              onClick={() => {
                setEmojiTarget("title");
                setShowEmoji(true);
              }}
            >
              😀
            </button>
          </div>
          <div className="form-row-with-emoji">
            <textarea
              ref={contentRef}
              className="journal-item-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
            />
            <button
              type="button"
              className="btn-emoji"
              onClick={() => {
                setEmojiTarget("content");
                setShowEmoji(true);
              }}
            >
              😀
            </button>
          </div>
          {showEmoji && (
            <div className="emoji-picker-wrap">
              <EmojiPicker
                onSelect={(emoji) => insertEmoji(emoji, emojiTarget)}
                onClose={() => setShowEmoji(false)}
              />
            </div>
          )}
          <div className="form-drawing-row">
            <button type="button" className="btn btn-secondary btn-draw" onClick={() => setShowDrawing(true)}>
              ✏️ Add/change drawing
            </button>
            {drawingUrl && (
              <div className="form-drawing-preview">
                <img src={drawingUrl} alt="Drawing" />
                <button type="button" className="btn-remove-drawing" onClick={() => setDrawingUrl("")}>
                  Remove
                </button>
              </div>
            )}
          </div>
          <div className="journal-item-actions">
            <button type="button" onClick={saveEdit} className="btn btn-primary">
              Save
            </button>
            <button type="button" onClick={cancelEdit} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="journal-item-title">{entry.title}</h3>
          <div className="journal-item-meta">
            <span>Saved: {formatDate(entry.createdAt || entry.date)}</span>
            {entry.updatedAt && <span>Updated: {formatDate(entry.updatedAt)}</span>}
          </div>
          {entry.drawingUrl && (
            <div className="journal-item-drawing">
              <img src={entry.drawingUrl} alt="Drawing" />
            </div>
          )}
          <p className="journal-item-content">{entry.content}</p>
          <div className="journal-item-actions">
            <button type="button" onClick={() => setEdit(true)} className="btn btn-secondary">
              Edit
            </button>
            {!entry.archived && !entry.locked && (
              <button
                type="button"
                onClick={() => {
                  setActionLoading("archive");
                  archiveEntry(entry.id).finally(() => setActionLoading(null));
                }}
                className="btn btn-archive"
                disabled={!!actionLoading}
              >
                {actionLoading === "archive" ? "Archiving…" : "Archive"}
              </button>
            )}
            {entry.archived && (
              <button
                type="button"
                onClick={() => {
                  setActionLoading("restore");
                  restoreEntry(entry.id).finally(() => setActionLoading(null));
                }}
                className="btn btn-secondary"
                disabled={!!actionLoading}
              >
                {actionLoading === "restore" ? "Restoring…" : "Restore"}
              </button>
            )}
            {!entry.locked && !entry.archived && (
              <button
                type="button"
                onClick={() => {
                  setActionLoading("lock");
                  lockEntry(entry.id).finally(() => setActionLoading(null));
                }}
                className="btn btn-lock"
                disabled={!!actionLoading}
              >
                {actionLoading === "lock" ? "Locking…" : "🔒 Lock"}
              </button>
            )}
            {entry.locked && unlockedSession && (
              <button
                type="button"
                onClick={() => {
                  setActionLoading("unlock");
                  unlockEntry(entry.id).finally(() => setActionLoading(null));
                }}
                className="btn btn-secondary"
                disabled={!!actionLoading}
              >
                {actionLoading === "unlock" ? "Unlocking…" : "Unlock"}
              </button>
            )}
            <button type="button" onClick={() => deleteEntry(entry.id)} className="btn btn-danger">
              Delete
            </button>
          </div>
        </>
      )}

      {showDrawing && (
        <div className="drawing-modal-overlay" onClick={() => setShowDrawing(false)}>
          <div className="drawing-modal-inner" onClick={(e) => e.stopPropagation()}>
            <DrawingCanvas
              user={user}
              onSave={(url) => {
                setDrawingUrl(url);
                setShowDrawing(false);
              }}
              onClose={() => setShowDrawing(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
