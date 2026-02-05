import { useState, useRef } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import EmojiPicker from "./EmojiPicker";
import DrawingCanvas from "./DrawingCanvas";

function JournalForm({ user }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [drawingUrl, setDrawingUrl] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const [emojiTarget, setEmojiTarget] = useState(null); // 'title' | 'content'
  const titleRef = useRef(null);
  const contentRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    const now = serverTimestamp();
    await addDoc(collection(db, "journals"), {
      title,
      content,
      uid: user.uid,
      date: now,
      createdAt: now,
      updatedAt: now,
      archived: false,
      locked: false,
      ...(drawingUrl && { drawingUrl }),
    });
    setTitle("");
    setContent("");
    setDrawingUrl("");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-row-with-emoji">
        <input
          ref={titleRef}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="button"
          className="btn-emoji"
          onClick={() => {
            setEmojiTarget("title");
            setShowEmoji(true);
          }}
          title="Insert emoji"
        >
          😀
        </button>
      </div>
      <div className="form-row-with-emoji">
        <textarea
          ref={contentRef}
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="button"
          className="btn-emoji"
          onClick={() => {
            setEmojiTarget("content");
            setShowEmoji(true);
          }}
          title="Insert emoji"
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
        <button
          type="button"
          className="btn btn-secondary btn-draw"
          onClick={() => setShowDrawing(true)}
        >
          ✏️ Add drawing
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
      <button type="submit">Add Entry</button>

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
    </form>
  );
}

export default JournalForm;
