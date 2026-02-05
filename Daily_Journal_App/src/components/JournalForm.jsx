import { useState } from "react";

function JournalForm({ onAddEntry }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("😊");

  const submitHandler = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddEntry(text, mood);
    setText("");
    setMood("😊");
  };

  return (
    <form className="journal-form" onSubmit={submitHandler}>
  <textarea
    rows="3"
    placeholder="Write your thoughts..."
    value={text}
    onChange={(e) => setText(e.target.value)}
  />

  <div className="form-actions">
    <select value={mood} onChange={(e) => setMood(e.target.value)}>
      <option>😊</option>
      <option>😐</option>
      <option>😢</option>
    </select>

    <button className="add-btn">Add Entry</button>
  </div>
</form>

  );
}

export default JournalForm;
