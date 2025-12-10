import { useState, useRef, useEffect } from 'react';

const ContactSupport = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleEmailClick = () => {
    window.location.href = 'mailto:support@monesave.com';
    setIsDropdownOpen(false);
  };

  const handleFAQClick = () => {
    setIsFAQOpen(true);
    setIsDropdownOpen(false);
  };

  const faqData = [
    {
      category: 'About BitcoinVillageX',
      questions: [
        {
          q: 'What is BitcoinVillageX?',
          a: 'BitcoinVillageX is a Bitcoin-only digital village where people spend, receive, donate, trade, and support each other using Bitcoin over Lightning — no banks or fiat ever. A global Bitcoin-only village where you can spend, receive, donate, buy, sell, and earn using BTC only.',
        },
        {
          q: 'Do I need a bank or fiat money?',
          a: 'No. Everything runs on Bitcoin over Lightning.',
        },
        {
          q: 'What can I do in the Village?',
          a: '• Send & receive Bitcoin\n• Pay merchants\n• Buy & sell goods\n• Offer & hire services\n• Create & solve bounties\n• Fund or donate to campaigns',
        },
        {
          q: 'Is Bitcoinvillagex payments fast?',
          a: 'Yes — Lightning payments are instant.',
        },
        {
          q: 'What is a "Verified Villager"?',
          a: 'A trusted user with higher limits and a reputation badge.',
        },
      ],
    },
    {
      category: 'Getting Started (Onboarding)',
      questions: [
        {
          q: 'Do I need a Bitcoin wallet to join?',
          a: 'No. You can join without a wallet. Your Bitcoin balance will appear on your Village Dashboard, even if you don\'t have a wallet yet.',
        },
        {
          q: 'What if I don\'t know how to use Bitcoin?',
          a: 'That\'s fine. The app guides you step by step, and you can start small.',
        },
        {
          q: 'How do I get Bitcoin into my account?',
          a: 'You can receive sats from:\n• Any Lightning wallet\n• Strike\n• Orukka / Monesave\n• Other Villagers\n\nJust create a service on list of product on the BitcoinvillageX.',
        },
        {
          q: 'Can someone hold my wallet for me?',
          a: 'Yes. Your Bitcoin can be withdrawn anytime or your can leave it in the village. On request, your Bitcoin is held with Monesave at Strike to help users who don\'t have a wallet yet. They can hold and manage Bitcoin on request, while you still see your balance in the app.',
        },
      ],
    },
    {
      category: 'Merchants FAQ',
      questions: [
        {
          q: 'Can merchants use BitcoinVillageX?',
          a: 'Yes. Merchants can:\n• Accept Bitcoin instantly\n• Sell products & services\n• Withdraw to Strike or Monesave\n• Spend sats inside the Village\n• Create fundraising campaigns',
        },
        {
          q: 'How do I get paid?',
          a: 'Customers pay in Bitcoin → you see the sats instantly in your Merchant Dashboard.',
        },
        {
          q: 'Can I convert Bitcoin to local money?',
          a: 'Yes — through Strike or Monesave (outside the app). BitcoinVillageX itself stays Bitcoin-only.',
        },
      ],
    },
    {
      category: 'Crowdfunding & Raising Money',
      questions: [
        {
          q: 'Can I raise money in Bitcoin?',
          a: 'Yes! Create a campaign in minutes and receive sats from Villagers instantly.',
        },
        {
          q: 'What is the fee for crowdfunding?',
          a: 'Only 2.5% on funds raised.',
        },
        {
          q: 'Who can donate?',
          a: 'Anyone in the Village — no borders, no banks, no fiat.',
        },
        {
          q: 'How do donors pay?',
          a: 'With Lightning → fast, global, and low fee.',
        },
      ],
    },
    {
      category: 'Buying, Selling & Services',
      questions: [
        {
          q: 'How does buying work?',
          a: '1. You pay in Bitcoin\n2. Sats go into Village Escrow\n3. Seller ships\n4. You confirm → sats released',
        },
        {
          q: 'How do services work?',
          a: 'Same idea: Buyer funds → Worker delivers → Buyer approves → sats released.',
        },
        {
          q: 'What if there\'s a dispute?',
          a: 'The Village Council reviews evidence and decides fairly.',
        },
        {
          q: 'What is the fee for products and services listed in the village?',
          a: 'Only 2.5% is charged for market place listing (services and products).',
        },
      ],
    },
    {
      category: 'The Village Council',
      questions: [
        {
          q: 'What is the Village Council?',
          a: 'The Village Council is a governance system made up of trusted community members who help make important decisions for the BitcoinVillageX platform. Council members are selected and approved by Admins to ensure fair and transparent governance.',
        },
        {
          q: 'What does the Village Council do?',
          a: 'The Village Council:\n• Reviews and resolves disputes between Villagers\n• Reviews decisions made by Admins\n• Determines rewards for Village holders who donate to certain crowdfunding campaigns\n• Votes on moderation actions (banning/unbanning members)\n• Proposes and approves rewards for contributing members\n• Assists members through crowdfunding campaigns',
        },
        {
          q: 'How are disputes resolved?',
          a: 'When a dispute arises (e.g., in a transaction or service delivery), the Village Council reviews all evidence from both parties. Council members vote on the resolution, and the decision is final. This ensures fair and transparent dispute resolution.',
        },
        {
          q: 'Can the Village Council review Admin decisions?',
          a: 'Yes. The Village Council has the authority to review decisions made by Admins. This provides an additional layer of oversight and ensures that all decisions are fair and in the best interest of the Village community.',
        },
        {
          q: 'How does the Council determine rewards for crowdfunding donors?',
          a: 'The Village Council can identify and reward Village holders who make significant contributions to certain crowdfunding campaigns. Council members create reward proposals, vote on them, and once approved, rewards are distributed to recognize generous donors.',
        },
        {
          q: 'How do I become a Council member?',
          a: 'Council members are selected and nominated by Admins. If you\'re interested in serving on the Council, you can apply, and Admins will review your application based on your contributions, reputation, and commitment to the Village.',
        },
        {
          q: 'How does Council voting work?',
          a: 'Council members vote on proposals (disputes, rewards, moderation actions, etc.). Proposals require a minimum number of votes and a majority of "yes" votes to be approved. The voting process is transparent and democratic.',
        },
        {
          q: 'Are Council decisions final?',
          a: 'Yes. Once the Village Council reaches a decision through the voting process, the decision is final and will be executed. This ensures consistency and fairness across all Village operations.',
        },
      ],
    },
    {
      category: 'Wallets, Deposits & Withdrawals',
      questions: [
        {
          q: 'I don\'t have a wallet — can I still use BitcoinVillageX?',
          a: 'Yes. Your sats appear on your Dashboard. You can request wallet help from Monesave at Strike anytime.',
        },
        {
          q: 'How do I withdraw?',
          a: 'You can withdraw to:\n• Any Lightning wallet\n• Strike\n• Monesave (to spend fiat)',
        },
        {
          q: 'Is Bitcoin safe for beginners?',
          a: 'Yes — BitcoinVillageX is built to be simple, guided, and secure.',
        },
      ],
    },
    {
      category: 'Bitcoin Bounties',
      questions: [
        {
          q: 'What is a Bounty?',
          a: 'A reward in Bitcoin for solving a problem — bug fix, research task, lost item, anything.',
        },
        {
          q: 'Who can create or solve bounties?',
          a: 'Any Villager.',
        },
      ],
    },
    {
      category: 'Why Bitcoin Only?',
      questions: [
        {
          q: 'Why no fiat or altcoins?',
          a: 'Because Bitcoin is:\n• Global\n• Borderless\n• Decentralized\n• Hard money\n• Fast on Lightning\n\nThe Village runs on pure Bitcoin to keep it simple and free.',
        },
      ],
    },
  ];

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Question Mark Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-10 h-10 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-bitcoin/50 hover:bg-slate-700/50 flex items-center justify-center text-gray-300 hover:text-bitcoin transition-all duration-300 text-xl font-bold relative group"
          aria-label="Contact Support"
        >
          <span className="relative z-10">?</span>
          <div className="absolute inset-0 bg-bitcoin/20 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity"></div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
            <button
              onClick={handleFAQClick}
              className="w-full px-4 py-3 text-left text-gray-300 hover:bg-slate-700/50 hover:text-bitcoin transition-colors flex items-center space-x-2 border-b border-slate-700/50"
            >
              <span>📚</span>
              <span>Q&A</span>
            </button>
            <button
              onClick={handleEmailClick}
              className="w-full px-4 py-3 text-left text-gray-300 hover:bg-slate-700/50 hover:text-bitcoin transition-colors flex items-center space-x-2"
            >
              <span>✉️</span>
              <span>Email Support</span>
            </button>
          </div>
        )}
      </div>

      {/* FAQ Modal */}
      {isFAQOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text">
                BitcoinVillageX FAQ
              </h2>
              <button
                onClick={() => setIsFAQOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center text-gray-300 hover:text-bitcoin transition-colors text-xl"
                aria-label="Close FAQ"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <p className="text-gray-300 mb-6 italic">
                A simple guide for new Villagers living and transacting with Bitcoin only.
              </p>

              {faqData.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-bitcoin border-b border-slate-700/50 pb-2">
                    {category.category}
                  </h3>
                  <div className="space-y-4">
                    {category.questions.map((item, qIndex) => (
                      <div key={qIndex} className="card-glass">
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {item.q}
                        </h4>
                        <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-700/50 text-center">
              <button
                onClick={() => setIsFAQOpen(false)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactSupport;

