import { Link } from "react-router-dom";
import BackButton from "./BackButton";
export default function Navbar() {
  const token = localStorage.getItem("token");

  return (
    <nav className="p-4 bg-black text-white flex justify-between">
      <h2 className="text-xl font-bold">CryptoTracker</h2>

      <div className="flex gap-4">
        {!token && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {token && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/crypto">Crypto Prices</Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                window.location.href = "/login";
              }}
              className="text-red-400"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
