export type OrderItem = {
  id: string;
  content: string;
  orderDate: string;
  completed?: boolean;
  location: string;
  product: string;
  isDeleted?: boolean;
};