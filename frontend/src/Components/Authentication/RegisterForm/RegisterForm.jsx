import React, { useState, useEffect } from 'react'
import {register} from "../../../Actions/AuthActions"
import { useNavigate } from "react-router-dom"


const RegisterForm = () => {
  const navigate=useNavigate();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setfirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const handleRegister = async (e) => {
  e.preventDefault();
  await register(firstName,lastName,email,password)
  navigate("/");

};


  return (
    <div className="flex items-center justify-center min-h-screen bg-sky-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
    <form onSubmit={handleRegister} className="flex flex-col space-y-4">
       <h1 className="font-mono text-center text-sky-800">Create an account </h1>
        <input
         className="border rounded-md p-2 text-sky-800"
        value={firstName}
        onChange={(e) => setfirstName(e.target.value)}
        placeholder="firstName"
      />
      
        <input
         className="border rounded-md p-2 text-sky-800"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="lastName"
      />
      <input
       className="border rounded-md p-2 text-sky-800"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
       className="border rounded-md p-2 text-sky-800"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button className="bg-sky-800 text-white rounded-md p-2 hover:bg-sky-950" type="submit">Register</button>
      <div className="flex items-center gap-2">
          <h1>Already have an account?</h1> 
          <button type="button"className="text-sky-800 font-bold hover:underline" onClick={() => navigate("/login")}>Login</button>
        </div>
    </form>
    </div>
    </div>
  )
}

export default RegisterForm