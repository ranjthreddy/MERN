import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 FORCE LOGOUT ON EVERY APP LOAD
    signOut(auth).then(() => {
      setUser(null);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
