import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoList from "./CryptoList";

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("username");
    setUsername(name || "User");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* ---------------- COLLAPSIBLE SIDEBAR ---------------- */}
      <aside className="group relative bg-black/40 backdrop-blur-xl border-r border-white/10
                        min-h-screen text-white px-4 py-8 transition-all duration-300 
                        w-20 hover:w-64 overflow-hidden shadow-xl">

        {/* Gradient Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-blue-600/10 
                        blur-2xl opacity-40 pointer-events-none"></div>

        {/* LOGO */}
        <h1 className="text-2xl font-extrabold tracking-widest mb-12 whitespace-nowrap 
                      transition-opacity duration-300
                      opacity-0 group-hover:opacity-100 relative z-10 ml-2">
          Crypto<span className="text-purple-500">Track</span>
        </h1>

        {/* NAV */}
        <nav className="flex flex-col gap-4 relative z-10">

          <button onClick={() => navigate("/dashboard")} className="sidebar-item">
            <span className="text-xl">🏠</span>
            <span className="sidebar-text">Dashboard</span>
          </button>

          <button onClick={() => navigate("/portfolio")} className="sidebar-item">
            <span className="text-xl">📊</span>
            <span className="sidebar-text">Portfolio</span>
          </button>

          <button onClick={() => navigate("/portfolio-summary")} className="sidebar-item">
            <span className="text-xl">🧮</span>
            <span className="sidebar-text">Portfolio Summary</span>
          </button>

          <button onClick={() => navigate("/watchlist")} className="sidebar-item">
            <span className="text-xl">⭐</span>
            <span className="sidebar-text">Watchlist</span>
          </button>

          <button
            onClick={handleLogout}
            className="sidebar-item text-red-400 hover:bg-red-600/30 mt-10"
          >
            <span className="text-xl">🔴</span>
            <span className="sidebar-text">Logout</span>
          </button>

        </nav>

        {/* Sidebar Styles */}
        <style>{`
          .sidebar-item {
            width: 100%;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 14px;
            color: #d1d5db;
            transition: background 0.3s ease, color 0.3s ease;
            overflow: hidden;
            white-space: nowrap;
          }
          .sidebar-item:hover {
            background: rgba(255,255,255,0.12);
            color: white;
          }

          .sidebar-text {
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.3s ease;
          }

          .group:hover .sidebar-text {
            opacity: 1;
            transform: translateX(0);
          }
        `}</style>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 p-10">

        <div className="flex justify-between items-center mb-10">
          <span className="text-xl font-semibold">
            Welcome,  👋
          </span>
        </div>

        {/* DASHBOARD CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="dashboard-card">
            <h3 className="card-title">Watchlist</h3>
            <p className="card-value">⭐ Track your favourite coins</p>
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Portfolio</h3>
            <p className="card-value">📊 Manage your holdings</p>
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Live Charts</h3>
            <p className="card-value">📈 View 30-day analysis</p>
          </div>

        </div>

        <div className="mt-10"></div>

        <CryptoList />

      </main>

      {/* Card Styles */}
      <style>{`
        .dashboard-card {
          background: linear-gradient(135deg, rgba(90,0,140,0.4), rgba(0,112,255,0.3));
          padding: 22px;
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: 0.3s;
        }
        .dashboard-card:hover {
          transform: scale(1.03);
        }
      `}</style>

    </div>
  );
}
