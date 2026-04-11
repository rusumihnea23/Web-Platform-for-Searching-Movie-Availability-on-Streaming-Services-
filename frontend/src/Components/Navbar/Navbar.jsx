import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from "../../assets/logo.png";
import defaultpp from "../../assets/default-pp.webp"
import { useState,useEffect } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom" 
import { getUserDetails } from "../../Actions/UserActions";
import { logout } from "../../Actions/AuthActions"
import { LogModal } from '../LogModal/LogModal';
import SearchBar from '../Search/SearchBar/SearchBar';
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function Navbar() {
  const[UserDetails,setUserDetails]=useState("");
      useEffect(() => {
          const fetchDetails=async ()=>{
              const user=await getUserDetails();
              setUserDetails(user);
          }
          if(localStorage.getItem("token") )
          fetchDetails();
          
      }, [])
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Disclosure as="nav" className="relative bg-sky-800 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
      <div className="mx-auto max-w-none px-2 sm:px-6 lg:px-12">
        {/* Container principal crescut la h-20 sau păstrat h-16 în funcție de design-ul SearchBar */}
        <div className="relative flex h-16 items-center justify-between gap-4">
          
          {/* LEFT: Logo & Desktop Links */}
          <div className="flex items-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img alt="Logo" src={logo} className="h-8 w-auto" />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isCurrent = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        isCurrent ? 'bg-sky-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* CENTER: Search Bar (Centrat și flexibil) */}
          <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-center">
            <div className="w-full max-w-lg lg:max-w-md">
                <SearchBar />
            </div>
          </div>

          {/* RIGHT: Profile/Sign-in & Mobile Menu Button */}
          <div className="flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {localStorage.getItem("token") ? (
              <div className="flex items-center space-x-3">
                <button type="button" className="relative rounded-full p-1 text-sky-950 hover:text-white hidden sm:block">
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>
                <LogModal />

                <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative flex rounded-full">
                    <img alt="" src={!UserDetails.profilePicturePath ? defaultpp : UserDetails.profilePicturePath} className="size-8 rounded-full cursor-pointer hover:outline-pink-600 hover:outline-2 outline-offset-1" />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1">
                    <MenuItem>
                      <Link to="profile" className="block px-4 py-2 text-sm text-gray-300 hover:text-gray-400">Your profile</Link>
                    </MenuItem>
                    <MenuItem>
                      <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-300 cursor-pointer hover:text-gray-400">Sign out</button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            ) : (
              <button onClick={() => navigate("/login")} className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-500 cursor-pointer hidden sm:block">
                Sign in
              </button>
            )}

            {/* Mobile Menu Button - mutat la finalul listei de pe dreapta */}
            <div className="ml-2 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-sky-950 hover:bg-white/5 hover:text-white focus:outline-none">
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE PANEL */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
            {/* Butonul Sign In pentru mobil dacă nu e logat */}
            {!localStorage.getItem("token") && (
                 <button onClick={() => navigate("/login")} className="w-full text-left text-gray-300 hover:bg-white/5 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
                    Sign in
                 </button>
            )}
          {navigation.map((item) => {
            const isCurrent = location.pathname === item.href;
            return (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.href}
                className={classNames(
                  isCurrent ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            );
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}