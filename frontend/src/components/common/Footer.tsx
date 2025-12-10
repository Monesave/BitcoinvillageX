import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">BitcoinVillageX</h3>
            <p className="text-sm">
              A Bitcoin-only micro-economy where Villagers spend, receive, donate, trade services, and support each other.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-bitcoin transition-colors">About</Link></li>
              <li><Link to="/faq" className="hover:text-bitcoin transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-bitcoin transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="hover:text-bitcoin transition-colors">Privacy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-bitcoin transition-colors">Contact</Link></li>
              <li><a href="https://www.orukka.com" target="_blank" rel="noopener noreferrer" className="hover:text-bitcoin transition-colors">Orukka</a></li>
              <li><a href="https://www.monesave.com" target="_blank" rel="noopener noreferrer" className="hover:text-bitcoin transition-colors">Monesave</a></li>
              <li><a href="https://www.strike.me" target="_blank" rel="noopener noreferrer" className="hover:text-bitcoin transition-colors">Strike</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Ownership</h4>
            <p className="text-sm">
              BitcoinVillageX is owned by <strong>Coceca Ltd</strong>.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} BitcoinVillageX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

