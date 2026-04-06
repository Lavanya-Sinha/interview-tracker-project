import { createContext, useState } from "react";

 const AuthContext = createContext();
 
export const AuthProvider = ({ children }) => {

const [token, setToken] = useState(() => localStorage.getItem("token"));
const [user, setUser] = useState(() => localStorage.getItem("user"));

  const login = (token, userEmail) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", userEmail);

    setToken(token);
    setUser(userEmail);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
  
export default AuthContext