import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from '../Footer/Footer';

const NavbarLayout = () => {
  return (
    <>
      <Navbar />
      
        <Outlet />
      <Footer></Footer>
    </>
  );
};

export default NavbarLayout;