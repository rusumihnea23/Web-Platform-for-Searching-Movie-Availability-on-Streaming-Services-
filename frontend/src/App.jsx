import { React,useState } from 'react'
import './App.css'
import LoginForm from './Components/LoginForm/LoginForm'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import RegisterForm from './Components/RegisterForm/RegisterForm'
import PrivateRoutes from './Components/Routes/PrivateRoutes'
import NavbarLayout from './Components/Navbar/NavbarLayout'
import Notfound from './Components/Notfound/Notfound'
import Movie from './Components/MovieList/Movie/Movie'
import HomePage from './Components/HomePage/HomePage'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div >
      
        <BrowserRouter>
    <Routes>
    {/* Pagini cu navbar are un outlet inauntru care ii spune ca mai are nevoie de ceva */}
    <Route element={<NavbarLayout />}> 
      {/* Pagini private umple primul outlet si inauntru mai are unul unde vine magina propriu zisa */}
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<HomePage/>} />
      </Route>

      {/* Pagini publice */}
      <Route path="/about" element={<h1>About Us</h1>} />
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
