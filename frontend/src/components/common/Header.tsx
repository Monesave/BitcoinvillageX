import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import ContactSupport from './ContactSupport';

const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl sm:text-3xl font-bold text-bitcoin group-hover:scale-110 transition-transform">₿</span>
            <span className="text-lg sm:text-xl font-bold gradient-text hidden sm:inline">BitcoinVillageX</span>
            <span className="text-lg font-bold gradient-text sm:hidden">BVX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/marketplace" className="text-gray-300 hover:text-bitcoin transition-colors font-medium">
              Marketplace
            </Link>
            <Link to="/services" className="text-gray-300 hover:text-bitcoin transition-colors font-medium">
              Services
            </Link>
            <Link to="/bounties" className="text-gray-300 hover:text-bitcoin transition-colors font-medium">
              Bounties
            </Link>
            <Link to="/crowdfunding" className="text-gray-300 hover:text-bitcoin transition-colors font-medium">
              Crowdfunding
            </Link>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            <ContactSupport />
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-bitcoin transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-gray-300 hover:text-bitcoin transition-colors font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline text-sm"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-bitcoin transition-colors font-medium">
                  Log In
                </Link>
                <Link to="/signup" className="btn btn-primary text-sm">
                  <span className="hidden xl:inline">Join the Bitcoin Village</span>
                  <span className="xl:hidden">Join</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button & Contact */}
          <div className="lg:hidden flex items-center space-x-2">
            <ContactSupport />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-bitcoin transition-colors p-2"
              aria-label="Toggle menu"
            >
              <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/50 py-4 animate-in slide-in-from-top">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/marketplace" 
                className="text-gray-300 hover:text-bitcoin transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                to="/services" 
                className="text-gray-300 hover:text-bitcoin transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/bounties" 
                className="text-gray-300 hover:text-bitcoin transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bounties
              </Link>
              <Link 
                to="/crowdfunding" 
                className="text-gray-300 hover:text-bitcoin transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Crowdfunding
              </Link>
              <div className="border-t border-slate-700/50 pt-3 mt-3">
                {user ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="block text-gray-300 hover:text-bitcoin transition-colors px-2 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/profile" 
                      className="block text-gray-300 hover:text-bitcoin transition-colors px-2 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="btn btn-outline w-full mt-2 text-sm"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block text-gray-300 hover:text-bitcoin transition-colors px-2 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log In
                    </Link>
                    <Link 
                      to="/signup" 
                      className="btn btn-primary w-full mt-2 text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Join the Bitcoin Village
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

