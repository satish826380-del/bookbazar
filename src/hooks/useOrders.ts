import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '@/types';

const ORDERS_KEY = 'bookstore_orders';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = useCallback(() => {
    const saved = localStorage.getItem(ORDERS_KEY);
    setOrders(saved ? JSON.parse(saved) : []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const saveOrders = (newOrders: Order[]) => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
    setOrders(newOrders);
  };

  const createOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'paymentMode'>) => {
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      status: 'requested',
      paymentMode: 'cod',
      createdAt: new Date().toISOString(),
    };
    saveOrders([...orders, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    saveOrders(updated);
  };

  const getOrdersByBuyer = (buyerId: string) => orders.filter(o => o.buyerId === buyerId);
  
  const getOrdersBySeller = (sellerId: string) => orders.filter(o => o.sellerId === sellerId);
  
  const getOrderById = (orderId: string) => orders.find(o => o.id === orderId);

  return {
    orders,
    isLoading,
    createOrder,
    updateOrderStatus,
    getOrdersByBuyer,
    getOrdersBySeller,
    getOrderById,
    refreshOrders: loadOrders,
  };
};
