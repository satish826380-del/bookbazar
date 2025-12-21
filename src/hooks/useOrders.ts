import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Order, OrderStatus } from '@/types';

type OrderRow = {
  id: string;
  book_id: string;
  book_title: string;
  book_image: string;
  book_price: number;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  seller_name: string;
  delivery_address: string;
  phone: string;
  delivery_charge: number;
  status: OrderStatus;
  payment_mode: 'cod';
  created_at: string;
};

const mapOrder = (row: OrderRow): Order => ({
  id: row.id,
  bookId: row.book_id,
  bookTitle: row.book_title,
  bookImage: row.book_image,
  bookPrice: Number(row.book_price),
  buyerId: row.buyer_id,
  buyerName: row.buyer_name,
  sellerId: row.seller_id,
  sellerName: row.seller_name,
  deliveryAddress: row.delivery_address,
  phone: row.phone,
  deliveryCharge: Number(row.delivery_charge),
  status: row.status,
  paymentMode: row.payment_mode,
  createdAt: row.created_at,
});

export const useOrders = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapOrder);
    },
  });

  const orders = data || [];

  const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'paymentMode'>) => {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        book_id: order.bookId,
        book_title: order.bookTitle,
        book_image: order.bookImage,
        book_price: order.bookPrice,
        buyer_id: order.buyerId,
        buyer_name: order.buyerName,
        seller_id: order.sellerId,
        seller_name: order.sellerName,
        delivery_address: order.deliveryAddress,
        phone: order.phone,
        delivery_charge: order.deliveryCharge,
        status: 'requested',
        payment_mode: 'cod',
      })
      .select('*')
      .single();

    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['orders'] });
    return mapOrder(data as OrderRow);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['orders'] });
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
    refreshOrders: refetch,
  };
};
