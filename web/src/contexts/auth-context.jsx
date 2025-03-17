import { useContext, createContext, useState, useEffect } from "react";
import { profile } from "../services/api-service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      profile()
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem("authToken");
          setUser(null);
        });
    }
  }, []);

  function login(user) {
    localStorage.setItem("authToken", user.token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("authToken");
    setUser(null);
  }

  const contextData = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}