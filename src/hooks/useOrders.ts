import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { OrderItem } from "@/types";
import * as api from "@/services/api";
import { groupAndSortOrders, getDateLabel, GroupByType } from "@/utils/helpers";
import { LOCATION_DATA, PRODUCT_DATA } from "@/config/constants";

export const useOrders = () => {
  const [data, setData] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [groupBy, setGroupBy] = useState<GroupByType>("date");

  // Start completely empty (all collapsed)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  const loadData = async () => {
    try {
      const orders = await api.fetchOrders();
      setData(orders);
      // Removed the code that auto-expanded "Today" here
    } catch (error) {
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Load data on initial mount
  useEffect(() => {
    loadData();
  }, []);

  // 2. Collapse all groups automatically whenever you switch the Date/Location toggle
  useEffect(() => {
    setExpandedGroups({});
  }, [groupBy]);

  const addOrder = async (
    content: string,
    orderDate: string,
    location: string,
    product: string,
  ) => {
    const tempId = "temp-" + Date.now();
    const optimisticItem = {
      id: tempId,
      content,
      orderDate,
      location,
      product,
      completed: false,
    };

    setData((prev) => [optimisticItem, ...prev]);
    const groupLabel = groupBy === "date" ? getDateLabel(orderDate) : location;
    setExpandedGroups((prev) => ({ ...prev, [groupLabel]: true }));

    try {
      await api.createOrder(content, orderDate, location, product);
      toast.success("Order added!");
      loadData();
    } catch (error) {
      setData((prev) => prev.filter((item) => item.id !== tempId));
      toast.error("Failed to add order.");
    }
  };
  const availableProducts = Array.from(
    new Set([
      ...PRODUCT_DATA.DEFAULTS,
      ...data.map((item) => item.product).filter(Boolean),
    ]),
  );

  const checkOrder = async (id: string) => {
    const previousData = [...data];
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, completed: true } : item,
      ),
    );
    try {
      await api.completeOrder(id);
      toast.success("Order completed!");
    } catch (error) {
      setData(previousData);
      toast.error("Failed to update status.");
    }
  };

  const toggleGroup = (label: string) =>
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const groupedData = groupAndSortOrders(data, groupBy);

  const availableLocations = Array.from(
    new Set([
      ...LOCATION_DATA.DEFAULTS,
      ...data.map((item) => item.location).filter(Boolean),
    ]),
  );

  return {
    loading,
    groupedData,
    addOrder,
    checkOrder,
    availableLocations,
    expandedGroups,
    toggleGroup,
    groupBy,
    setGroupBy,
    availableProducts,
  };
};
