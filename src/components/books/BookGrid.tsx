import { Book } from '@/types';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  showStatus?: boolean;
  emptyMessage?: string;
}

export const BookGrid = ({ books, showStatus = false, emptyMessage = 'No books found' }: BookGridProps) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {books.map(book => (
        <BookCard key={book.id} book={book} showStatus={showStatus} />
      ))}
    </div>
  );
};
