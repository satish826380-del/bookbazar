import { useState, useEffect, useCallback } from 'react';
import { Book, BookStatus } from '@/types';

const BOOKS_KEY = 'bookstore_books';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBooks = useCallback(() => {
    const saved = localStorage.getItem(BOOKS_KEY);
    setBooks(saved ? JSON.parse(saved) : []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const saveBooks = (newBooks: Book[]) => {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(newBooks));
    setBooks(newBooks);
  };

  const addBook = (book: Omit<Book, 'id' | 'createdAt' | 'status'>) => {
    const newBook: Book = {
      ...book,
      id: `book-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    saveBooks([...books, newBook]);
    return newBook;
  };

  const updateBookStatus = (bookId: string, status: BookStatus) => {
    const updated = books.map(book => 
      book.id === bookId ? { ...book, status } : book
    );
    saveBooks(updated);
  };

  const updateBookPrice = (bookId: string, price: number) => {
    const updated = books.map(book => 
      book.id === bookId ? { ...book, price } : book
    );
    saveBooks(updated);
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
    refreshBooks: loadBooks,
  };
};
