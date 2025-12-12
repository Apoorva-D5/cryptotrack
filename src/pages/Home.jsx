import CryptoTable from "../components/CryptoTable";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">Live Crypto Prices</h2>

      {/* Search */}
      <input 
        type="text"
        placeholder="Search for Bitcoin, Ethereum..."
        className="border p-3 rounded w-full mb-6 shadow-sm"
      />

      <CryptoTable />
    </div>
  );
}
