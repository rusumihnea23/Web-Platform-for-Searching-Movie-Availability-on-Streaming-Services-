import { React,useState } from 'react'
import './App.css'
import LoginForm from './Components/LoginForm/LoginForm'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import RegisterForm from './Components/RegisterForm/RegisterForm'
import PrivateRoutes from './Components/Routes/PrivateRoutes'
import {logout} from "./Actions/AuthActions"
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      
        <BrowserRouter>
    <Routes>
     {/* PRIVATE ROUTES */}
       <Route
          path="/"
          element={
            <PrivateRoutes>
              <h1>Titlu</h1>
              <button onClick={logout}>logout</button>
            </PrivateRoutes>
          }
        />
        <Route path="*" element={<PrivateRoutes><h1>Aici esti redirectionat</h1></PrivateRoutes>}/>
         {/* trebuie schimbat cu HomePage sau cv de genul */}

      {/* AUTH ROUTES */}
      <Route path="/login" element={<LoginForm />}  ></Route>
      <Route path="/register" element={<RegisterForm/>}></Route>
    </Routes>
        </BrowserRouter>
    </div>

  )

}

export default App
