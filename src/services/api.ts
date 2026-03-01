import { OrderItem } from '@/types';
import { API_ROUTES } from '@/config/constants';

export const fetchOrders = async (): Promise<OrderItem[]> => {
  const res = await fetch(API_ROUTES.ORDERS);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch orders');
  return json.data;
};

export const createOrder = async (content: string, orderDate: string, location: string, product: string): Promise<void> => {
  const res = await fetch(API_ROUTES.ORDERS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, orderDate, location, product }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Failed to save order');
};

export const completeOrder = async (id: string): Promise<void> => {
  const res = await fetch(API_ROUTES.ORDERS, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, completed: true }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Failed to update order');
};

export const softDeleteOrder = async (id: string): Promise<void> => {
  const res = await fetch(API_ROUTES.ORDERS, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, isDeleted: true }), // Send the delete flag
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Failed to delete order');
};