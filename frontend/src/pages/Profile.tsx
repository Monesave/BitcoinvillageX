import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';
import type { Profile, Wallet } from '@shared/types';


// {
//   "id": "a855967d-5115-474d-9c46-94fdc7d30e5f",
//   "user_id": "d080b292-9fce-471c-a804-5cc5931eb975",
//   "balance_sats": 0,
//   "pending_balance_sats": 0,
//   "escrow_balance_sats": 0,
//   "total_earned_sats": 0,
//   "total_spent_sats": 0,
//   "created_at": "2025-12-13T15:25:35.624076+00:00",
//   "updated_at": "2025-12-13T15:25:35.624076+00:00"
// }

const Profile = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    location: '',
    avatarUrl: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
      loadWallet();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        const profileData = data as any; // Supabase returns database column names
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
        console.log(profileData)
        setFormData({
          username: profileData.username || '',
          displayName: profileData.display_name || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          avatarUrl: profileData.avatar_url || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWallet = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

      if (data) {
        const walletData = data as any;
        setWallet({
          id: walletData.id,
          userId: walletData.user_id,
          balanceSats: walletData.balance_sats,
          pendingBalanceSats: walletData.pending_balance_sats,
          escrowBalanceSats: walletData.escrow_balance_sats,
          totalEarnedSats: walletData.total_earned_sats,
          totalSpentSats: walletData.total_spent_sats,
        } as Wallet);

      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Type assertion needed due to Supabase TypeScript inference limitations
      const { data, error } = await (supabase
        .from('profiles') as any)
        .update({
          username: formData.username || null,
          display_name: formData.displayName || null,
          bio: formData.bio || null,
          location: formData.location || null,
          avatar_url: formData.avatarUrl || null,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data as Profile);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
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

  if (!profile) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-600">Unable to load your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Villager Profile</h1>

        {/* Profile Card */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName || profile.username || 'Profile'}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-bitcoin flex items-center justify-center text-white text-2xl font-bold">
                  {(profile.displayName || profile.username || 'V').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">
                  {profile.displayName || profile.username || 'Villager'}
                </h2>
                {profile.username && (
                  <p className="text-gray-600">@{profile.username}</p>
                )}
                {profile.isVerifiedVillager && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                    ✓ Verified Villager
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="btn btn-outline"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input"
                  placeholder="villager123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="input"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="input"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="input"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {profile.bio && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Bio</h3>
                  <p className="text-gray-900">{profile.bio}</p>
                </div>
              )}
              {profile.location && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Location</h3>
                  <p className="text-gray-900">{profile.location}</p>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Reputation</p>
                  <p className="text-2xl font-bold text-bitcoin">
                    {profile?.reputationScore?.toFixed(1) || '0.0'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold">{profile?.totalTransactions || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Volume</p>
                  <p className="text-2xl font-bold">
                    {(profile?.totalVolumeSats / 100_000_000).toFixed(4)} BTC
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="text-lg font-semibold">
                    {new Date(profile?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wallet Card */}
        {wallet && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Wallet Balance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-bitcoin">
                  {(wallet?.balanceSats / 100_000_000).toFixed(8)} BTC
                </p>
                <p className="text-sm text-gray-500">{wallet?.balanceSats?.toLocaleString()} sats</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-semibold">
                  {(wallet?.pendingBalanceSats / 100_000_000).toFixed(8)} BTC
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">In Escrow</p>
                <p className="text-2xl font-semibold">
                  {(wallet?.escrowBalanceSats / 100_000_000).toFixed(8)} BTC
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Earned</p>
                <p className="text-lg font-semibold">
                  {(wallet?.totalEarnedSats / 100_000_000).toFixed(4)} BTC
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-lg font-semibold">
                  {(wallet?.totalSpentSats / 100_000_000).toFixed(4)} BTC
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Verification Status */}
        {!profile.isVerifiedVillager && (
          <div className="card mt-8 bg-yellow-50 border-yellow-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Become a Verified Villager</h3>
            <p className="text-gray-700 mb-4">
              Get verified to unlock higher transaction limits and build more trust in the village.
            </p>
            <button className="btn btn-primary">
              Verify Now ($10 USD)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
