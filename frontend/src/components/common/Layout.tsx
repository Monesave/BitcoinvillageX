import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNavigation from './BottomNavigation';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative mb-10 md:mb-0">
      <Header />
      <main className="flex-grow relative max-h-fit overflow-hidden">
        <Outlet />
      </main>
      <Footer />
    
      <BottomNavigation />
    </div>
  );
};

export default Layout;

