import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from "../../assets/logo.png";
import defaultpp from "../../assets/default-pp.webp"
import { useState,useEffect } from 'react';
// 1. IMPORT Link HERE
import { useNavigate, useLocation, Link } from "react-router-dom" 
import { getUserDetails } from "../../Actions/UserActions";
import { logout } from "../../Actions/AuthActions"

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
        <div className="relative flex h-16 items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-sky-950 hover:bg-white/5 hover:text-white focus:outline-none">
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img alt="Logo" src={logo} className="h-8 w-auto" />
            </div>
            
            {/* Desktop Links */}
            <div className="hidden sm:ml-2 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  // 2. CHECK THE REAL URL
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

          {/* Right side: Profile/Sign-in */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {localStorage.getItem("token") ? (
              <>
                <button type="button" className="relative rounded-full p-1 text-sky-950 hover:text-white">
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>

                <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative flex rounded-full">
                    <img alt="" src={UserDetails.profilePicturePath} className="size-8 rounded-full" />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1">
                    <MenuItem>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:text-gray-400">Your profile</Link>
                    </MenuItem>
                    <MenuItem>
                      <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-300 cursor-pointer hover:text-gray-400">Sign out</button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </>
            ) : (
              <button onClick={() => navigate("/login")} className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-500 cursor-pointer">
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. MOBILE PANEL (Only at the bottom) */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
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