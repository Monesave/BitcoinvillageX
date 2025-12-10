import { Link, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home', name: 'home' },
    { path: '/marketplace', icon: '🛒', label: 'Marketplace', name: 'marketplace' },
    { path: '/services', icon: '⚡', label: 'Services', name: 'services' },
    { path: '/bounties', icon: '🎯', label: 'Bounties', name: 'bounties' },
    { path: '/profile', icon: '👤', label: 'Profile', name: 'profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 shadow-2xl lg:hidden">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-around h-14 sm:h-16">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative ${
                  active
                    ? 'text-bitcoin scale-110'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1">{item.icon}</span>
                <span className={`text-[10px] sm:text-xs font-medium ${active ? 'text-bitcoin' : 'text-gray-400'}`}>
                  {item.label}
                </span>
                {active && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 sm:w-12 h-0.5 sm:h-1 bg-gradient-to-r from-bitcoin to-orange-500 rounded-t-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;

