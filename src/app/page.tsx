'use client';

import { useOrders } from '@/hooks/useOrders';
import { OrderForm } from '@/components/OrderForm';
import { OrderGroup } from '@/components/OrderGroup';

export default function Home() {
  const { 
    loading, 
    groupedData, 
    addOrder, 
    checkOrder, 
    availableLocations, 
    expandedGroups, 
    toggleGroup,
    groupBy,  
    availableProducts,
    removeOrder,    // Pull the state
    setGroupBy    // Pull the setter
  } = useOrders();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Details Hub</h1>
        
        <OrderForm availableLocations={availableLocations} onSubmit={addOrder} availableProducts={availableProducts} />

        {/* The New Segmented Toggle UI */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6 w-full sm:w-fit">
          <button
            onClick={() => setGroupBy('date')}
            className={`flex-1 sm:px-6 py-2 rounded-md text-sm font-medium transition-all ${
              groupBy === 'date' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Group by Date
          </button>
          <button
            onClick={() => setGroupBy('location')}
            className={`flex-1 sm:px-6 py-2 rounded-md text-sm font-medium transition-all ${
              groupBy === 'location' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Group by Location
          </button>
        </div>

        <div className="space-y-6">
          {loading ? (
            <p className="text-gray-500 text-center py-4">Loading orders...</p>
          ) : Object.keys(groupedData).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No orders yet.</p>
          ) : (
            Object.entries(groupedData).map(([dateLabel, items]) => (
              <OrderGroup
                key={dateLabel}
                dateLabel={dateLabel}
                items={items}
                isExpanded={expandedGroups[dateLabel]}
                groupBy={groupBy}
                onToggle={() => toggleGroup(dateLabel)}
                onCheck={checkOrder}
                onDelete={removeOrder}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}