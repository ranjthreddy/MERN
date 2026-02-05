import { useEffect, useState } from "react";
import JournalForm from "./components/JournalForm";
import JournalList from "./components/JournalList";

function App() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");

  // LOAD from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("journalEntries"));
    if (saved) setEntries(saved);
  }, []);

  // SAVE to localStorage
  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  const addEntry = (text, mood) => {
    setEntries([
      {
        id: Date.now(),
        content: text,
        mood,
        date: new Date().toISOString().slice(0, 10),
      },
      ...entries,
    ]);
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const editEntry = (id, newText) => {
    setEntries(
      entries.map((e) =>
        e.id === id ? { ...e, content: newText } : e
      )
    );
  };

  const filteredEntries = entries.filter(
    (e) =>
      e.content.toLowerCase().includes(search.toLowerCase()) ||
      e.date.includes(search)
  );

  return (
    <div className="entries-list">
  {entries.length === 0 ? (
    <p className="empty-text">No entries yet 📝</p>
  ) : (
    entries.map((entry) => (
      <div className="journal-card" key={entry.id}>
        <h3>{entry.title}</h3>
        <p className="journal-content">{entry.content}</p>
        <span className="journal-mood">{entry.mood}</span>
        <span className="journal-date">{entry.date}</span>
      </div>
    ))
  )}
</div>

  );
}

export default App;

