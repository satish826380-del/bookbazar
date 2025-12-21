export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
}

export type BookStatus = 'pending' | 'approved' | 'rejected' | 'sold';
export type BookCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';

export interface Book {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  author: string;
  category: string;
  price: number;
  condition: BookCondition;
  imageUrl: string;
  pickupAddress: string;
  landmark?: string;
  phone: string;
  status: BookStatus;
  createdAt: string;
}

export type OrderStatus = 'requested' | 'approved' | 'picked-up' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  bookPrice: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  deliveryAddress: string;
  phone: string;
  deliveryCharge: number;
  status: OrderStatus;
  paymentMode: 'cod';
  createdAt: string;
}

export interface Payout {
  id: string;
  orderId: string;
  sellerAmount: number;
  adminCommission: number;
  paid: boolean;
  paidAt?: string;
}

export const BOOK_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'History',
  'Biography',
  'Children',
  'Academic',
  'Self-Help',
  'Other'
] as const;

export const BOOK_CONDITIONS: { value: BookCondition; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];
