import { useState } from "react";

async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function LockedPinModal({ mode, userPinHash, onSetPin, onUnlock, onClose }) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isSetMode = mode === "set";
  const hasPin = !!userPinHash;

  const handleSetPin = async (e) => {
    e.preventDefault();
    setError("");
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits.");
      return;
    }
    if (pin !== confirmPin) {
      setError("PINs do not match.");
      return;
    }
    setLoading(true);
    try {
      const hash = await hashPin(pin);
      await onSetPin(hash);
      setSuccess(true);
      setTimeout(() => onClose(), 800);
    } catch (err) {
      setError(err.message || "Failed to set PIN. Check Firestore rules for users collection.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError("");
    if (!pin.trim()) {
      setError("Enter your PIN.");
      return;
    }
    setLoading(true);
    try {
      const hash = await hashPin(pin);
      if (hash !== userPinHash) {
        setError("Wrong PIN.");
        setLoading(false);
        return;
      }
      onUnlock();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to verify.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal locked-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="auth-modal-title">
          {isSetMode ? "Set lock PIN" : hasPin ? "Enter PIN" : "Set PIN to use locked folder"}
        </h3>
        {isSetMode || !hasPin ? (
          success ? (
            <p className="auth-success-msg">PIN saved.</p>
          ) : (
            <form onSubmit={handleSetPin}>
              <label className="auth-label">PIN (min 4 digits)</label>
              <input
                type="password"
                inputMode="numeric"
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
                className="auth-input"
                maxLength={8}
                disabled={loading}
              />
              <label className="auth-label">Confirm PIN</label>
              <input
                type="password"
                inputMode="numeric"
                placeholder="••••"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
                className="auth-input"
                maxLength={8}
                disabled={loading}
              />
              {error && <p className="auth-error">{error}</p>}
              <div className="auth-modal-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving…" : "Set PIN"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
              </div>
            </form>
          )
        ) : (
          <form onSubmit={handleUnlock}>
            <label className="auth-label">PIN</label>
            <input
              type="password"
              inputMode="numeric"
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
              className="auth-input"
              maxLength={8}
              autoFocus
            />
            {error && <p className="auth-error">{error}</p>}
            <div className="auth-modal-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Checking…" : "Unlock"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
