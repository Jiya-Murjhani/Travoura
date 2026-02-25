import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, username?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("travoura_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("travoura_user");
      }
    }
  }, []);

  const login = (email: string, username?: string) => {
    // Extract username from email if not provided (part before @)
    const userUsername = username || email.split("@")[0];
    
    const userData: User = {
      email,
      username: userUsername,
    };
    
    setUser(userData);
    localStorage.setItem("travoura_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("travoura_user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};




