import { OrderItem } from "@/types";
import { GroupByType, getDateLabel } from "@/utils/helpers";
import toast from "react-hot-toast";

type OrderGroupProps = {
  dateLabel: string;
  items: OrderItem[];
  isExpanded: boolean;
  groupBy: GroupByType;
  onToggle: () => void;
  onCheck: (id: string) => void;
  onDelete: (id: string) => void;
};

// 1. Helper function to assign the best icon based on the product name
const getProductIcon = (productName: string) => {
  const name = productName?.toLowerCase();
  if (name?.includes("paneer")) return "🧈"; // Looks like a block of paneer
  if (name?.includes("cream cheese")) return "🥯"; // Bagel with cream cheese
  if (name?.includes("cheese")) return "🧀"; // Standard cheese wedge
  return "📦"; // Default package for new items
};

export const OrderGroup = ({
  dateLabel,
  items,
  isExpanded,
  groupBy,
  onToggle,
  onCheck,
  onDelete,
}: OrderGroupProps) => {
  const uncompletedCount = items.filter((i) => !i.completed).length;

  // 2. Quick-Share function for your WhatsApp Group
  const handleWhatsAppShare = (item: OrderItem) => {
    // Format a clean message for the chat
    const message = `*New Order:*\n📦 ${item.product}\n📍 ${item.location}\n📅 ${getDateLabel(item.orderDate)}\n📝 ${item.content}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(message)
      .then(() => {
        toast.success("Order copied! Opening WhatsApp...");
        // Open your specific group link
        window.open(
          "https://chat.whatsapp.com/Ein4H7AXn3LFsUv42KUFSu?mode=gi_t",
          "_blank",
        );
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

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
        <span className="text-gray-400 text-sm">{isExpanded ? "▼" : "▶"}</span>
      </button>

      {isExpanded && (
        <ul className="p-4 space-y-3 bg-white">
          {items.map((item) => (
            <li
              key={item.id}
              className={`p-4 rounded-lg border flex flex-col sm:flex-row gap-4 items-start sm:items-center transition-all duration-300 ${item.completed ? "bg-gray-50 border-gray-200 opacity-60" : "bg-white border-blue-100 shadow-sm"}`}
            >
              <div className="flex items-start gap-4 flex-1 w-full">
                <input
                  type="checkbox"
                  checked={!!item.completed}
                  disabled={!!item.completed}
                  onChange={() => onCheck(item.id)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-gray-800 break-words ${item.completed ? "line-through" : ""}`}
                  >
                    {item.content}
                  </p>

                  {/* Dynamic Tags Based on View */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {/* Dynamic Product Badge */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 shadow-sm">
                      <span className="mr-1 text-sm">
                        {getProductIcon(item.product)}
                      </span>{" "}
                      {item.product}
                    </span>

                    {/* Location or Date Badge */}
                    {groupBy === "date" ? (
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

             {/* Action Buttons Container */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-3 sm:mt-0">

                {/* New Delete Button */}
                <button 
                  onClick={() => {
                    if(window.confirm('Are you sure you want to remove this order?')) {
                      onDelete(item.id);
                    }
                  }}
                  className="w-full sm:w-auto px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  title="Remove order"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  Remove
                </button>
              </div>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
