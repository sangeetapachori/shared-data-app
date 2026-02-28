import { useState, useEffect } from 'react';
import { OrderItem } from '@/types';
import * as api from '@/services/api';
import { groupAndSortOrders, getDateLabel } from '@/utils/helpers';

export const useOrders = () => {
  const [data, setData] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Moved accordion state here
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Today: true, Tomorrow: false, Yesterday: false
  });

  const loadData = async () => {
    const orders = await api.fetchOrders();
    setData(orders);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addOrder = async (content: string, orderDate: string, location: string) => {
    const optimisticItem: OrderItem = {
      id: 'temp-' + Date.now(),
      content,
      orderDate,
      location,
      completed: false,
    };
    
    setData(prev => [optimisticItem, ...prev]);
    await api.createOrder(content, orderDate, location);
    
    // Automatically expand the group where the new order was just added
    const groupLabel = getDateLabel(orderDate);
    setExpandedGroups(prev => ({ ...prev, [groupLabel]: true }));
    
    loadData(); 
  };

  const checkOrder = async (id: string) => {
    setData(prevData => prevData.map(item => 
      item.id === id ? { ...item, completed: true } : item
    ));
    await api.completeOrder(id);
  };

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const groupedData = groupAndSortOrders(data);
  const defaultLocations = ['Bhuvi', 'PIT', 'VMP','Brenchwood'];
  const availableLocations = Array.from(new Set([
    ...defaultLocations,
    ...data.map(item => item.location).filter(Boolean)
  ]));

  return { 
    loading, 
    groupedData, 
    addOrder, 
    checkOrder, 
    availableLocations,
    expandedGroups,
    toggleGroup
  };
};