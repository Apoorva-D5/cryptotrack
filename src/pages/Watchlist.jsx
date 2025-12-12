import { useEffect, useState } from "react";
import { getWatchlist, deleteWatchlistItem } from "../services/api";
import axios from "axios";
import BackButton from "../components/BackButton";




export default function Watchlist() {
  const [items, setItems] = useState([]);
  const [prices, setPrices] = useState({});

  const loadWatchlist = async () => {
    const res = await getWatchlist();
    setItems(res.data);
  };

  const loadPrices = async () => {
    const ids = items.map((i) => i.coinId).join(",");
    if (!ids) return;

    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: { ids, vs_currencies: "usd", include_24hr_change: true },
      }
    );

    setPrices(res.data);
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  useEffect(() => {
    loadPrices();
  }, [items]);

  const fm = (n) =>
    typeof n === "number"
      ? n.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : n;

  return (
    
    <div className="min-h-screen p-6 text-white bg-gradient-to-br from-black via-gray-900 to-black">
       <BackButton />
      <h1 className="text-3xl font-bold mb-6">Your Watchlist ⭐</h1>

      {/* MAIN CARD */}
      <div
        className="p-6 rounded-2xl overflow-auto"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(10px)",
        }}
      >
        {items.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            Watchlist is empty — add coins from the dashboard.
          </p>
        ) : (
          <table className="w-full text-left text-gray-300">
            <thead className="text-sm text-gray-400 border-b border-white/10">
              <tr>
                <th className="p-3">Coin</th>
                <th className="p-3 text-right">Live Price</th>
                <th className="p-3 text-right">24h</th>
                <th className="p-3 text-center">Remove</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => {
                const live = prices[item.coinId]?.usd;
                const change = prices[item.coinId]?.usd_24h_change;

                return (
                  <tr
                    key={item._id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-3 font-medium text-white">{item.coinName}</td>

                    <td className="p-3 text-right text-white font-semibold">
                      ${fm(live || "Loading...")}
                    </td>

                    <td
                      className={`p-3 text-right font-semibold ${
                        change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {change ? change.toFixed(2) : "--"}%
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          deleteWatchlistItem(item._id).then(loadWatchlist)
                        }
                        className="px-4 py-1 rounded-md bg-red-500/70 hover:bg-red-600 transition font-semibold"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="text-sm text-gray-400 mt-4">
 
        Live prices provided by CoinGecko
      </div>
    </div>
  );
}
