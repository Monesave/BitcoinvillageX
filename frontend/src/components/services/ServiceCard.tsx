import { Link } from 'react-router-dom';
import { formatPriceCard } from '../../utils/price';

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description?: string;
    category?: string;
    base_price_sats: number;
    price_type?: string;
    delivery_time_days?: number;
    images?: string[];
    location?: string;
    country?: string;
    provider?: {
      username?: string;
      display_name?: string;
      avatar_url?: string;
      is_verified_villager?: boolean;
    };
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const price = formatPriceCard(service.base_price_sats);
  const imageUrl = service.images && service.images.length > 0 ? service.images[0] : null;

  return (
    <Link
      to={`/services/${service.id}`}
      className="group block card-glass hover:scale-[1.02] hover:shadow-bitcoin/20 overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-xl mb-3 sm:mb-4">
        <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-slate-800 to-slate-900">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={service.title}
              className="w-full h-40 sm:h-48 lg:h-52 object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-40 sm:h-48 lg:h-52 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 blockchain-grid opacity-30"></div>
              <span className="text-4xl sm:text-5xl lg:text-6xl relative z-10 filter drop-shadow-lg animate-pulse-slow">⚡</span>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
            </div>
          )}
        </div>
        
        {/* Category Badge */}
        {service.category && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-white bg-blue-500/90 backdrop-blur-sm rounded-full border border-blue-400/50 shadow-lg">
              {service.category}
            </span>
          </div>
        )}
        
        {/* Verified Badge */}
        {service.provider?.is_verified_villager && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-bitcoin to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
              <span className="text-white text-xs sm:text-sm">✓</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-bitcoin transition-colors">
          {service.title}
        </h3>

        {service.description && (
          <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mb-3 sm:mb-4">
            {service.description}
          </p>
        )}

        {/* Price Section */}
        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-bold gradient-text">{price.primary}</div>
              <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">{price.secondary}</div>
              {service.price_type && (
                <div className="text-[10px] sm:text-xs text-blue-400 mt-0.5 sm:mt-1 font-medium">{service.price_type}</div>
              )}
            </div>
            <div className="text-2xl sm:text-3xl opacity-20">⚡</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-slate-700/50">
          <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1">
            {service.provider?.avatar_url ? (
              <img
                src={service.provider.avatar_url}
                alt={service.provider.display_name || service.provider.username}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-blue-500/30 flex-shrink-0"
              />
            ) : (
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 flex-shrink-0"></div>
            )}
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs font-medium text-white truncate">
                {service.provider?.display_name || service.provider?.username || 'Anonymous'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs text-gray-400 flex-shrink-0 ml-2">
            {service.delivery_time_days && (
              <div className="flex items-center space-x-0.5 sm:space-x-1">
                <span>⏱️</span>
                <span className="hidden sm:inline">{service.delivery_time_days}d</span>
              </div>
            )}
            {(service.location || service.country) && (
              <div className="flex items-center space-x-0.5 sm:space-x-1">
                <span>📍</span>
                <span className="hidden sm:inline">{service.location || service.country}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </Link>
  );
};

export default ServiceCard;

