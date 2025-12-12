import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import BackButton from "../components/BackButton";

import {
  addToPortfolio,
  getUserPortfolio,
  deletePortfolioItem,
} from "../services/api";

import {
  PieChart,
  Pie,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [coinId, setCoinId] = useState("");
  const [coinName, setCoinName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  const [prices, setPrices] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  const loadPortfolio = async () => {
    try {
      setLoadingPortfolio(true);
      const res = await getUserPortfolio();
      setPortfolio(res.data || []);
    } catch (error) {
      console.error("Load portfolio error", error);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const loadLivePrices = async () => {
    try {
      const ids = portfolio.map((p) => p.coinId).filter(Boolean);
      if (!ids.length) {
        setPrices({});
        return;
      }

      setLoadingPrices(true);
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        { params: { ids: ids.join(","), vs_currencies: "usd" } }
      );

      setPrices(res.data || {});
    } catch (error) {
      console.error("Price fetch error", error);
    } finally {
      setLoadingPrices(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  useEffect(() => {
    loadLivePrices();
  }, [portfolio]);

  const handleAdd = async () => {
    if (!coinId || !coinName || !quantity || !buyPrice) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await addToPortfolio({
        coinId: coinId.trim(),
        coinName: coinName.trim(),
        quantity: Number(quantity),
        buyPrice: Number(buyPrice),
      });

      await loadPortfolio();
      setCoinId("");
      setCoinName("");
      setQuantity("");
      setBuyPrice("");

      toast.success("Added to portfolio!");
    } catch (error) {
      toast.error("Error adding entry");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePortfolioItem(id);
      await loadPortfolio();
      toast.success("Deleted successfully!");
    } catch {
      toast.error("Error deleting");
    }
  };

  const summary = useMemo(() => {
    let invested = 0;
    let currentValue = 0;

    portfolio.forEach((item) => {
      const q = Number(item.quantity);
      invested += q * Number(item.buyPrice);

      const cur = prices[item.coinId]?.usd || 0;
      currentValue += q * cur;
    });

    return {
      invested,
      currentValue,
      profit: currentValue - invested,
    };
  }, [portfolio, prices]);

  const fm = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const pieData = portfolio.map((item) => ({
    name: item.coinName,
    value: (prices[item.coinId]?.usd || 0) * item.quantity,
  }));

  const barData = portfolio.map((item) => {
    const cur = prices[item.coinId]?.usd || 0;
    const invested = item.buyPrice * item.quantity;
    const currentValue = item.quantity * cur;

    return {
      name:
        item.coinName.length > 10
          ? item.coinName.slice(0, 10) + "…"
          : item.coinName,
      profit: currentValue - invested,
    };
  });

  return (
    <div className="p-6 min-h-screen text-white bg-gradient-to-br from-black via-gray-900 to-black">
      <BackButton />

      <h1 className="text-3xl font-bold mb-8">Your Portfolio</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          {
            title: "Total Investment",
            value: `$${fm(summary.invested)}`,
            bg: "rgba(139,92,246,0.08)",
          },
          {
            title: "Current Value",
            value: `$${fm(summary.currentValue)}`,
            bg: "rgba(59,130,246,0.08)",
          },
          {
            title: "Profit / Loss",
            value: `$${fm(summary.profit)}`,
            bg:
              summary.profit >= 0
                ? "rgba(34,197,94,0.10)"
                : "rgba(239,68,68,0.10)",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border backdrop-blur-xl"
            style={{
              background: card.bg,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="text-gray-300 text-sm">{card.title}</div>
            <div className="text-3xl font-bold mt-2">{card.value}</div>
          </div>
        ))}
      </div>

      {/* LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">
          {/* ADD FORM */}
          <div className="glass-box p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Add Crypto</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="input-dark"
                placeholder="Coin ID"
                value={coinId}
                onChange={(e) => setCoinId(e.target.value)}
              />
              <input
                className="input-dark"
                placeholder="Coin Name"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
              />
              <input
                className="input-dark"
                placeholder="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <input
                className="input-dark"
                placeholder="Buy Price (USD)"
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
              />
            </div>

            <button className="btn-purple mt-5" onClick={handleAdd}>
              Add to Portfolio
            </button>
          </div>

          {/* TABLE */}
          <div className="glass-box p-4 rounded-2xl overflow-auto">
            <table className="w-full">
              <thead className="text-gray-400">
                <tr>
                  <th className="p-3">Coin</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3 text-right">Buy Price</th>
                  <th className="p-3 text-right">Current</th>
                  <th className="p-3 text-right">Value</th>
                  <th className="p-3 text-right">P/L</th>
                  <th className="p-3 text-center">Delete</th>
                </tr>
              </thead>

              <tbody>
                {portfolio.map((item) => {
                  const cur = prices[item.coinId]?.usd || 0;
                  const invested = item.buyPrice * item.quantity;
                  const currentValue = item.quantity * cur;
                  const profit = currentValue - invested;

                  return (
                    <tr
                      key={item._id}
                      className="border-b border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="p-3">{item.coinName}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">${fm(item.buyPrice)}</td>
                      <td className="p-3 text-right">${fm(cur)}</td>
                      <td className="p-3 text-right">${fm(currentValue)}</td>
                      <td
                        className={`p-3 text-right font-semibold ${
                          profit >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        ${fm(profit)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                          onClick={() => handleDelete(item._id)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SIDE — CHARTS */}
        <div className="space-y-8">
          {/* PIE CHART */}
          <div className="glass-box p-4 rounded-2xl">
            <h3 className="text-lg font-bold mb-2">Portfolio Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    fill="#8b5cf6"
                    label
                  />
                  <ReTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BAR CHART */}
          <div className="glass-box p-4 rounded-2xl">
            <h3 className="text-lg font-bold mb-2">Profit / Loss by Coin</h3>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <ReTooltip />
                  <Legend />
                  <Bar dataKey="profit" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .glass-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
        }
        .input-dark {
          padding: 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
        }
        .btn-purple {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: bold;
          transition: 0.3s;
        }
        .btn-purple:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
