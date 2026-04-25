import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ShieldCheckIcon, BellIcon,VideoCameraSlashIcon,UserCircleIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom" 
import { getUserDetails } from "../../Actions/UserActions";
import { logout } from "../../Actions/AuthActions"
import { LogModal } from '../LogModal/LogModal';
import SearchBar from '../Search/SearchBar/SearchBar';

const navigation = [{ name: 'Home', href: '/' }, { name: 'About', href: '/about' }];

export default function Navbar() {
  const [user, setUser] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => { if (isLoggedIn) getUserDetails().then(setUser); }, [isLoggedIn]);

  const LinkStyle = (path) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === path ? 'bg-sky-900 text-white' : 'text-sky-100 hover:bg-sky-700'}`;

  return (
    <Disclosure as="nav" className="bg-sky-800 shadow-md sticky top-0 z-50">
      {/* GRID LAYOUT: Solves the overlap issue while maintaining perfect centering */}
      <div className="mx-auto max-w-7xl px-4 h-16 grid grid-cols-[auto_1fr_auto] md:grid-cols-3 items-center gap-2 sm:gap-4">
        
        {/* LEFT: Logo & Desktop Navigation */}
        <div className="flex items-center justify-start gap-4">
          <Link to="/" className="shrink-0"><VideoCameraSlashIcon className='h-8 w-8'></VideoCameraSlashIcon></Link>
          <div className="hidden md:flex space-x-1">
            {navigation.map(n => <Link key={n.name} to={n.href} className={LinkStyle(n.href)}>{n.name}</Link>)}
          </div>
        </div>

        {/* CENTER: Search Bar (Fluid on mobile, strictly centered on desktop) */}
        <div className="w-full max-w-[15rem] sm:max-w-sm md:max-w-md justify-self-center">
          {/* Shows on Desktop WITH button */}
          <div className="hidden md:block w-full"><SearchBar showButton={true} /></div>
          {/* Shows on Mobile WITHOUT button */}
          <div className="block md:hidden w-full"><SearchBar showButton={false} /></div>
        </div>

        {/* RIGHT: User Actions & Toggles */}
        <div className="flex items-center justify-end gap-1 sm:gap-4">
          {user?.role === 'ROLE_ADMIN' && (
            <Link to="/admin" className="p-2 text-amber-400 hover:bg-sky-700 rounded-full transition-colors"><ShieldCheckIcon className="size-6" /></Link>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-1 sm:gap-3">
              <div className="hidden sm:flex items-center gap-3">
                <BellIcon className="size-6 text-sky-100 cursor-pointer hover:text-white transition-colors" />
                <LogModal /> 
              </div>
              <Menu as="div" className="relative ml-1">
                <MenuButton className="flex rounded-full border-2 border-transparent hover:border-sky-400 transition-all">
                  {user?.profilePicturePath ? (
                    <img
                      src={user.profilePicturePath}
                      className="size-8 rounded-full cursor-pointer"
                      alt="User"
                    />
                  ) : (
                    <UserCircleIcon className="w-9 h-9 bg cursor-pointer" />
                  )}
                </MenuButton>
                <MenuItems className="absolute right-0 mt-2 w-48 bg-white py-1 shadow-lg rounded-md ring-1 ring-black/5 z-50 focus:outline-none">
                  <MenuItem>{({ active }) => <Link to="/profile" className={`block px-4 py-2 text-sm text-gray-700 ${active && 'bg-gray-100'}`}>Profile</Link>}</MenuItem>
                  <MenuItem>{({ active }) => <button onClick={logout} className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${active && 'bg-gray-100'}`}>Sign out</button>}</MenuItem>
                </MenuItems>
              </Menu>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="hidden sm:block bg-sky-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-sky-500 transition-colors whitespace-nowrap">Sign in</button>
          )}

          {/* Mobile Menu Icon */}
          <DisclosureButton className="md:hidden p-1 text-sky-100 hover:bg-sky-700 rounded-md transition-colors">
            <Bars3Icon className="size-7 ui-open:hidden block" />
            <XMarkIcon className="size-7 ui-open:block hidden" />
          </DisclosureButton>
        </div>
      </div>
      {/* MOBILE EXPANDABLE PANEL */}
      <DisclosurePanel className="md:hidden bg-sky-900 border-t border-sky-700 pb-3 pt-2 px-2 space-y-1 shadow-inner">
        {navigation.map(n => <Link key={n.name} to={n.href} className="block px-3 py-2 text-base font-medium text-sky-100 hover:bg-sky-800 rounded-md">{n.name}</Link>)}
        <div className="pt-3 mt-3 border-t border-sky-800 px-1">
          {isLoggedIn ? <LogModal /> : <button onClick={() => navigate("/login")} className="w-full bg-sky-600 text-white py-2 rounded-md font-bold hover:bg-sky-500 transition-colors">Sign in</button>}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}