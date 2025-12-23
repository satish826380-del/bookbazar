import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Book, BookStatus } from '@/types';

type BookRow = {
  id: string;
  seller_id: string;
  seller_name: string;
  title: string;
  author: string;
  category: string;
  price: number;
  condition: Book['condition'];
  image_url: string;
  pickup_address: string;
  landmark: string;
  phone: string;
  status: BookStatus;
  latitude: number;
  longitude: number;
  created_at: string;
};

const mapBook = (row: BookRow): Book => ({
  id: row.id,
  sellerId: row.seller_id,
  sellerName: row.seller_name,
  title: row.title,
  author: row.author,
  category: row.category,
  price: Number(row.price),
  condition: row.condition,
  imageUrl: row.image_url,
  pickupAddress: row.pickup_address,
  landmark: row.landmark,
  phone: row.phone,
  status: row.status,
  latitude: row.latitude,
  longitude: row.longitude,
  createdAt: row.created_at,
});

export const useBooks = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapBook);
    },
  });

  const books = data || [];

  const addBook = async (book: Omit<Book, 'id' | 'createdAt' | 'status'>) => {
    console.log('addBook: Starting book insertion...');
    console.log('addBook: Book data:', {
      sellerId: book.sellerId,
      sellerName: book.sellerName,
      title: book.title,
      price: book.price,
      condition: book.condition
    });

    // Check current auth state
    const { data: { user: authUser } } = await supabase.auth.getUser();
    console.log('addBook: Current auth user:', authUser?.id);
    console.log('addBook: Seller ID from book:', book.sellerId);
    console.log('addBook: Auth user matches seller?', authUser?.id === book.sellerId);

    const { data, error } = await supabase
      .from('books')
      .insert({
        seller_id: book.sellerId,
        seller_name: book.sellerName,
        title: book.title,
        author: book.author,
        category: book.category,
        price: book.price,
        condition: book.condition,
        image_url: book.imageUrl,
        pickup_address: book.pickupAddress,
        landmark: book.landmark || '',
        phone: book.phone,
        status: 'pending',
        latitude: book.latitude,
        longitude: book.longitude,
      })
      .select('*')
      .single();

    if (error) {
      console.error('addBook: Insert failed!');
      console.error('addBook: Error code:', error.code);
      console.error('addBook: Error message:', error.message);
      console.error('addBook: Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('addBook: Book inserted successfully!', data);
    await queryClient.invalidateQueries({ queryKey: ['books'] });
    return mapBook(data as BookRow);
  };

  const updateBookStatus = async (bookId: string, status: BookStatus) => {
    const { error } = await supabase
      .from('books')
      .update({ status })
      .eq('id', bookId);

    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['books'] });
  };

  const updateBookPrice = async (bookId: string, price: number) => {
    const { error } = await supabase
      .from('books')
      .update({ price })
      .eq('id', bookId);

    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['books'] });
  };

  const getApprovedBooks = () => books.filter(b => b.status === 'approved');
  const getBooksBySeller = (sellerId: string) => books.filter(b => b.sellerId === sellerId);
  const getBookById = (bookId: string) => books.find(b => b.id === bookId);
  const getPendingBooks = () => books.filter(b => b.status === 'pending');

  return {
    books,
    isLoading,
    addBook,
    updateBookStatus,
    updateBookPrice,
    getApprovedBooks,
    getBooksBySeller,
    getBookById,
    getPendingBooks,
    refreshBooks: refetch,
  };
};
