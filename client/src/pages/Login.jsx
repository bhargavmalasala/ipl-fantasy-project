import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await api.post("auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/admin");
        } catch (error) {
            alert("Login failed. Please check your credentials.");
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white p-10 rounded-2xl shadow-xl w-96">
    <h2 className="text-2xl font-bold mb-6 text-center">
      Admin Login
    </h2>

    <div className="space-y-4">
      <input
        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Login
      </button>
    </div>
  </div>
</div>
    );
}
export default Login;