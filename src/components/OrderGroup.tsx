import { OrderItem } from '@/types';

type OrderGroupProps = {
  dateLabel: string;
  items: OrderItem[];
  isExpanded: boolean;
  onToggle: () => void;
  onCheck: (id: string) => void;
};

export const OrderGroup = ({ dateLabel, items, isExpanded = false, onToggle, onCheck }: OrderGroupProps) => {
  const uncompletedCount = items.filter(i => !i.completed).length;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <button 
        onClick={onToggle} 
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-gray-800">{dateLabel}</h2>
          {uncompletedCount > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {uncompletedCount} pending
            </span>
          )}
        </div>
        <span className="text-gray-400 text-sm">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <ul className="p-4 space-y-3 bg-white">
          {items.map((item) => (
            <li 
              key={item.id} 
              className={`p-4 rounded-lg border flex gap-4 items-start transition-all duration-300 ${item.completed ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-blue-100 shadow-sm'}`}
            >
              <input
                type="checkbox"
                checked={!!item.completed}
                disabled={!!item.completed}
                onChange={() => onCheck(item.id)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className={`text-gray-800 break-words ${item.completed ? 'line-through' : ''}`}>
                  {item.content}
                </p>
                <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  📍 {item.location}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};