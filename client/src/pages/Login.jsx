import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/admin");
        } catch (error) {
            alert("Login failed. Please check your credentials.");
        }
    }
    return (
  <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">

    <div className="w-96 bg-[#1e293b] p-10 rounded-2xl shadow-2xl border border-white/10">

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-orange-400">
          Admin Login
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Access dashboard
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-4">

        <input
          type="email"
          className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full cursor-pointer bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
        >
          Login
        </button>

      </div>

    </div>

  </div>
);
}
export default Login;