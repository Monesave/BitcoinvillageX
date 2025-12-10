import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';

export const useAuth = () => {
  const { user, loading, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  };
};

