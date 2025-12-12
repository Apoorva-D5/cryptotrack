import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import BackButton from "../components/BackButton";
export default function CryptoChart() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const priceRes = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
          { params: { vs_currency: "usd", days: 30 } }
        );

        const infoRes = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}`
        );

        const formatted = priceRes.data.prices.map((p) => ({
          time: new Date(p[0]).toLocaleDateString(),
          price: p[1],
        }));

        setHistory(formatted);
        setInfo(infoRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [id]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <BackButton />
      {info && (
        <h1 className="text-3xl font-bold mb-6">
          {info.name} — 30 Day Price Chart
        </h1>
      )}

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={history}>
          <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
