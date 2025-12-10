import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Home = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-bitcoin via-orange-500 to-yellow-500 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to the Global Bitcoin Village
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            A place where Villagers spend, receive, donate, trade services, and support each other using{' '}
            <strong>Bitcoin only</strong> — the hardest money and the most powerful form of global value transfer.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {!user ? (
              <>
                <Link to="/signup" className="btn bg-white text-bitcoin hover:bg-gray-100 px-8 py-3 text-lg">
                  Join the Village — Live Fully on Bitcoin
                </Link>
                <Link to="/marketplace" className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-bitcoin px-8 py-3 text-lg">
                  Explore the Village
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn bg-white text-bitcoin hover:bg-gray-100 px-8 py-3 text-lg">
                Go to Dashboard
              </Link>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌍</span>
              <span>Anyone, anywhere</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚡</span>
              <span>Lightning fast</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🧡</span>
              <span>Bitcoin-only</span>
            </div>
          </div>

          <p className="mt-8 text-lg">
            🔒 <strong>Trusted by 2,100+ Villagers</strong> — and growing daily
          </p>
        </div>
      </section>

      {/* Four Pillars Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Four Pillars of the Village
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              BitcoinVillageX is more than an app. It's a <strong>living Bitcoin economy</strong>.
              Explore the four paths where Villagers trade, build, help, and grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Crowdfunding */}
            <div className="card hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Crowdfunding & Donations</h3>
              <p className="text-bitcoin font-semibold mb-4">Fund the future with sats — no banks, no limits.</p>
              <p className="text-gray-600 mb-4">
                Launch Bitcoin-only campaigns in minutes and receive donations instantly over Lightning.
                Platform fee: <strong>2.5%</strong> on funds raised.
              </p>
              <Link to="/crowdfunding" className="btn btn-primary">
                Start a Bitcoin Campaign →
              </Link>
            </div>

            {/* Marketplace */}
            <div className="card hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Marketplace – Buy & Sell Goods</h3>
              <p className="text-bitcoin font-semibold mb-4">Real goods. Real value. Real Bitcoin.</p>
              <p className="text-gray-600 mb-4">
                Buy and sell goods in a global Bitcoin marketplace. Every transaction settles instantly over Lightning.
              </p>
              <Link to="/marketplace" className="btn btn-primary">
                Browse the Marketplace →
              </Link>
            </div>

            {/* Services */}
            <div className="card hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Services – Work for Bitcoin</h3>
              <p className="text-bitcoin font-semibold mb-4">Turn your skills into sats.</p>
              <p className="text-gray-600 mb-4">
                Offer your skills or hire talented Villagers worldwide. Everything runs on Bitcoin over Lightning.
              </p>
              <Link to="/services" className="btn btn-primary">
                Offer a Service →
              </Link>
            </div>

            {/* Bounties */}
            <div className="card hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Bitcoin Bounties</h3>
              <p className="text-bitcoin font-semibold mb-4">Put a price on any problem — pay solvers in sats.</p>
              <p className="text-gray-600 mb-4">
                Create bounties for bugs, lost items, research, or real-world challenges.
                Villagers compete to solve tasks and get rewarded in Lightning instantly.
              </p>
              <Link to="/bounties" className="btn btn-primary">
                Create a Bounty →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Change Your Life with Bitcoin?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Step into a world where you earn, spend, donate, support, and grow using{' '}
            <strong>Bitcoin only</strong> — a money system built for freedom, dignity, and global opportunity.
          </p>
          {!user && (
            <Link to="/signup" className="btn btn-primary px-8 py-3 text-lg">
              Join the Village — Start Living on Bitcoin Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

