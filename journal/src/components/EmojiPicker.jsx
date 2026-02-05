import { useState } from "react";

const EMOJI_SETS = [
  ["😀", "😊", "🥲", "😍", "🤩", "😎", "🥳", "😢", "😭", "😡", "🤔", "👍", "❤️", "🔥", "✨", "🌟", "📔", "📝", "🔒", "📌"],
  ["🌸", "🌺", "🌻", "🍀", "🌈", "☀️", "🌙", "⭐", "💡", "🎯", "🏠", "✈️", "🎉", "🎈", "🎁", "📅", "⏰", "🔔", "💬", "📷"],
];

export default function EmojiPicker({ onSelect, onClose }) {
  const [setIndex, setSetIndex] = useState(0);
  const sets = EMOJI_SETS;

  return (
    <div className="emoji-picker">
      <div className="emoji-picker-header">
        <span className="emoji-picker-title">Insert emoji</span>
        <button type="button" className="emoji-picker-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <div className="emoji-picker-tabs">
        {sets.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`emoji-picker-tab ${setIndex === i ? "active" : ""}`}
            onClick={() => setSetIndex(i)}
          >
            {i === 0 ? "😀" : "🌸"}
          </button>
        ))}
      </div>
      <div className="emoji-picker-grid">
        {sets[setIndex].map((emoji, i) => (
          <button
            key={i}
            type="button"
            className="emoji-picker-emoji"
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
