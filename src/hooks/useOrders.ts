import { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // <-- Import toast
import { OrderItem } from '@/types';
import * as api from '@/services/api';
import { groupAndSortOrders, getDateLabel } from '@/utils/helpers';
import { LOCATION_DATA } from '@/config/constants';

export const useOrders = () => {
  const [data, setData] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Today: false, Tomorrow: false, Yesterday: false,
  });

  const loadData = async () => {
    try {
      const orders = await api.fetchOrders();
      setData(orders);
    } catch (error) {
      toast.error('Failed to load orders. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addOrder = async (content: string, orderDate: string, location: string) => {
    const tempId = 'temp-' + Date.now();
    const optimisticItem: OrderItem = {
      id: tempId,
      content,
      orderDate,
      location,
      completed: false,
    };
    
    // 1. Optimistically add to UI
    setData(prev => [optimisticItem, ...prev]);
    const groupLabel = getDateLabel(orderDate);
    setExpandedGroups(prev => ({ ...prev, [groupLabel]: true }));
    
    // 2. Try saving to DB
    try {
      await api.createOrder(content, orderDate, location);
      toast.success('Order added!');
      loadData(); // Refresh to get real DB ID
    } catch (error) {
      // 3. Revert UI if DB fails
      setData(prev => prev.filter(item => item.id !== tempId));
      toast.error('Failed to add order. Please try again.');
    }
  };

  const checkOrder = async (id: string) => {
    // 1. Save current state in case we need to revert
    const previousData = [...data];
    
    // 2. Optimistically update UI
    setData(prevData => prevData.map(item => 
      item.id === id ? { ...item, completed: true } : item
    ));

    // 3. Try saving to DB
    try {
      await api.completeOrder(id);
      toast.success('Order completed!');
    } catch (error) {
      // 4. Revert UI if DB fails
      setData(previousData);
      toast.error('Failed to update status.');
    }
  };

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const groupedData = groupAndSortOrders(data);
  const availableLocations = Array.from(new Set([
    ...LOCATION_DATA.DEFAULTS,
    ...data.map(item => item.location).filter(Boolean)
  ]));

  return { loading, groupedData, addOrder, checkOrder, availableLocations, expandedGroups, toggleGroup };
};