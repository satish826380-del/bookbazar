import { Book } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  showStatus?: boolean;
}

const conditionColors = {
  'new': 'bg-success text-success-foreground',
  'like-new': 'bg-secondary text-secondary-foreground',
  'good': 'bg-primary text-primary-foreground',
  'fair': 'bg-warning text-warning-foreground',
  'poor': 'bg-muted text-muted-foreground',
};

const statusColors = {
  'pending': 'bg-warning text-warning-foreground',
  'approved': 'bg-success text-success-foreground',
  'rejected': 'bg-destructive text-destructive-foreground',
  'sold': 'bg-muted text-muted-foreground',
};

export const BookCard = ({ book, showStatus = false }: BookCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
      <div className="aspect-[3/4] relative overflow-hidden bg-muted">
        <img
          src={book.imageUrl || '/placeholder.svg'}
          alt={book.title}
          className="w-full h-full object-cover"
        />
        {showStatus && (
          <Badge className={`absolute top-2 right-2 ${statusColors[book.status]}`}>
            {book.status}
          </Badge>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-display font-semibold text-lg line-clamp-1">{book.title}</h3>
          <p className="text-muted-foreground text-sm">by {book.author}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg text-primary">₹{book.price}</span>
          <Badge variant="outline" className={conditionColors[book.condition]}>
            {book.condition}
          </Badge>
        </div>
        <Badge variant="secondary" className="text-xs">{book.category}</Badge>
        {book.status === 'approved' && (
          <Button asChild className="w-full mt-2">
            <Link to={`/book/${book.id}`}>View Details</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
