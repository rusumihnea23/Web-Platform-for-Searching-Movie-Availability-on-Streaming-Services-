import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {login} from "../../Actions/AuthActions"

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  await login(email,password)
  navigate("/");
};

 return (
    <div className="flex items-center justify-center min-h-screen bg-sky-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <h1 className="font-mono text-center text-sky-800">Sign-In to your account </h1>
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

          <button
            className="bg-sky-800 text-white rounded-md p-2 hover:bg-sky-950"
            type="submit"
          >
            Login
          </button>
          <div className="flex items-center gap-2">
          <h1>Don't have an account?</h1> 
          <button type="button"className="text-sky-800 font-bold hover:underline" onClick={() => navigate("/register")}>Sign In</button>
        </div>
        </form>
      </div>
    </div>
  );
}
export default LoginForm;