import { useState } from 'react';

type OrderFormProps = {
  availableLocations: string[];
  onSubmit: (content: string, date: string, location: string) => Promise<void>;
};

export const OrderForm = ({ availableLocations, onSubmit }: OrderFormProps) => {
  const [input, setInput] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLocation, setSelectedLocation] = useState('Bhuvi');
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [customLocationText, setCustomLocationText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const finalLocation = isCustomLocation ? customLocationText.trim() : selectedLocation;
    if (!finalLocation) return; 

    const orderDateString = new Date(selectedDate).toISOString();

    await onSubmit(input, orderDateString, finalLocation);
    
    setInput('');
    if (isCustomLocation) {
      setSelectedLocation(finalLocation);
      setIsCustomLocation(false);
      setCustomLocationText('');
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '__ADD_NEW__') {
      setIsCustomLocation(true);
    } else {
      setSelectedLocation(e.target.value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
      
      {/* ROW 1: Date and Location */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          required
        />
        
        <div className="w-full sm:w-1/2 relative">
          {isCustomLocation ? (
            <div className="flex w-full relative">
              <input
                type="text"
                autoFocus
                placeholder="Type new location..."
                value={customLocationText}
                onChange={(e) => setCustomLocationText(e.target.value)}
                className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black pr-10 bg-white"
                required
              />
              <button 
                type="button" 
                onClick={() => setIsCustomLocation(false)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500 font-bold"
              >
                ✕
              </button>
            </div>
          ) : (
            <select
              value={selectedLocation}
              onChange={handleLocationChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white appearance-none"
            >
              {availableLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
              <option disabled>──────────</option>
              <option value="__ADD_NEW__">+ Add new location...</option>
            </select>
          )}
        </div>
      </div>

      {/* ROW 2: Details and Submit Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter order details..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          required
        />
        <button 
          type="submit" 
          className="w-full sm:w-auto px-8 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm"
        >
          Add Order
        </button>
      </div>
      
    </form>
  );
};