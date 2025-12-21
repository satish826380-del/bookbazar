import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, role: UserRole, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type ProfileRow = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  phone?: string | null;
  created_at: string;
};

const mapProfileToUser = (profile: ProfileRow): User => ({
  id: profile.id,
  email: profile.email,
  name: profile.name ?? profile.email,
  role: profile.role,
  phone: profile.phone ?? undefined,
  createdAt: profile.created_at,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Failed to get session', error);
        setIsLoading(false);
        return;
      }

      const sessionUser = data.session?.user;
      if (sessionUser?.id) {
        await loadUser(sessionUser.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user;
      if (sessionUser?.id) {
        await loadUser(sessionUser.id);
      } else {
        setUser(null);
      }
    });

    init();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const loadUser = async (userId: string): Promise<boolean> => {
    try {

      const queryPromise = supabase
        .from('profiles')
        .select('id, email, name, role, phone, created_at')
        .eq('id', userId)
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile query timed out after 10 seconds')), 10000)
      );

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn(`[loadUser] No profile found for user ID: ${userId}`);
        } else {
          console.error('[loadUser] Database error:', error.message);
        }
        setUser(null);
        setIsLoading(false);
        return false;
      }

      if (!data) {
        console.warn(`[loadUser] No data returned for user ID: ${userId}`);
        setUser(null);
        setIsLoading(false);
        return false;
      }

      const mappedUser = mapProfileToUser(data as ProfileRow);
      setUser(mappedUser);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('[loadUser] Error:', err.message || err);
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('[login] Auth error:', error.message);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'User not found' };
      }

      const loadResult = await loadUser(data.user.id);

      if (!loadResult) {
        console.error('[login] Profile load failed');
        return { success: false, error: 'Profile not found. Please ensure you have signed up correctly.' };
      }

      console.log('[login] Full login process complete');
      return { success: true };
    } catch (err) {
      console.error('[login] Unexpected exception:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Login failed' };
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Signup auth error:', error);
        return { success: false, error: error.message };
      }

      const userId = data.user?.id;
      if (!userId) {
        console.error('No user ID returned from signup');
        return { success: false, error: 'No user returned from Supabase' };
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        email,
        name,
        role,
        phone,
      });

      if (profileError) {
        console.error('Profile insert error:', profileError);
        console.error('Error details:', JSON.stringify(profileError, null, 2));
        return { success: false, error: `Failed to create profile: ${profileError.message}` };
      }

      const loadResult = await loadUser(userId);
      if (!loadResult) {
        return { success: false, error: 'Account created but failed to load profile' };
      }

      return { success: true };
    } catch (err) {
      console.error('Unexpected signup error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
