import "./LoginForm.css"
import React, { useState, useEffect } from 'react'




const LoginForm = () => {


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')



  return (
    <div className='login-form'>
      <div className='form-container'>
        <h1>Login</h1>
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
       
       <div className="button-group">
  <button>
    Login
  </button>
  <button>
    Register
  </button>
</div>
        
      </div>
    </div>
  )
}

export default LoginForm