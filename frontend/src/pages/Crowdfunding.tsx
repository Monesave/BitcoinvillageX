import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatSats } from '@shared/utils';

interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  goal_sats: number;
  current_sats: number;
  goal_usd?: number;
  current_usd?: number;
  images?: string[];
  video_url?: string;
  deadline?: string;
  status: string;
  is_featured: boolean;
  views: number;
  progressPercentage?: number;
  daysRemaining?: number | null;
  creator?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  created_at: string;
}

const Crowdfunding = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'campaign' | 'donation' | 'service'>('campaign');
  const [filters, setFilters] = useState({
    status: 'active',
    category: '',
    search: '',
  });

  // Form states
  const [formData, setFormData] = useState({
    // Campaign fields
    title: '',
    description: '',
    category: '',
    goalSats: '',
    goalUsd: '',
    images: [] as string[],
    videoUrl: '',
    deadline: '',
    // Service fields
    priceType: 'fixed',
    priceSats: '',
    location: '',
    country: '',
    // Donation fields
    campaignId: '',
    amountSats: '',
    isAnonymous: false,
    message: '',
  });

  useEffect(() => {
    fetchCampaigns();
  }, [filters]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {
        status: filters.status,
        page: 1,
        limit: 20,
      };
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const response = await api.get('/crowdfunding/campaigns', { params });
      
      if (response.data.success) {
        setCampaigns(response.data.data.campaigns || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load campaigns');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to create a campaign');
      navigate('/login');
      return;
    }

    try {
      const campaignData = {
        title: formData.title,
        description: formData.description,
        category: formData.category || undefined,
        goalSats: parseInt(formData.goalSats),
        goalUsd: formData.goalUsd ? parseFloat(formData.goalUsd) : undefined,
        images: formData.images,
        videoUrl: formData.videoUrl || undefined,
        deadline: formData.deadline || undefined,
      };

      const response = await api.post('/crowdfunding/campaigns', campaignData);
      
      if (response.data.success) {
        alert('Campaign created successfully!');
        setShowCreateModal(false);
        resetForm();
        fetchCampaigns();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create campaign');
      console.error('Error creating campaign:', err);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to create a service');
      navigate('/login');
      return;
    }

    try {
      const serviceData = {
        title: formData.title,
        description: formData.description,
        category: formData.category || undefined,
        priceType: formData.priceType,
        priceSats: parseInt(formData.priceSats),
        location: formData.location || undefined,
        country: formData.country || undefined,
      };

      const response = await api.post('/services/listings', serviceData);
      
      if (response.data.success) {
        alert('Service created successfully!');
        setShowCreateModal(false);
        resetForm();
        navigate('/services');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create service');
      console.error('Error creating service:', err);
    }
  };

  const handleCreateDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to make a donation');
      navigate('/login');
      return;
    }

    if (!formData.campaignId) {
      alert('Please select a campaign');
      return;
    }

    try {
      const donationData = {
        amountSats: parseInt(formData.amountSats),
        isAnonymous: formData.isAnonymous,
        message: formData.message || undefined,
      };

      const response = await api.post(
        `/crowdfunding/campaigns/${formData.campaignId}/donations`,
        donationData
      );
      
      if (response.data.success) {
        alert('Donation created successfully!');
        setShowCreateModal(false);
        resetForm();
        fetchCampaigns();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create donation');
      console.error('Error creating donation:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      goalSats: '',
      goalUsd: '',
      images: [],
      videoUrl: '',
      deadline: '',
      priceType: 'fixed',
      priceSats: '',
      location: '',
      country: '',
      campaignId: '',
      amountSats: '',
      isAnonymous: false,
      message: '',
    });
  };

  const openCreateModal = (type: 'campaign' | 'donation' | 'service') => {
    setCreateType(type);
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen pb-16 lg:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="inline-block mb-3 sm:mb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-2">
              Crowdfunding & Donations
            </h1>
            <div className="h-0.5 sm:h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg px-4">
            Support projects and causes with Bitcoin Lightning Network
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <button
            onClick={() => openCreateModal('campaign')}
            className="btn btn-primary"
          >
            + Create Campaign
          </button>
          <button
            onClick={() => openCreateModal('donation')}
            className="btn btn-secondary"
          >
            💝 Make Donation
          </button>
          <button
            onClick={() => openCreateModal('service')}
            className="btn btn-secondary"
          >
            ⚡ Create Service
          </button>
        </div>

        {/* Filters */}
        <div className="card-glass mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input w-full"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                placeholder="Filter by category"
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search campaigns..."
                className="input w-full"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="card-glass border-red-500/50 bg-red-900/20 mb-6">
            <div className="flex items-center space-x-2 text-red-400">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        {loading && campaigns.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-slate-700 border-t-blue-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl sm:text-2xl animate-pulse-slow">⚡</span>
              </div>
            </div>
            <p className="mt-4 sm:mt-6 text-gray-300 text-base sm:text-lg">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 opacity-50">💝</div>
            <p className="text-gray-300 text-lg sm:text-xl font-semibold mb-2">No campaigns found</p>
            <p className="text-gray-500 text-sm sm:text-base px-4">
              Be the first to create a campaign!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="card-glass hover:scale-105 transition-transform cursor-pointer"
                onClick={() => navigate(`/crowdfunding/${campaign.id}`)}
              >
                {campaign.images && campaign.images.length > 0 && (
                  <img
                    src={campaign.images[0]}
                    alt={campaign.title}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold mb-2 gradient-text">{campaign.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {campaign.description}
                </p>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">
                      {formatSats(campaign.current_sats)} / {formatSats(campaign.goal_sats)}
                    </span>
                    <span className="text-gray-400">
                      {campaign.progressPercentage?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, campaign.progressPercentage || 0)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>
                    {campaign.daysRemaining !== null
                      ? `${campaign.daysRemaining} days left`
                      : 'No deadline'}
                  </span>
                  {campaign.creator && (
                    <span>by {campaign.creator.display_name || campaign.creator.username}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold gradient-text">
                  {createType === 'campaign' && 'Create Campaign'}
                  {createType === 'donation' && 'Make Donation'}
                  {createType === 'service' && 'Create Service'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={
                  createType === 'campaign'
                    ? handleCreateCampaign
                    : createType === 'service'
                    ? handleCreateService
                    : handleCreateDonation
                }
              >
                {/* Campaign Form */}
                {createType === 'campaign' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="input w-full"
                        placeholder="Campaign title"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input w-full"
                        rows={4}
                        placeholder="Describe your campaign..."
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input w-full"
                        placeholder="e.g., Technology, Charity, Art"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Goal (Sats) *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.goalSats}
                          onChange={(e) => setFormData({ ...formData, goalSats: e.target.value })}
                          className="input w-full"
                          placeholder="1000000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Goal (USD)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.goalUsd}
                          onChange={(e) => setFormData({ ...formData, goalUsd: e.target.value })}
                          className="input w-full"
                          placeholder="50.00"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Deadline
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="input w-full"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Video URL
                      </label>
                      <input
                        type="url"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        className="input w-full"
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </>
                )}

                {/* Service Form */}
                {createType === 'service' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="input w-full"
                        placeholder="Service title"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input w-full"
                        rows={4}
                        placeholder="Describe your service..."
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input w-full"
                        placeholder="e.g., Design, Development, Writing"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price Type
                      </label>
                      <select
                        value={formData.priceType}
                        onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                        className="input w-full"
                      >
                        <option value="fixed">Fixed Price</option>
                        <option value="hourly">Hourly Rate</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Price (Sats) *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.priceSats}
                          onChange={(e) => setFormData({ ...formData, priceSats: e.target.value })}
                          className="input w-full"
                          placeholder="100000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="input w-full"
                          placeholder="City, State"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="input w-full"
                        placeholder="Country"
                      />
                    </div>
                  </>
                )}

                {/* Donation Form */}
                {createType === 'donation' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Campaign *
                      </label>
                      <select
                        required
                        value={formData.campaignId}
                        onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                        className="input w-full"
                      >
                        <option value="">Choose a campaign...</option>
                        {campaigns
                          .filter((c) => c.status === 'active')
                          .map((campaign) => (
                            <option key={campaign.id} value={campaign.id}>
                              {campaign.title} - {formatSats(campaign.goal_sats)} goal
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount (Sats) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.amountSats}
                        onChange={(e) => setFormData({ ...formData, amountSats: e.target.value })}
                        className="input w-full"
                        placeholder="100000"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.isAnonymous}
                          onChange={(e) =>
                            setFormData({ ...formData, isAnonymous: e.target.checked })
                          }
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">Make anonymous donation</span>
                      </label>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="input w-full"
                        rows={3}
                        placeholder="Leave a message of support..."
                        maxLength={500}
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3 mt-6">
                  <button type="submit" className="btn btn-primary flex-1">
                    {createType === 'campaign' && 'Create Campaign'}
                    {createType === 'service' && 'Create Service'}
                    {createType === 'donation' && 'Make Donation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Crowdfunding;
