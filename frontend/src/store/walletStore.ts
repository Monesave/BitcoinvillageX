import { create } from 'zustand';
import type { Wallet } from '@shared/types';

interface WalletState {
  wallet: Wallet | null;
  loading: boolean;
  setWallet: (wallet: Wallet | null) => void;
  setLoading: (loading: boolean) => void;
  refreshWallet: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  loading: false,
  setWallet: (wallet) => set({ wallet }),
  setLoading: (loading) => set({ loading }),
  refreshWallet: async () => {
    const { useAuthStore } = await import('./authStore');
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true });
    try {
      const { supabase } = await import('../services/supabase');
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      set({ wallet: data as Wallet, loading: false });
    } catch (error) {
      console.error('Error refreshing wallet:', error);
      set({ loading: false });
    }
  },
}));

