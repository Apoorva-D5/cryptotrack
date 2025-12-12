import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";



export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await loginUser({ email, password });

      const { token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", email); // username = email now

      navigate("/dashboard");
    } catch (error) {
      alert(error?.response?.data?.msg || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">

      <div className="glass-box w-full max-w-md p-10 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center mb-6">
          Welcome Back
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="input-box"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="btn-primary w-full mt-4"
        >
          Login
        </button>

        <p className="mt-6 text-center text-gray-400">
          Don’t have an account?{" "}
          <span
            className="text-purple-400 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>

      <style>{`
        .glass-box {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
        }
        .input-box {
          width: 100%;
          padding: 12px;
          margin-bottom: 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
        }
        .btn-primary {
          padding: 12px;
          border-radius: 12px;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          font-weight: bold;
          transition: .3s;
        }
        .btn-primary:hover {
          transform: scale(1.03);
          box-shadow: 0 0 20px rgba(139,92,246,0.4);
        }
      `}</style>

    </div>
  );
}
