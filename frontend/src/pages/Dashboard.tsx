import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';
import type { Profile, Wallet, Transaction } from '@shared/types';
import { formatSats, formatDate } from '@shared/utils';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Load profile
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        const profileData = data as any;
        setProfile({
          id: profileData.id,
          username: profileData.username,
          displayName: profileData.display_name,
          bio: profileData.bio,
          location: profileData.location,
          avatarUrl: profileData.avatar_url,
          isVerifiedVillager: profileData.is_verified_villager,
          reputationScore: profileData.reputation_score,
          totalTransactions: profileData.total_transactions,
          totalVolumeSats: profileData.total_volume_sats,
          createdAt: profileData.created_at,
          updatedAt: profileData.updated_at,
        } as Profile);
      }

      // Load wallet
      const { data: walletData } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (walletData) {
        const _walletData = walletData as any;
        setWallet({
          id: _walletData.id,
          userId: _walletData.user_id,
          balanceSats: _walletData.balance_sats,
          pendingBalanceSats: _walletData.pending_balance_sats,
          escrowBalanceSats: _walletData.escrow_balance_sats,
          totalEarnedSats: _walletData.total_earned_sats,
          totalSpentSats: _walletData.total_spent_sats,
        } as Wallet);
      }

      // Load recent transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactions) {
        setRecentTransactions(transactions as Transaction[]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bitcoin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Welcome Section */}
      {profile && (
        <div className="card mb-8 bg-gradient-to-r from-bitcoin to-orange-500 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {profile.displayName || profile.username || 'Villager'}!
          </h2>
          <p className="opacity-90">
            {profile.isVerifiedVillager ? '✓ Verified Villager' : 'Join the village and start trading with Bitcoin'}
          </p>
        </div>
      )}

      {/* Wallet Summary */}
      {wallet && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Available Balance</p>
            <p className="text-3xl font-bold text-bitcoin">
              {(wallet.balanceSats / 100_000_000).toFixed(8)} BTC
            </p>
            <p className="text-sm text-gray-500 mt-1">{formatSats(wallet.balanceSats)}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Total Earned</p>
            <p className="text-3xl font-bold text-green-600">
              {(wallet.totalEarnedSats / 100_000_000).toFixed(4)} BTC
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Reputation Score</p>
            <p className="text-3xl font-bold text-bitcoin">
              {profile?.reputationScore?.toFixed(1) || '0.0'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {profile?.totalTransactions || 0} transactions
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/marketplace" className="btn btn-outline text-center">
            Browse Marketplace
          </Link>
          <Link to="/services" className="btn btn-outline text-center">
            Find Services
          </Link>
          <Link to="/bounties" className="btn btn-outline text-center">
            View Bounties
          </Link>
          <Link to="/crowdfunding" className="btn btn-outline text-center">
            Support Campaigns
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <Link to="/transactions" className="text-bitcoin hover:underline text-sm">
            View All
          </Link>
        </div>
        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
                      {tx.transactionType.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatSats(tx.amountSats)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(tx.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions yet</p>
            <p className="text-sm mt-2">Start trading to see your transaction history</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
