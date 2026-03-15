import "./RegisterForm.css"
import React, { useState, useEffect } from 'react'
import {register} from "../../Actions/AuthActions"
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
    <form onSubmit={handleRegister}>
        <input
        value={firstName}
        onChange={(e) => setfirstName(e.target.value)}
        placeholder="firstName"
      />
        <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="lastName"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  )
}

export default RegisterForm