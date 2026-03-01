import { OrderItem } from '@/types';
import { GroupByType, getDateLabel } from '@/utils/helpers';
import toast from 'react-hot-toast';

type OrderGroupProps = {
  dateLabel: string;
  items: OrderItem[];
  isExpanded: boolean;
  groupBy: GroupByType;
  onToggle: () => void;
  onCheck: (id: string) => void;
};

// 1. Helper function to assign the best icon based on the product name
const getProductIcon = (productName: string) => {
  const name = productName?.toLowerCase();
  if (name?.includes('paneer')) return '🧈';       // Looks like a block of paneer
  if (name?.includes('cream cheese')) return '🥯'; // Bagel with cream cheese
  if (name?.includes('cheese')) return '🧀';       // Standard cheese wedge
  return '📦';                                    // Default package for new items
};

export const OrderGroup = ({ dateLabel, items, isExpanded, groupBy, onToggle, onCheck }: OrderGroupProps) => {
  const uncompletedCount = items.filter(i => !i.completed).length;

  // 2. Quick-Share function for your WhatsApp Group
  const handleWhatsAppShare = (item: OrderItem) => {
    // Format a clean message for the chat
    const message = `*New Order:*\n📦 ${item.product}\n📍 ${item.location}\n📅 ${getDateLabel(item.orderDate)}\n📝 ${item.content}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(message).then(() => {
      toast.success('Order copied! Opening WhatsApp...');
      // Open your specific group link
      window.open('https://chat.whatsapp.com/Ein4H7AXn3LFsUv42KUFSu?mode=gi_t', '_blank');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
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
            <li key={item.id} className={`p-4 rounded-lg border flex flex-col sm:flex-row gap-4 items-start sm:items-center transition-all duration-300 ${item.completed ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-blue-100 shadow-sm'}`}>
              
              <div className="flex items-start gap-4 flex-1 w-full">
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
                  
                  {/* Dynamic Tags Based on View */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {/* Dynamic Product Badge */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 shadow-sm">
                      <span className="mr-1 text-sm">{getProductIcon(item.product)}</span> {item.product}
                    </span>

                    {/* Location or Date Badge */}
                    {groupBy === 'date' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        📍 {item.location}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                        📅 {getDateLabel(item.orderDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* WhatsApp Share Button */}
              {/* <button 
                onClick={() => handleWhatsAppShare(item)}
                className="w-full sm:w-auto mt-2 sm:mt-0 px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                title="Copy details and open WhatsApp Group"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Share
              </button> */}

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};