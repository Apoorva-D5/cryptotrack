import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* --- Glow Backgrounds --- */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 opacity-30 blur-[140px]" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-600 opacity-30 blur-[160px]" />

      {/* --- Floating Crypto Logos --- */}
      <img
        src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
        className="floating-icon absolute top-32 left-20 w-16 opacity-80"
        alt="btc"
      />
      <img
        src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
        className="floating-icon absolute top-60 right-32 w-14 opacity-80"
        alt="eth"
      />
      <img
        src="https://cryptologos.cc/logos/solana-sol-logo.png"
        className="floating-icon absolute bottom-40 left-40 w-14 opacity-80"
        alt="sol"
      />
      <img
        src="https://cryptologos.cc/logos/dogecoin-doge-logo.png"
        className="floating-icon absolute bottom-20 right-20 w-16 opacity-80"
        alt="doge"
      />

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-12 py-6 relative z-20">
        <h1 className="text-4xl font-extrabold tracking-wider">
          CryptoTrack<span className="text-purple-500"></span>
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-transparent border border-white/30
                       rounded-full hover:bg-white/10 backdrop-blur-lg
                       transition duration-300"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600
                       rounded-full hover:opacity-90 transition shadow-lg"
          >
            Register
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-20 flex flex-col items-center text-center mt-20 px-10">
        <h2 className="text-6xl font-extrabold mb-6 fade-in-up">
          Track. Analyze. Grow.
        </h2>

        <p className="text-xl text-gray-300 max-w-3xl mb-12 fade-in-up delay-1">
          Your all-in-one crypto dashboard with real-time market data, watchlists,
          portfolio analytics and interactive charts — powered by CoinGecko API.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="px-12 py-4 text-xl font-semibold 
                     bg-gradient-to-r from-purple-600 to-blue-600 
                     rounded-full hover:scale-105 transition-all shadow-xl fade-in-up delay-3"
        >
          Get Started →
        </button>
      </section>

      {/* ------------------- SECTION 2: FEATURES ------------------- */}
      <section className="relative z-20 mt-32 px-10">
        <h3 className="text-4xl font-bold text-center mb-12">
          Powerful Features at Your Fingertips
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Live Crypto Prices", icon: "💹", desc: "Real-time market data from CoinGecko API." },
            { title: "Portfolio Tracking", icon: "📊", desc: "Track investments, profits and performance." },
            { title: "Watchlist", icon: "⭐", desc: "Instantly monitor your favourite coins." },
            { title: "Interactive Charts", icon: "📈", desc: "Explore 30-day price charts for each crypto." }
          ].map((f, i) => (
            <div
              key={i}
              className="feature-card text-center p-6 rounded-2xl shadow-lg border border-white/10"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h4 className="text-2xl font-semibold mb-2">{f.title}</h4>
              <p className="text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------- SECTION 3 (UPDATED CONTENT) ------------------- */}
      <section className="relative z-20 mt-32 px-10 pb-20">
        <h3 className="text-4xl font-bold text-center mb-12">
          Built for Crypto Enthusiasts Like You
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: "Fast & Accurate", sub: "Minute-by-minute price updates" },
            { value: "Secure Data", sub: "JWT authentication + protected APIs" },
            { value: "Beginner Friendly", sub: "Clean UI with simple navigation" },
            { value: "Advanced Tools", sub: "Charts, analytics & portfolio stats" }
          ].map((s, i) => (
            <div
              key={i}
              className="stat-card p-6 rounded-2xl text-center border border-white/10 shadow-lg"
            >
              <h3 className="text-3xl font-bold text-purple-400">{s.value}</h3>
              <p className="text-gray-300 mt-2">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

    

      {/* CSS */}
      <style>{`
        .floating-icon {
          animation: float 6s infinite ease-in-out alternate;
        }
        @keyframes float {
          from { transform: translateY(0px); }
          to { transform: translateY(-25px); }
        }

        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1.2s forwards ease-out;
        }
        .delay-1 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.9s; }

        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Feature Cards */
        .feature-card {
          backdrop-filter: blur(12px);
          background: rgba(255,255,255,0.06);
          transition: 0.3s;
        }
        .feature-card:hover {
          transform: scale(1.05);
          background: rgba(255,255,255,0.10);
        }

        /* Stat Cards */
        .stat-card {
          backdrop-filter: blur(12px);
          background: rgba(255,255,255,0.05);
          transition: 0.3s;
        }
        .stat-card:hover {
          transform: scale(1.05);
        }

        /* Glow Cards */
        .glow-card {
          background: rgba(255, 255, 255, 0.06);
          padding: 26px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: 0.35s ease;
          position: relative;
          overflow: hidden;
        }

        .glow-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 18px;
          padding: 2px;
          background: linear-gradient(135deg, rgba(139,92,246,0.8), rgba(59,130,246,0.8), rgba(139,92,246,0.8));
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          opacity: 0;
          transition: opacity .4s;
        }

        .glow-card:hover::before {
          opacity: 1;
        }

        .glow-card:hover {
          transform: scale(1.04);
          background: rgba(255, 255, 255, 0.10);
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }

        .glow-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .glow-text {
          color: #d1d5db;
          line-height: 1.5;
        }

      `}</style>
    </div>
  );
}
