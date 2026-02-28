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
    toggleGroup 
  } = useOrders();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Details Hub</h1>
        
        <OrderForm 
          availableLocations={availableLocations} 
          onSubmit={addOrder} 
        />

        <div className="space-y-6">
          {loading ? (
            <p className="text-gray-500">Loading orders...</p>
          ) : Object.keys(groupedData).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No orders yet.</p>
          ) : (
            Object.entries(groupedData).map(([dateLabel, items]) => (
              <OrderGroup
                key={dateLabel}
                dateLabel={dateLabel}
                items={items}
                isExpanded={expandedGroups[dateLabel]}
                onToggle={() => toggleGroup(dateLabel)}
                onCheck={checkOrder}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}