import { React,useState } from 'react'
import './App.css'
import LoginForm from './Components/LoginForm/LoginForm'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import RegisterForm from './Components/RegisterForm/RegisterForm'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      
        <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginForm />}  ></Route>
      <Route path="/register" element={<RegisterForm/>}></Route>
    </Routes>
        </BrowserRouter>
    </div>

  )

}

export default App
