import { useState } from "react"
import { signupUser } from "../services/api"
import { useNavigate } from "react-router-dom"
const SignUp = ()=>{
    const navigate = useNavigate()
    const[email,setEmail] = useState("")
    const[password,setPassword] = useState("")
    const handleSignup = async () => {
  try {
    await signupUser(email, password);
    alert("Signup successful!");
    navigate("/login");
  } catch (error) {
    alert(error.message);
  }
};
    return(
  <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center relative overflow-hidden">

    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 blur-2xl opacity-50"></div>
    <div className="relative z-10 w-full max-w-5xl flex items-center justify-center gap-20 px-6">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center max-w-sm -mt-4">
        
        <h1 className="text-3xl font-bold mb-4 leading-tight">
          Start your <br />
          interview journey <br />
          <span className="text-blue-400">today</span>
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed space-y-2">
          <span>Track applications</span><br />
          <span>Stay organized</span><br />
          <span>Get hired faster</span>
        </p>

      </div>

      {/* RIGHT SIDE (SIGNUP CARD) */}
      <div className="bg-slate-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        
        <h2 className="text-2xl font-semibold mb-2">
          Sign Up
        </h2>

        <p className="text-sm text-slate-400 mb-4">
          Create your account to get started.
        </p>

        <div className="flex flex-col gap-4">

          <input
            className="bg-slate-700 text-slate-100 px-3 py-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="bg-slate-700 text-slate-100 px-3 py-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSignup}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition w-full active:scale-95"
          >
            Create Account
          </button>

        </div>

        {/* SWITCH TO LOGIN */}
        <p className="text-sm text-slate-400 mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log In
          </span>
        </p>

      </div>

    </div>

  </div>
);
}
export default SignUp