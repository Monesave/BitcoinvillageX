import { useState } from 'react';

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  categories?: string[];
  showPriceFilter?: boolean;
  showLocationFilter?: boolean;
  showCountryFilter?: boolean;
}

export interface FilterState {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  country?: string;
  search?: string;
}

const FilterBar = ({
  onFilterChange,
  categories = [],
  showPriceFilter = true,
  showLocationFilter = true,
  showCountryFilter = true,
}: FilterBarProps) => {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    location: '',
    country: '',
    search: '',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      location: '',
      country: '',
      search: '',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = 
    filters.category || 
    filters.minPrice || 
    filters.maxPrice || 
    filters.location || 
    filters.country || 
    filters.search;

  return (
    <div className="card-glass mb-6">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xl">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search listings..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input pl-12"
          />
        </div>
      </div>

      {/* Expandable Filters */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm font-medium text-gray-300 hover:text-bitcoin transition-colors flex items-center space-x-2"
        >
          <span>{isExpanded ? '▼' : '▶'}</span>
          <span>{isExpanded ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-bitcoin hover:text-orange-400 transition-colors font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="input"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price Filters */}
          {showPriceFilter && (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                  Min Price (sats)
                </label>
                <input
                  type="number"
                  placeholder="Min (sats)"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                  Max Price (sats)
                </label>
                <input
                  type="number"
                  placeholder="Max (sats)"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="input"
                />
              </div>
            </>
          )}

          {/* Location Filter */}
          {showLocationFilter && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                placeholder="City, State"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                className="input"
              />
            </div>
          )}

          {/* Country Filter */}
          {showCountryFilter && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                Country
              </label>
              <input
                type="text"
                placeholder="Country"
                value={filters.country || ''}
                onChange={(e) => handleFilterChange('country', e.target.value || undefined)}
                className="input"
              />
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.category && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-bitcoin to-orange-500 text-white rounded-full text-xs font-medium shadow-lg">
              {filters.category}
            </span>
          )}
          {filters.minPrice && (
            <span className="px-3 py-1.5 bg-slate-700/50 backdrop-blur-sm text-bitcoin border border-bitcoin/30 rounded-full text-xs font-medium">
              Min: {filters.minPrice.toLocaleString()} sats
            </span>
          )}
          {filters.maxPrice && (
            <span className="px-3 py-1.5 bg-slate-700/50 backdrop-blur-sm text-bitcoin border border-bitcoin/30 rounded-full text-xs font-medium">
              Max: {filters.maxPrice.toLocaleString()} sats
            </span>
          )}
          {filters.location && (
            <span className="px-3 py-1.5 bg-slate-700/50 backdrop-blur-sm text-gray-300 border border-slate-600 rounded-full text-xs font-medium">
              📍 {filters.location}
            </span>
          )}
          {filters.country && (
            <span className="px-3 py-1.5 bg-slate-700/50 backdrop-blur-sm text-gray-300 border border-slate-600 rounded-full text-xs font-medium">
              🌍 {filters.country}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;

