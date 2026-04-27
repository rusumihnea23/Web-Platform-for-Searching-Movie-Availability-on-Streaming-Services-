import React, { useState } from 'react'; // Removed useEffect since it's unused
import { register } from "../../../Actions/AuthActions";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState(''); // 1. Added username state

  const handleRegister = async (e) => {
    e.preventDefault();
    // 2. Added username to the action call
    const success = await register(firstName, lastName, username, email, password);
    
    if (success) {
      navigate("/");
    } else {
      alert("Registration failed. Username or Email might be taken.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-sky-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <h1 className="font-mono text-center text-sky-800 text-xl font-bold">Create an account</h1>
          
          <input
            className="border rounded-md p-2 text-sky-800"
            value={firstName}
            onChange={(e) => setfirstName(e.target.value)}
            placeholder="First Name"
            required
          />
          
          <input
            className="border rounded-md p-2 text-sky-800"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />

          {/* 3. Added Username Input Field */}
          <input
            className="border rounded-md p-2 text-sky-800"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />

          <input
            className="border rounded-md p-2 text-sky-800"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          
          <input
            className="border rounded-md p-2 text-sky-800"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <button 
            className="bg-sky-800 text-white rounded-md p-2 hover:bg-sky-950 transition-colors" 
            type="submit"
          >
            Register
          </button>

          <div className="flex items-center gap-2 justify-center text-sm">
            <h1>Already have an account?</h1> 
            <button 
              type="button" 
              className="text-sky-800 font-bold hover:underline" 
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;