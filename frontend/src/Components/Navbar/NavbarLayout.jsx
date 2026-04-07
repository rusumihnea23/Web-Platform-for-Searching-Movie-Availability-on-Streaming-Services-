import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from '../Footer/Footer';

const NavbarLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-sky-900">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default NavbarLayout;