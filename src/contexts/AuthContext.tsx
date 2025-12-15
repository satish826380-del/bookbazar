import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, role: UserRole, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'bookstore_users';
const CURRENT_USER_KEY = 'bookstore_current_user';

// Initialize with admin account
const initializeUsers = () => {
  const existing = localStorage.getItem(USERS_KEY);
  if (!existing) {
    const adminUser: User = {
      id: 'admin-1',
      email: 'admin@bookstore.com',
      name: 'Admin',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify({ 'admin@bookstore.com': { ...adminUser, password: 'admin123' } }));
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeUsers();
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const userData = users[email];
    
    if (!userData) {
      return { success: false, error: 'User not found' };
    }
    
    if (userData.password !== password) {
      return { success: false, error: 'Invalid password' };
    }
    
    const { password: _, ...userWithoutPassword } = userData;
    setUser(userWithoutPassword);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return { success: true };
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    
    if (users[email]) {
      return { success: false, error: 'Email already registered' };
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      phone,
      createdAt: new Date().toISOString(),
    };
    
    users[email] = { ...newUser, password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
