export default function CryptoTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="p-4">Rank</th>
            <th className="p-4">Coin</th>
            <th className="p-4">Price</th>
            <th className="p-4">24h Change</th>
            <th className="p-4">Market Cap</th>
            <th className="p-4">Add</th>
          </tr>
        </thead>

        <tbody>
          {/* Static example row (will update with API next week) */}
          <tr className="border-b hover:bg-gray-100">
            <td className="p-4 font-medium">1</td>
            <td className="p-4 font-medium flex items-center gap-2">
              <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="BTC" className="w-6" />
              Bitcoin (BTC)
            </td>
            <td className="p-4">$45,000</td>
            <td className="p-4 text-green-600 font-semibold">+2.5%</td>
            <td className="p-4">$850B</td>
            <td className="p-4">
              <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                +
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
