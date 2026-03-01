import { useState } from 'react';
import { LOCATION_DATA, PRODUCT_DATA } from '@/config/constants';

type OrderFormProps = {
  availableLocations: string[];
  availableProducts: string[];
  onSubmit: (content: string, date: string, location: string, product: string) => Promise<void>;
};

export const OrderForm = ({ availableLocations, availableProducts, onSubmit }: OrderFormProps) => {
  const [input, setInput] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [selectedLocation, setSelectedLocation] = useState(LOCATION_DATA.DEFAULTS[0]);
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [customLocationText, setCustomLocationText] = useState('');

  // New state for Products
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_DATA.DEFAULTS[0]);
  const [isCustomProduct, setIsCustomProduct] = useState(false);
  const [customProductText, setCustomProductText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const finalLocation = isCustomLocation ? customLocationText.trim() : selectedLocation;
    const finalProduct = isCustomProduct ? customProductText.trim() : selectedProduct;
    if (!finalLocation || !finalProduct) return; 

    const orderDateString = new Date(selectedDate).toISOString();

    await onSubmit(input, orderDateString, finalLocation, finalProduct);
    
    setInput('');
    if (isCustomLocation) {
      setSelectedLocation(finalLocation);
      setIsCustomLocation(false);
      setCustomLocationText('');
    }
    if (isCustomProduct) {
      setSelectedProduct(finalProduct);
      setIsCustomProduct(false);
      setCustomProductText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100 shadow-sm">
      
      {/* ROW 1: 3-Column Grid for Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Date */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          required
        />
        
        {/* Location */}
        <div className="w-full relative">
          {isCustomLocation ? (
            <div className="flex w-full relative">
              <input type="text" autoFocus placeholder="New location..." value={customLocationText} onChange={(e) => setCustomLocationText(e.target.value)} className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black pr-10 bg-white" required />
              <button type="button" onClick={() => setIsCustomLocation(false)} className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500 font-bold">✕</button>
            </div>
          ) : (
            <select value={selectedLocation} onChange={(e) => e.target.value === LOCATION_DATA.ADD_NEW_KEY ? setIsCustomLocation(true) : setSelectedLocation(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white appearance-none">
              {availableLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              <option disabled>──────────</option>
              <option value={LOCATION_DATA.ADD_NEW_KEY}>+ Add new...</option>
            </select>
          )}
        </div>

        {/* Product */}
        <div className="w-full relative">
          {isCustomProduct ? (
            <div className="flex w-full relative">
              <input type="text" autoFocus placeholder="New product..." value={customProductText} onChange={(e) => setCustomProductText(e.target.value)} className="w-full px-4 py-2 border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black pr-10 bg-white" required />
              <button type="button" onClick={() => setIsCustomProduct(false)} className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500 font-bold">✕</button>
            </div>
          ) : (
            <select value={selectedProduct} onChange={(e) => e.target.value === PRODUCT_DATA.ADD_NEW_KEY ? setIsCustomProduct(true) : setSelectedProduct(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black bg-white appearance-none">
              {availableProducts.map(prod => <option key={prod} value={prod}>{prod}</option>)}
              <option disabled>──────────</option>
              <option value={PRODUCT_DATA.ADD_NEW_KEY}>+ Add new...</option>
            </select>
          )}
        </div>
      </div>

      {/* ROW 2: Details and Submit Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter order details (e.g., 500g, 1kg, delivery notes)..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white" required />
        <button type="submit" className="w-full sm:w-auto px-8 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap shadow-sm">
          Add Order
        </button>
      </div>
      
    </form>
  );
};