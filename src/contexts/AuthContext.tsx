
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  guestLogin: (name: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('quizUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual Firebase auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0],
        email,
        isGuest: false
      };
      
      setUser(userData);
      localStorage.setItem('quizUser', JSON.stringify(userData));
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual Firebase auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        isGuest: false
      };
      
      setUser(userData);
      localStorage.setItem('quizUser', JSON.stringify(userData));
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const guestLogin = (name: string) => {
    const userData: User = {
      id: `guest_${Date.now()}`,
      name,
      isGuest: true
    };
    
    setUser(userData);
    localStorage.setItem('quizUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quizUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      guestLogin,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
