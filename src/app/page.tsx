'use client';

import { useState, useEffect } from 'react';

type SharedItem = {
  id: string;
  content: string;
  timestamp: string;
  completed?: boolean; // Added this new property
};

export default function Home() {
  const [data, setData] = useState<SharedItem[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

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
      fetchData(); 
    }
  };

  // New function to handle the checkbox click
  const handleCheck = async (id: string) => {
    // 1. Optimistic UI update: instantly update state to make it feel snappy
    setData(prevData => prevData.map(item => 
      item.id === id ? { ...item, completed: true } : item
    ));

    // 2. Background API call to save to Redis
    await fetch('/api/shared-data', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: true }),
    });
  };

  // Sort logic: Uncompleted first, then completed. 
  // Within those groups, sort by newest timestamp.
  const sortedData = [...data].sort((a, b) => {
    if (a.completed && !b.completed) return 1;   // a goes to bottom
    if (!a.completed && b.completed) return -1;  // b goes to bottom
    
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

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
              {sortedData.map((item) => (
                <li 
                  key={item.id} 
                  // Dynamic Tailwind classes based on completed status
                  className={`p-4 rounded-lg border flex gap-4 items-start transition-all duration-300 ${
                    item.completed 
                      ? 'bg-gray-50 border-gray-200 opacity-60' 
                      : 'bg-white border-blue-100 shadow-sm'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!item.completed}
                    disabled={!!item.completed}
                    onChange={() => handleCheck(item.id)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className={`text-gray-800 ${item.completed ? 'line-through' : ''}`}>
                      {item.content}
                    </p>
                    <span className="text-xs text-gray-400 mt-2 block">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}