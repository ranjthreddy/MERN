import { useState } from "react";

function JournalList({ entries, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  return (
    <>
      {entries.length === 0 && (
        <p className="text-center text-gray-500">
          No entries yet 📝
        </p>
      )}

      {entries.length === 0 && (
  <p className="empty-text">No entries yet 📝</p>
)}

{entries.map((entry) => (
  <div className="journal-card" key={entry.id}>
    <div className="journal-header">
      <span>{entry.date}</span>
      <span>{entry.mood}</span>
    </div>

    {editingId === entry.id ? (
      <>
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
        <button
          className="save-btn"
          onClick={() => {
            onEdit(entry.id, editText);
            setEditingId(null);
          }}
        >
          Save
        </button>
      </>
    ) : (
      <p className="journal-content">{entry.content}</p>
    )}

    <div className="card-actions">
      <button
        className="edit-btn"
        onClick={() => {
          setEditingId(entry.id);
          setEditText(entry.content);
        }}
      >
        ✏ Edit
      </button>

      <button
        className="delete-btn"
        onClick={() => onDelete(entry.id)}
      >
        ❌ Delete
      </button>
    </div>
  </div>
))}

    </>
  );
}

export default JournalList;
