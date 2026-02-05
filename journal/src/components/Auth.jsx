import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSignupSuccess(false);
  };

  const switchMode = () => {
    setIsLogin((prev) => !prev);
    clearForm();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCred.user);
    } catch (err) {
      setError(err.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await signOut(auth);
      setSignupSuccess(true);
      setIsLogin(true);
      setConfirmPassword("");
      setError("");
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    if (!forgotEmail.trim()) {
      setForgotError("Enter your email.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      setForgotSent(true);
    } catch (err) {
      setForgotError(err.message || "Failed to send reset email.");
    }
  };

  const handleSubmit = isLogin ? handleLogin : handleSignup;

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo-block">
          <span className="auth-logo-icon">📔</span>
          <h1 className="auth-logo-text">Journal</h1>
        </div>
        <p className="auth-subtitle">
          {isLogin ? "Log in" : "Sign up"}
        </p>
        {signupSuccess && (
          <p className="auth-success-msg">Account created. Please log in.</p>
        )}
        {isLogin && (
          <p className="auth-new-user">
            New user? <button type="button" onClick={switchMode} className="auth-link-inline">Sign up</button>
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
            autoComplete="email"
          />

          <label className="auth-label">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
            minLength={6}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
          {isLogin && (
            <button
              type="button"
              className="auth-forgot-link"
              onClick={() => setShowForgot(true)}
            >
              Forgot password?
            </button>
          )}

          {!isLogin && (
            <>
              <label className="auth-label">Confirm password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Please wait…" : isLogin ? "Log in" : "Sign up"}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button type="button" onClick={switchMode} className="auth-link">
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>

      {showForgot && (
        <div className="auth-modal-overlay" onClick={() => setShowForgot(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="auth-modal-title">Forgot password</h3>
            {forgotSent ? (
              <>
                <p className="auth-modal-text">
                  Check your email for a link to reset your password.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowForgot(false);
                    setForgotSent(false);
                    setForgotEmail("");
                  }}
                >
                  OK
                </button>
              </>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <label className="auth-label">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="auth-input"
                  autoComplete="email"
                />
                {forgotError && <p className="auth-error">{forgotError}</p>}
                <div className="auth-modal-actions">
                  <button type="submit" className="btn btn-primary">
                    Send reset link
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForgot(false);
                      setForgotError("");
                      setForgotEmail("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Auth;
