import { createContext, useState } from "react";
import { jwtDecode } from 'jwt-decode'; 


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");

  let user = null;
  try {
    if (token) {
      user = jwtDecode(token);
      console.log("Decoded user:", user); 
    }
  } catch (error) {
    console.error("Invalid token");
    localStorage.removeItem("token");
  }

  const [auth, setAuth] = useState({ user, token });

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    console.log("Decoded token at login:", decoded); 
    setAuth({ user: decoded, token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
