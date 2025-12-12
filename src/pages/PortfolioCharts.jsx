import { useEffect, useState } from "react";
import axios from "axios";
import { getUserPortfolio } from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import BackButton from "../components/BackButton";
export default function PortfolioCharts() {
  const [portfolio, setPortfolio] = useState([]);
  const [prices, setPrices] = useState({});
  const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#FF6384", "#AA66CC"];

  // Load portfolio
  useEffect(() => {
    const loadPortfolio = async () => {
      const res = await getUserPortfolio();
      setPortfolio(res.data);
    };
    loadPortfolio();
  }, []);

  // Load live prices
  useEffect(() => {
    const loadPrices = async () => {
      const ids = portfolio.map((p) => p.coinId).join(",");
      if (!ids) return;

      const res = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        {
          params: { ids, vs_currencies: "usd" },
        }
      );

      setPrices(res.data);
    };
    loadPrices();
  }, [portfolio]);

  // -----------------------
  // PIE CHART DATA
  // -----------------------
  const pieData = portfolio.map((item) => {
    const value = (prices[item.coinId]?.usd || 0) * item.quantity;
    return {
      name: item.coinName,
      value,
    };
  });

  // -----------------------
  // BAR CHART DATA (P/L per coin)
  // -----------------------
  const barData = portfolio.map((item) => {
    const current = (prices[item.coinId]?.usd || 0) * item.quantity;
    const invested = item.buyPrice * item.quantity;
    return {
      name: item.coinName,
      profit: current - invested,
    };
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📊 Portfolio Analytics
      </h1>

      {/* PIE CHART */}
      <div className="bg-white p-6 shadow rounded-lg mb-10">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Portfolio Distribution
        </h2>

        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* BAR CHART */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Profit / Loss by Coin
        </h2>

        <BarChart width={500} height={300} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar dataKey="profit" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
}
