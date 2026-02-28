'use client';

import { useState, useEffect } from 'react';

type SharedItem = {
  id: string;
  content: string;
  timestamp: string;
};

export default function Home() {
  const [data, setData] = useState<SharedItem[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch data from our own API route
  const fetchData = async () => {
    const res = await fetch('/api/shared-data');
    const json = await res.json();
    if (json.success) {
      setData(json.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Post new data to our API route
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const res = await fetch('/api/shared-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input }),
    });

    if (res.ok) {
      setInput('');
      fetchData(); // Refresh the list
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Shared Data Hub</h1>
        
        <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter new data..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Current Data
          </h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <ul className="space-y-3">
              {data.map((item) => (
                <li key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-800">{item.content}</p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}