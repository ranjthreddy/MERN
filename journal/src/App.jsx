import { useEffect, useState } from "react";
import JournalForm from "./components/JournalForm";
import JournalList from "./components/JournalList";
import Auth from "./components/Auth";
import LockedPinModal from "./components/LockedPinModal";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const VIEW_ENTRIES = "entries";
const VIEW_ARCHIVE = "archive";
const VIEW_LOCKED = "locked";

function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState(VIEW_ENTRIES);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lockPinHash, setLockPinHash] = useState(null);
  const [unlockedSession, setUnlockedSession] = useState(false);
  const [lockedPinModal, setLockedPinModal] = useState(null); // 'set' | 'unlock' | null

  // 🔐 AUTH: Sign out on load so user must log in every time (existing or new)
  useEffect(() => {
    let unsub;
    const setup = () => {
      unsub = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthReady(true);
        if (!currentUser) setUnlockedSession(false);
      });
    };
    signOut(auth).then(setup).catch(setup);
    return () => {
      if (unsub) unsub();
    };
  }, []);

  // 🔥 FETCH JOURNAL ENTRIES
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, "journals"), (snapshot) => {
      const data = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((entry) => entry.uid === user.uid);
      setEntries(data);
    });
    return () => unsub();
  }, [user]);

  // 👤 FETCH USER LOCK PIN
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid))
      .then((snap) => {
        if (snap.exists() && snap.data().lockPinHash) {
          setLockPinHash(snap.data().lockPinHash);
        } else {
          setLockPinHash(null);
        }
      })
      .catch(() => setLockPinHash(null));
  }, [user]);

  const activeEntries = entries.filter((e) => !e.archived && !e.locked);
  const archivedEntries = entries.filter((e) => e.archived);
  const lockedEntries = entries.filter((e) => e.locked);

  const displayEntries =
    viewMode === VIEW_ARCHIVE
      ? archivedEntries
      : viewMode === VIEW_LOCKED
        ? unlockedSession
          ? lockedEntries
          : []
        : activeEntries;

  const deleteEntry = async (id) => {
    await deleteDoc(doc(db, "journals", id));
  };

  const updateEntry = async (updatedEntry) => {
    const ref = doc(db, "journals", updatedEntry.id);
    const payload = {
      title: updatedEntry.title,
      content: updatedEntry.content,
      updatedAt: serverTimestamp(),
    };
    if (updatedEntry.archived !== undefined) payload.archived = updatedEntry.archived;
    if (updatedEntry.locked !== undefined) payload.locked = updatedEntry.locked;
    if (updatedEntry.drawingUrl !== undefined) payload.drawingUrl = updatedEntry.drawingUrl;
    await updateDoc(ref, payload);
  };

  const archiveEntry = async (id) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) await updateEntry({ ...entry, archived: true });
  };

  const restoreEntry = async (id) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) await updateEntry({ ...entry, archived: false });
  };

  const lockEntry = async (id) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) await updateEntry({ ...entry, locked: true });
  };

  const unlockEntry = async (id) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) await updateEntry({ ...entry, locked: false });
  };

  const handleSetLockPin = async (hash) => {
    await setDoc(doc(db, "users", user.uid), { lockPinHash: hash }, { merge: true });
    setLockPinHash(hash);
  };

  const handleUnlockLocked = () => {
    setUnlockedSession(true);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUnlockedSession(false);
  };

  if (!authReady) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">📔</span>
          <h1 className="sidebar-logo-text">Journal</h1>
        </div>
        <div className="sidebar-stats">
          <span className="sidebar-stat-label">Entries</span>
          <span className="sidebar-stat-value">{activeEntries.length}</span>
        </div>
        <div className="sidebar-stats">
          <span className="sidebar-stat-label">Archived</span>
          <span className="sidebar-stat-value">{archivedEntries.length}</span>
        </div>
        <div className="sidebar-stats">
          <span className="sidebar-stat-label">Locked</span>
          <span className="sidebar-stat-value">{lockedEntries.length}</span>
        </div>
        <button type="button" onClick={logout} className="btn btn-logout">
          Log out
        </button>
      </aside>

      <main className="app-main">
        <nav className="app-menu-bar" aria-label="Main navigation">
          <button
            type="button"
            className="menu-bar-hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
          {menuOpen && (
            <>
              <div className="menu-bar-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />
              <div className="menu-bar-dropdown">
                <button
                  type="button"
                  className={`menu-bar-item ${viewMode === VIEW_ENTRIES ? "active" : ""}`}
                  onClick={() => { setViewMode(VIEW_ENTRIES); setMenuOpen(false); }}
                >
                  Entries
                </button>
                <button
                  type="button"
                  className={`menu-bar-item ${viewMode === VIEW_ARCHIVE ? "active" : ""}`}
                  onClick={() => { setViewMode(VIEW_ARCHIVE); setMenuOpen(false); }}
                >
                  Archive
                </button>
                <button
                  type="button"
                  className={`menu-bar-item ${viewMode === VIEW_LOCKED ? "active" : ""}`}
                  onClick={() => {
                    setViewMode(VIEW_LOCKED);
                    setMenuOpen(false);
                    if (!unlockedSession && lockPinHash) setLockedPinModal("unlock");
                    if (!lockPinHash) setLockedPinModal("set");
                  }}
                >
                  Locked
                </button>
              </div>
            </>
          )}
        </nav>

        <div className="app-search">
          <input
            type="text"
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            aria-label="Search entries"
          />
        </div>

        {viewMode === VIEW_ENTRIES && <JournalForm user={user} />}

        <JournalList
          user={user}
          entries={displayEntries}
          search={search}
          viewMode={viewMode}
          unlockedSession={unlockedSession}
          lockPinHash={lockPinHash}
          deleteEntry={deleteEntry}
          updateEntry={updateEntry}
          archiveEntry={archiveEntry}
          restoreEntry={restoreEntry}
          lockEntry={lockEntry}
          unlockEntry={unlockEntry}
          onOpenSetPin={() => setLockedPinModal("set")}
          onOpenUnlock={() => setLockedPinModal("unlock")}
        />
      </main>

      {lockedPinModal && (
        <LockedPinModal
          mode={lockedPinModal}
          userPinHash={lockPinHash}
          onSetPin={handleSetLockPin}
          onUnlock={handleUnlockLocked}
          onClose={() => setLockedPinModal(null)}
        />
      )}
    </div>
  );
}

export default App;
