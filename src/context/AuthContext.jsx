import { createContext, useContext, useState, useEffect } from "react";

const ADMIN_CREDENTIALS = { username: "admin", password: "admin123" };
const STORAGE_KEY = "lumiere_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Restore session from localStorage on init
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persist user to localStorage on every change
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const loginAsAdmin = (username, password) => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setUser({ username: "admin", name: "Администратор", role: "admin" });
      return true;
    }
    return false;
  };

  const loginAsUser = (userData) => {
    setUser({
      username: userData.username,
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email || null,
      role: "user",
      token: userData.token || null,
    });
  };

  const logout = () => setUser(null);

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoggedIn, loginAsAdmin, loginAsUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
