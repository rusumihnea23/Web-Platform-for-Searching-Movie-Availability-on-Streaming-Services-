import { React,useState } from 'react'
import './App.css'
import LoginForm from './Components/Authentication/LoginForm/LoginForm'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import RegisterForm from './Components/Authentication/RegisterForm/RegisterForm'
import PrivateRoutes from './Routes/PrivateRoutes'
import NavbarLayout from './Components/Navbar/NavbarLayout'
import Notfound from './Components/Notfound/Notfound'
import HomePage from './Components/HomePage/HomePage'
import SearchResult from './Components/Search/SearchResults/SearchResults'
import MovieCard from './Components/MovieCard/MovieCard'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='font-semibold bg-sky-900'>
      
        <BrowserRouter>
    <Routes>
    {/* Pagini cu navbar are un outlet inauntru care ii spune ca mai are nevoie de ceva */}
    <Route element={<NavbarLayout />}> 
      {/* Pagini private umple primul outlet si inauntru mai are unul unde vine magina propriu zisa */}
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<HomePage/>} />
      </Route>

      {/* Pagini publice */}
      <Route path="/movies/:id/details" element={<MovieCard />} />
      <Route path="/search" element={<SearchResult />} />
      <Route path="/about" element={<div  className='h-screen'><h1>About Us</h1></div>} />
      <Route path="*" element={<Notfound/>}/>
    </Route>

    {/* Pagini publice fara navbar */}
    <Route path="/login" element={<LoginForm />} />
    <Route path="/register" element={<RegisterForm />} />
  </Routes>
        </BrowserRouter>
    </div>

  )

}

export default App
