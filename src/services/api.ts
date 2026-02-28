import { OrderItem } from '@/types';

export const fetchOrders = async (): Promise<OrderItem[]> => {
  const res = await fetch('/api/shared-data');
  const json = await res.json();
  return json.success ? json.data : [];
};

export const createOrder = async (content: string, orderDate: string, location: string): Promise<void> => {
  await fetch('/api/shared-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, orderDate, location }), 
  });
};

export const completeOrder = async (id: string): Promise<void> => {
  await fetch('/api/shared-data', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, completed: true }),
  });
};