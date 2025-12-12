import { useEffect, useMemo, useState } from "react";
import { getUserPortfolio } from "../services/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
/**
 * PortfolioSummary.jsx
 * - Uses sparkline data from localStorage key "coins_with_sparkline" if available.
 * - Fallbacks to a tiny simulated sparkline if not available.
 * - Adds real-time ticker, best/worst performers, quick actions (Add, Refresh, Export CSV).
 *
 * NOTE:
 * In your CryptoList fetch, if you used CoinGecko with sparkline=true, store:
 * localStorage.setItem('coins_with_sparkline', JSON.stringify(res.data));
 * so PortfolioSummary can reuse that sparkline_in_7d.price for mini charts.
 */

export default function PortfolioSummary() {
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  // ticker coins
  const [ticker, setTicker] = useState([]);

  // Load portfolio
  const loadPortfolio = async () => {
    try {
      const res = await getUserPortfolio();
      setPortfolio(res.data || []);
    } catch (err) {
      console.error("Load portfolio error", err);
      setPortfolio([]);
    }
  };

  // Load prices for portfolio coins in batches
  const loadPrices = async () => {
    try {
      if (!portfolio.length) {
        setPrices({});
        setLoading(false);
        return;
      }
      const ids = portfolio.map((p) => p.coinId).filter(Boolean).join(",");
      if (!ids) {
        setPrices({});
        setLoading(false);
        return;
      }
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        {
          params: {
            ids,
            vs_currencies: "usd",
            include_24hr_change: true,
          },
        }
      );
      setPrices(res.data || {});
    } catch (err) {
      console.error("Price load error", err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time ticker (top 5 market cap)
  const loadTicker = async () => {
    try {
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 5,
            page: 1,
            sparkline: false,
            price_change_percentage: "24h",
          },
        }
      );
      setTicker(res.data || []);
    } catch (err) {
      console.error("Ticker error", err);
    }
  };

  useEffect(() => {
    loadPortfolio();
    loadTicker();
    // ticker repeated every 20s
    const t = setInterval(loadTicker, 20000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    loadPrices();
  }, [portfolio]);

  // Derived summary values
  const summary = useMemo(() => {
    let invested = 0;
    let currentValue = 0;
    portfolio.forEach((item) => {
      const q = Number(item.quantity || 0);
      const bp = Number(item.buyPrice || 0);
      invested += q * bp;
      const cur = Number(prices[item.coinId]?.usd || 0);
      currentValue += q * cur;
    });
    return {
      invested,
      currentValue,
      profit: currentValue - invested,
    };
  }, [portfolio, prices]);

  const fm = (n) =>
    typeof n === "number" ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00";

  // Best & worst performers based on today's % change
  const performers = useMemo(() => {
    if (!portfolio.length) return { best: null, worst: null };
    const items = portfolio.map((p) => {
      const change =
        Number(prices[p.coinId]?.usd_24h_change ?? prices[p.coinId]?.usd_24h ?? 0) || 0;
      return {
        ...p,
        change,
        current: Number(prices[p.coinId]?.usd || 0),
      };
    });
    const sorted = items.sort((a, b) => b.change - a.change);
    return {
      best: sorted[0] || null,
      worst: sorted[sorted.length - 1] || null,
    };
  }, [portfolio, prices]);

  // Get sparkline data from localStorage saved by CryptoList (if any)
  const storedCoins = useMemo(() => {
    try {
      const raw = localStorage.getItem("coins_with_sparkline");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }, []);

  // helper to render a tiny svg sparkline (7-12 points)
  const Sparkline = ({ coinId, smallData }) => {
    // try storedCoins first
    let data = null;
    if (storedCoins) {
      const c = storedCoins.find((x) => x.id === coinId);
      if (c && c.sparkline_in_7d && Array.isArray(c.sparkline_in_7d.price)) {
        data = c.sparkline_in_7d.price.slice(-12);
      }
    }
    if (!data && Array.isArray(smallData)) data = smallData.slice(-12);

    // fallback simulated tiny trend
    if (!data || !data.length) {
      data = Array.from({ length: 12 }, (_, i) =>
        1 + Math.sin((i / 12) * Math.PI * 2) * 0.02 + Math.random() * 0.02
      );
    }

    const width = 120;
    const height = 30;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data
      .map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");
    // color based on end - start
    const color = data[data.length - 1] >= data[0] ? "#8b5cf6" : "#ef4444";
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      </svg>
    );
  };

  // Quick CSV export
  const handleExportCSV = () => {
    if (!portfolio.length) {
      alert("No holdings to export");
      return;
    }
    const rows = [
      ["coinId", "coinName", "quantity", "buyPrice", "currentPrice", "currentValue", "profitLoss"],
    ];
    portfolio.forEach((p) => {
      const cur = Number(prices[p.coinId]?.usd || 0);
      const invested = Number(p.buyPrice) * Number(p.quantity);
      const currentValue = cur * Number(p.quantity || 0);
      const profitLoss = currentValue - invested;
      rows.push([p.coinId, p.coinName, p.quantity, p.buyPrice, cur, currentValue, profitLoss]);
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] p-6 text-white">
      <BackButton />
      {/* ========== TOP TICKER + TITLE ========== */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold">📊 Portfolio Summary</h1>

          {/* Quick action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/portfolio")}
              className="px-4 py-2 rounded-md font-semibold"
              style={{ background: "linear-gradient(90deg,#8b5cf6,#3b82f6)" }}
            >
              Add / Manage
            </button>

            <button
              onClick={() => {
                loadPortfolio();
                loadPrices();
              }}
              className="px-3 py-2 rounded-md bg-white/5"
            >
              Refresh
            </button>

            <button onClick={handleExportCSV} className="px-3 py-2 rounded-md bg-white/5">
              Export CSV
            </button>
          </div>
        </div>

        {/* Ticker */}
        <div className="flex items-center gap-4 overflow-x-auto py-2 px-3 rounded-lg border border-white/6 bg-white/2">
          {ticker.length === 0 ? (
            <div className="text-gray-300">Loading prices...</div>
          ) : (
            ticker.map((c) => (
              <div key={c.id} className="flex items-center gap-3 min-w-[160px]">
                <img src={c.image} alt="" className="w-6 h-6" />
                <div className="text-sm">
                  <div className="font-semibold">{c.symbol.toUpperCase()}</div>
                  <div className="text-xs text-gray-200">
                    ${Number(c.current_price).toLocaleString()}{" "}
                    <span className={c.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"}>
                      {c.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========== SUMMARY CARDS WITH MINI SPARKLINES ========== */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Investment */}
        <div
          className="p-5 rounded-2xl border"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.06))",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 30px rgba(139,92,246,0.06)",
          }}
        >
          <div className="text-sm text-gray-300">Total Investment</div>
          <div className="text-2xl font-bold text-white mt-2">${fm(summary.invested)}</div>
          <div className="text-xs text-gray-400 mt-2">Sum of buy price × quantity</div>

          {/* sparkline attempt: use the first holding's sparkline or fallback */}
          <div className="mt-3">
            <div className="text-xs text-gray-300 mb-1">Recent trend</div>
            <div className="w-36">
              <Sparkline
                coinId={portfolio?.[0]?.coinId}
                smallData={storedCoins?.find((x) => x.id === portfolio?.[0]?.coinId)?.sparkline_in_7d?.price}
              />
            </div>
          </div>
        </div>

        {/* Current Value */}
        <div
          className="p-5 rounded-2xl border"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.06))",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 30px rgba(59,130,246,0.06)",
          }}
        >
          <div className="text-sm text-gray-300">Current Value</div>
          <div className="text-2xl font-bold text-white mt-2">${fm(summary.currentValue)}</div>
          <div className="text-xs text-gray-400 mt-2">Live market value (CoinGecko)</div>

          <div className="mt-3">
            <div className="text-xs text-gray-300 mb-1">Portfolio trend</div>
            <div className="w-36">
              <Sparkline
                coinId={portfolio?.[0]?.coinId}
                smallData={storedCoins?.find((x) => x.id === portfolio?.[0]?.coinId)?.sparkline_in_7d?.price}
              />
            </div>
          </div>
        </div>

        {/* Profit / Loss */}
        <div
          className="p-5 rounded-2xl border"
          style={{
            background:
              summary.profit >= 0
                ? "linear-gradient(135deg, rgba(34,197,94,0.06), rgba(139,92,246,0.03))"
                : "linear-gradient(135deg, rgba(239,68,68,0.06), rgba(59,130,246,0.03))",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: summary.profit >= 0 ? "0 8px 30px rgba(34,197,94,0.06)" : "0 8px 30px rgba(239,68,68,0.06)",
          }}
        >
          <div className="text-sm text-gray-300">Profit / Loss</div>
          <div className={`text-2xl font-bold mt-2 ${summary.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
            ${fm(summary.profit)}
          </div>
          <div className="text-xs text-gray-400 mt-2">Current value − total investment</div>

          <div className="mt-3">
            <div className="text-xs text-gray-300 mb-1">Top holding trend</div>
            <div className="w-36">
              <Sparkline
                coinId={portfolio?.[0]?.coinId}
                smallData={storedCoins?.find((x) => x.id === portfolio?.[0]?.coinId)?.sparkline_in_7d?.price}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========== BEST / WORST PERFORMERS ========== */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* BEST */}
        <div className="p-5 rounded-2xl border" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-sm text-gray-300">Best Performer</div>
          {performers.best ? (
            <div className="mt-3 flex items-center gap-4">
              <div>
                <div className="text-lg font-bold text-white">{performers.best.coinName}</div>
                <div className="text-sm text-gray-300">{performers.best.coinId}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-lg font-bold text-green-400">{(performers.best.change || 0).toFixed(2)}%</div>
                <div className="text-xs text-gray-400">${fm(performers.best.current)}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 mt-3">No holdings yet</div>
          )}
        </div>

        {/* WORST */}
        <div className="p-5 rounded-2xl border" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-sm text-gray-300">Worst Performer</div>
          {performers.worst ? (
            <div className="mt-3 flex items-center gap-4">
              <div>
                <div className="text-lg font-bold text-white">{performers.worst.coinName}</div>
                <div className="text-sm text-gray-300">{performers.worst.coinId}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-lg font-bold text-red-400">{(performers.worst.change || 0).toFixed(2)}%</div>
                <div className="text-xs text-gray-400">${fm(performers.worst.current)}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 mt-3">No holdings yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
