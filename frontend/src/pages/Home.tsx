import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import StarField from '../components/common/StarField';

const Home = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Star Field Background */}
      <StarField />
      
      {/* Galaxy/Nebula Gradient Overlay */}
       {/* <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-900/30 to-slate-900"></div>
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: 'radial-gradient(ellipse at 20% 30%, rgba(30, 58, 138, 0.3) 0%, transparent 50%)',
          }}
        ></div>
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: 'radial-gradient(ellipse at 80% 70%, rgba(88, 28, 135, 0.3) 0%, transparent 50%)',
          }}
        ></div>
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(190, 24, 93, 0.2) 0%, transparent 50%)',
          }}
        ></div>
      </div>  */}

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          {/* Floating Bitcoin Symbol */}
          <div className="mb-8 relative">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-bitcoin/30 blur-3xl rounded-full animate-pulse-slow"></div>
              <div className="relative text-8xl sm:text-9xl lg:text-[12rem] font-bold gradient-text animate-float">
                ₿
              </div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 relative z-10">
            <span className="block mb-2 gradient-text">Welcome to the</span>
            <span className="block text-white drop-shadow-[0_0_20px_rgba(247,147,26,0.5)]">
              Global Bitcoin Village
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-4xl mx-auto text-gray-200 relative z-10 leading-relaxed">
            A place where Villagers spend, receive, donate, trade services, and support each other using{' '}
            <strong className="text-bitcoin font-bold">Bitcoin only</strong> — the hardest money and the most powerful form of global value transfer.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 relative z-10">
            {!user ? (
              <>
                <Link 
                  to="/signup" 
                  className="btn btn-primary px-8 py-4 text-lg font-semibold glow-effect-hover relative group"
                >
                  <span className="relative z-10">Join the Village — Live Fully on Bitcoin</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-bitcoin to-orange-500 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                </Link>
                <Link 
                  to="/marketplace" 
                  className="btn btn-outline px-8 py-4 text-lg font-semibold border-2 border-bitcoin/50 text-white hover:bg-bitcoin/10 relative"
                >
                  Explore the Village
                </Link>
              </>
            ) : (
              <Link 
                to="/dashboard" 
                className="btn btn-primary px-8 py-4 text-lg font-semibold glow-effect-hover"
              >
                Go to Dashboard
              </Link>
            )}
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 relative z-10">
            <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50">
              <span className="text-2xl">🌍</span>
              <span className="text-gray-200">Anyone, anywhere</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50">
              <span className="text-2xl">⚡</span>
              <span className="text-gray-200">Lightning fast</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50">
              <span className="text-2xl">🧡</span>
              <span className="text-gray-200">Bitcoin-only</span>
            </div>
          </div>

          <p className="text-lg text-gray-300 relative z-10">
            🔒 <strong className="text-white">Trusted by 2,100+ Villagers</strong> — and growing daily
          </p>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-bitcoin/40 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            ></div>
          ))}
        </div>
      </section>

      {/* Four Pillars Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 gradient-text">
              The Four Pillars of the Village
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              BitcoinVillageX is more than an app. It's a <strong className="text-bitcoin">living Bitcoin economy</strong>.
              Explore the four paths where Villagers trade, build, help, and grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Crowdfunding */}
            <div className="card-glass hover:scale-[1.02] transition-transform duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold mb-2 text-white">Crowdfunding & Donations</h3>
                <p className="text-bitcoin font-semibold mb-4">Fund the future with sats — no banks, no limits.</p>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Launch Bitcoin-only campaigns in minutes and receive donations instantly over Lightning.
                  Platform fee: <strong className="text-bitcoin">2.5%</strong> on funds raised.
                </p>
                <Link to="/crowdfunding" className="btn btn-primary inline-flex items-center group-hover:scale-105 transition-transform">
                  Start a Bitcoin Campaign →
                </Link>
              </div>
            </div>

            {/* Marketplace */}
            <div className="card-glass hover:scale-[1.02] transition-transform duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-bitcoin/0 to-bitcoin/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">🛒</div>
                <h3 className="text-2xl font-bold mb-2 text-white">Marketplace – Buy & Sell Goods</h3>
                <p className="text-bitcoin font-semibold mb-4">Real goods. Real value. Real Bitcoin.</p>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Buy and sell goods in a global Bitcoin marketplace. Every transaction settles instantly over Lightning.
                </p>
                <Link to="/marketplace" className="btn btn-primary inline-flex items-center group-hover:scale-105 transition-transform">
                  Browse the Marketplace →
                </Link>
              </div>
            </div>

            {/* Services */}
            <div className="card-glass hover:scale-[1.02] transition-transform duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-2 text-white">Services – Work for Bitcoin</h3>
                <p className="text-bitcoin font-semibold mb-4">Turn your skills into sats.</p>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Offer your skills or hire talented Villagers worldwide. Everything runs on Bitcoin over Lightning.
                </p>
                <Link to="/services" className="btn btn-primary inline-flex items-center group-hover:scale-105 transition-transform">
                  Offer a Service →
                </Link>
              </div>
            </div>

            {/* Bounties */}
            <div className="card-glass hover:scale-[1.02] transition-transform duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-2 text-white">Bitcoin Bounties</h3>
                <p className="text-bitcoin font-semibold mb-4">Put a price on any problem — pay solvers in sats.</p>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Create bounties for bugs, lost items, research, or real-world challenges.
                  Villagers compete to solve tasks and get rewarded in Lightning instantly.
                </p>
                <Link to="/bounties" className="btn btn-primary inline-flex items-center group-hover:scale-105 transition-transform">
                  Create a Bounty →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="card-glass max-w-4xl mx-auto p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-bitcoin/10 via-purple-500/10 to-blue-500/10 opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Ready to Change Your Life with Bitcoin?
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Step into a world where you earn, spend, donate, support, and grow using{' '}
                <strong className="text-bitcoin">Bitcoin only</strong> — a money system built for freedom, dignity, and global opportunity.
              </p>
              {!user && (
                <Link 
                  to="/signup" 
                  className="btn btn-primary px-8 py-4 text-lg font-semibold glow-effect-hover inline-block"
                >
                  Join the Village — Start Living on Bitcoin Today
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Message */}
      {/* <footer className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700/30"> */}
        {/* <div className="container mx-auto text-center">
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-medium italic">
            We are all created equal, no inflation, no printing
          </p>
        </div> */}
      {/* </footer> */}

{/* <div className='z-10'>
      <Footer />
      </div> */}
    </div>
  );
};

export default Home;
