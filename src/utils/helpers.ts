import { OrderItem } from '@/types';
import { UI_STRINGS } from '@/config/constants';

// Add the type for our grouping options
export type GroupByType = 'date' | 'location';

export const getDateLabel = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return UI_STRINGS.TODAY || 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return UI_STRINGS.TOMORROW || 'Tomorrow';
  if (date.toDateString() === yesterday.toDateString()) return UI_STRINGS.YESTERDAY || 'Yesterday';
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Update this function to accept the groupBy parameter
export const groupAndSortOrders = (data: OrderItem[], groupBy: GroupByType) => {
  const timeSortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.orderDate).getTime();
    const dateB = new Date(b.orderDate).getTime();
    return dateB - dateA; 
  });

  const groupedData = timeSortedData.reduce((acc, item) => {
    // Determine the header label based on the selected toggle
    const label = groupBy === 'date' 
      ? getDateLabel(item.orderDate) 
      : (item.location || 'Unspecified');
      
    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {} as Record<string, OrderItem[]>);

  Object.keys(groupedData).forEach(key => {
    groupedData[key].sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });
  });

  return groupedData;
};