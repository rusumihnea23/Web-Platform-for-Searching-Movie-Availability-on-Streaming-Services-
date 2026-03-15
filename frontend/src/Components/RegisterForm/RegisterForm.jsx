import "./RegisterForm.css"
import React, { useState, useEffect } from 'react'




const RegisterForm = () => {


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setfirstName] = useState('')
  const [lastName, setLastName] = useState('')


  return (
    <div className='register-form'>
      <div className='form-container'>
        <h1>Register</h1>
        <div className="Names">
             <input
          type='text'
          placeholder='First Name'
          value={email}
          onChange={e => setfirstName(e.target.value)}
          className="Name"
        />
         <input
          type='text'
          placeholder='Last Name'
          value={email}
          onChange={e => setLastName(e.target.value)}
          className="Name"
        />
        </div>
        
        <input
          type='text'
          placeholder='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button >
          Register
        </button>
       
      </div>
    </div>
  )
}

export default RegisterForm