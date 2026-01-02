'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthSession } from '@/types/auth';

interface AuthContextType {
  session: AuthSession | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionData = localStorage.getItem('adminSession');
    if (sessionData) {
      try {
        setSession(JSON.parse(sessionData));
      } catch {
        localStorage.removeItem('adminSession');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const newSession: AuthSession = {
        username: data.username,
        role: data.role,
        loginTime: new Date().toISOString(),
      };

      setSession(newSession);
      localStorage.setItem('adminSession', JSON.stringify(newSession));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem('adminSession');
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, login, logout, isAuthenticated: !!session }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
