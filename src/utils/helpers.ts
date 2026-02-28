import { OrderItem } from '@/types';

export const getDateLabel = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const groupAndSortOrders = (data: OrderItem[]) => {
  // Sort chronologically
  const timeSortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.orderDate || (a as any).timestamp).getTime();
    const dateB = new Date(b.orderDate || (b as any).timestamp).getTime();
    return dateB - dateA; 
  });

  // Group by date label
  const groupedData = timeSortedData.reduce((acc, item) => {
    const label = getDateLabel(item.orderDate || (item as any).timestamp);
    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {} as Record<string, OrderItem[]>);

  // Sort uncompleted to the top of each group
  Object.keys(groupedData).forEach(key => {
    groupedData[key].sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });
  });

  return groupedData;
};