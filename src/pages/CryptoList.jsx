import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { addToWatchlist } from "../services/api"; // ⭐ IMPORTANT
import BackButton from "../components/BackButton";

export default function CryptoList() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTop, setFilterTop] = useState(null);
  const [search, setSearch] = useState("");

  // Pagination
  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch coins
  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 250,
              page: 1,
              sparkline: true,
              price_change_percentage: "1h,24h,7d",
            },
          }
        );
        setCoins(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  // FILTER + SEARCH
  const processedCoins = useMemo(() => {
    let list = [...coins];

    if (search.trim()) {
      list = list.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterTop) {
      list = list.slice(0, filterTop);
    }

    return list;
  }, [coins, filterTop, search]);

  // PAGINATION
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedCoins = processedCoins.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(processedCoins.length / itemsPerPage);

  // Sparkline mini-chart
  const Sparkline = ({ data }) => {
    if (!data) return "—";

    const max = Math.max(...data);
    const min = Math.min(...data);
    const height = 40;
    const width = 120;

    const scaleX = width / data.length;
    const scaleY = height / (max - min);

    const points = data
      .map((val, i) => `${i * scaleX},${height - (val - min) * scaleY}`)
      .join(" ");

    return (
      <svg width={width} height={height}>
        <polyline fill="none" stroke="lime" strokeWidth="2" points={points} />
      </svg>
    );
  };

  return (
    <div className="mt-12">
      {/* SEARCH + FILTERS */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
       
        <input
          type="text"
          placeholder="Search coin..."
          className="px-4 py-2 w-60 bg-white/10 rounded-lg border border-white/20 text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-3">
          <button onClick={() => setFilterTop(null)} className="filter-btn">All</button>
          <button onClick={() => setFilterTop(10)} className="filter-btn">Top 10</button>
          <button onClick={() => setFilterTop(20)} className="filter-btn">Top 20</button>
          <button onClick={() => setFilterTop(50)} className="filter-btn">Top 50</button>
          <button onClick={() => setFilterTop(100)} className="filter-btn">Top 100</button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl border border-white/10">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Coin</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">1h</th>
                <th className="px-4 py-3">24h</th>
                <th className="px-4 py-3">7d</th>
                <th className="px-4 py-3">24h Volume</th>
                <th className="px-4 py-3">Market Cap</th>
                <th className="px-4 py-3">Last 7 Days</th>
                <th className="px-4 py-3">Watchlist</th> {/* ⭐ ADDED */}
              </tr>
            </thead>

            <tbody>
              {paginatedCoins.map((coin, index) => (
                <tr
                  key={coin.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3">{indexOfFirst + index + 1}</td>

                  <td className="px-4 py-3 flex items-center gap-4">
                    <img src={coin.image} className="w-7 h-7" alt="" />
                    {coin.name}
                  </td>

                  <td className="px-4 py-3">${coin.current_price.toLocaleString()}</td>

                  <td
                    className={`px-4 py-3 ${
                      coin.price_change_percentage_1h_in_currency > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
                  </td>

                  <td
                    className={`px-4 py-3 ${
                      coin.price_change_percentage_24h > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>

                  <td
                    className={`px-4 py-3 ${
                      coin.price_change_percentage_7d_in_currency > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                  </td>

                  <td className="px-4 py-3">
                    ${coin.total_volume.toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    ${coin.market_cap.toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    <Sparkline data={coin.sparkline_in_7d?.price} />
                  </td>

                  {/* ⭐ ADD TO WATCHLIST BUTTON */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        addToWatchlist({
                          coinId: coin.id,
                          coinName: coin.name,
                        })
                          .then(() => alert("Added to Watchlist ⭐"))
                          .catch((err) =>
                            alert(
                              err?.response?.data?.msg ||
                                "Error adding to watchlist"
                            )
                          )
                      }
                      className="px-3 py-1 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-600 transition"
                    >
                      ⭐
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={currentPage === 1}
          className="page-btn"
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        <span className="px-4 py-2 bg-white/10 rounded-lg">
          {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          className="page-btn"
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {/* CSS */}
      <style>{`
        .filter-btn {
          padding: 8px 14px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          transition: .2s;
        }
        .filter-btn:hover {
          background: rgba(255,255,255,0.2);
        }
        .page-btn {
          padding: 8px 14px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
        }
        .page-btn:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
