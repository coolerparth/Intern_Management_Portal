import { createContext, useContext, useState } from "react";
import { mockUsers } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    const found = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setUser(found);
      return { success: true, user: found };
    }
    return { success: false, message: "Invalid email or password" };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
