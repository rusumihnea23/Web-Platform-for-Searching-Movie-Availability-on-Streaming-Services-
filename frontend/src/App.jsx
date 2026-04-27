import { React, useState } from 'react'
import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom'
// 1. Import the Provider


import LoginForm from './Components/Authentication/LoginForm/LoginForm'
import RegisterForm from './Components/Authentication/RegisterForm/RegisterForm'
import PrivateRoutes from './Routes/PrivateRoutes'
import NavbarLayout from './Components/Navbar/NavbarLayout'
import Notfound from './Components/Notfound/Notfound'
import HomePage from './Components/HomePage/HomePage'
import SearchResult from './Components/Search/SearchResults/SearchResults'
import MovieCard from './Components/MovieCard/MovieCard'
import Profile from './Components/Profile/Profile'
import AdminDashboard from './Components/AdminDashboard/AdminDashboard'
import BrowseMovies from './Components/BrowseMovies/BrowseMovies'
import PublicProfile from './Components/Profile/PublicProfile'

function App() {
  return (
    <div className='font-semibold bg-sky-900 min-h-screen'>
      {/* 2. Wrap everything inside AuthProvider */}
    
        <HashRouter>
          <Routes>
            <Route element={<NavbarLayout />}> 
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<HomePage/>} />
                <Route path="/admin" element={<AdminDashboard/>} />
                <Route path="/profile" element={<Profile/>}/>
               <Route path="/profile" element={<Profile />} />
<Route path="/profile/:username" element={<PublicProfile />} />
              </Route>

              <Route path="/movies/:id/details" element={<MovieCard />} />
              <Route path="/search" element={<SearchResult />} />
              <Route path="/about" element={<div className='h-screen'><h1>About Us</h1></div>} />
              <Route path="*" element={<Notfound/>}/>
              <Route path="/browse" element={<BrowseMovies/>}/>
            </Route>

            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </HashRouter>
      
    </div>
  )
}

export default App