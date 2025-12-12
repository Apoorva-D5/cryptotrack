import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CryptoList from "./pages/CryptoList";
import Portfolio from "./pages/Portfolio";
import Watchlist from "./pages/Watchlist";
import PortfolioSummary from "./pages/PortfolioSummary";
import PortfolioCharts from "./pages/PortfolioCharts";
import CryptoChart from "./pages/CryptoChart";
import Landing from "./pages/Landing";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
    <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(255,255,255,0.1)",
            color: "white",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          },
        }}
      />
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crypto"
          element={
            <ProtectedRoute>
              <CryptoList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio-summary"
          element={
            <ProtectedRoute>
              <PortfolioSummary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio-charts"
          element={
            <ProtectedRoute>
              <PortfolioCharts />
            </ProtectedRoute>
          }
        />

        <Route path="/crypto/:id" element={<CryptoChart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
