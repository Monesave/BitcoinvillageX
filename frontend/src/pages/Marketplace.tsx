import { useState, useEffect } from 'react';
import { marketplaceAPI } from '../services/api';
import ListingCard from '../components/marketplace/ListingCard';
import FilterBar, { FilterState } from '../components/common/FilterBar';

const Marketplace = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchListings();
    fetchCategories();
  }, [filters, page]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await marketplaceAPI.getListings({
        ...filters,
        page,
        limit: 20,
      });
      
      if (response.success) {
        if (page === 1) {
          setListings(response.data.listings || []);
        } else {
          setListings((prev) => [...prev, ...(response.data.listings || [])]);
        }
        setHasMore((response.data.listings || []).length === 20);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load listings');
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Fetch all listings to extract unique categories
      const response = await marketplaceAPI.getListings({ limit: 1000 });
      if (response.success && response.data.listings) {
        const uniqueCategories = Array.from(
          new Set(
            response.data.listings
              .map((l: any) => l.category)
              .filter((c: string) => c)
          )
        ) as string[];
        setCategories(uniqueCategories.sort());
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen pb-16 lg:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="inline-block mb-3 sm:mb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-2">Marketplace</h1>
            <div className="h-0.5 sm:h-1 w-16 sm:w-24 bg-gradient-to-r from-bitcoin to-orange-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg px-4">
            Buy and sell items with Bitcoin Lightning Network
          </p>
        </div>

      <FilterBar
        onFilterChange={handleFilterChange}
        categories={categories}
        showPriceFilter={true}
        showLocationFilter={true}
        showCountryFilter={true}
      />

        {error && (
          <div className="card-glass border-red-500/50 bg-red-900/20 mb-6">
            <div className="flex items-center space-x-2 text-red-400">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        {loading && listings.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-slate-700 border-t-bitcoin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl sm:text-2xl">₿</span>
              </div>
            </div>
            <p className="mt-4 sm:mt-6 text-gray-300 text-base sm:text-lg">Loading listings...</p>
            <p className="mt-2 text-gray-500 text-xs sm:text-sm">Connecting to Lightning Network</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 opacity-50">🔍</div>
            <p className="text-gray-300 text-lg sm:text-xl font-semibold mb-2">No listings found</p>
            <p className="text-gray-500 text-sm sm:text-base px-4">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Loading...</span>
                    </span>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
