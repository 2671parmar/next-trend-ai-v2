// frontend/src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  subscription: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const isUpdating = useRef(false);
  const sessionCheckRef = useRef<number | null>(null);

  const updateAuthState = async (session: any) => {
    if (isUpdating.current) {
      console.log('Update already in progress, skipping');
      return;
    }

    isUpdating.current = true;
    console.log('Updating auth state, session:', session?.user?.id);

    try {
      setUser(session?.user ?? null);
      if (session?.user) {
        const [profileData, subscriptionData] = await Promise.allSettled([
          fetchProfile(session.user.id),
          fetchSubscription(session.user.id),
        ]);
        setProfile(profileData.status === 'fulfilled' ? profileData.value : null);
        setSubscription(subscriptionData.status === 'fulfilled' ? subscriptionData.value : null);
      } else {
        setProfile(null);
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error updating auth state:', error);
      setUser(null);
      setProfile(null);
      setSubscription(null);
    } finally {
      setLoading(false);
      isUpdating.current = false;
      console.log('Auth state update completed, loading:', loading);
    }
  };

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session?.user?.id !== user?.id) {
        console.log('Session changed, updating state');
        await updateAuthState(session);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing auth...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        await updateAuthState(session);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setProfile(null);
        setSubscription(null);
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up periodic session check
    sessionCheckRef.current = window.setInterval(checkSession, 5000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      await updateAuthState(session);
    });

    return () => {
      subscription.unsubscribe();
      if (sessionCheckRef.current) {
        clearInterval(sessionCheckRef.current);
      }
    };
  }, []);

  async function fetchProfile(userId: string) {
    console.log('Fetching profile for user:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async function fetchSubscription(userId: string) {
    console.log('Fetching subscription for user:', userId);
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('Signing in with:', email);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        const { data: { session } } = await supabase.auth.getSession();
        await updateAuthState(session);
      }
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    console.log('Signing out...');
    try {
      // Clear local state first
      setUser(null);
      setProfile(null);
      setSubscription(null);
      setLoading(false);

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear session storage
      sessionStorage.clear();
      localStorage.clear();

      // Force reload all tabs
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (data: any) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;
      setProfile({ ...profile, ...data });
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const value = {
    user,
    profile,
    subscription,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}