import { Book } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  showStatus?: boolean;
}

const conditionConfig = {
  'new': { label: 'New', className: 'bg-success/10 text-success border-success/20' },
  'like-new': { label: 'Like New', className: 'bg-primary/10 text-primary border-primary/20' },
  'good': { label: 'Good', className: 'bg-secondary text-secondary-foreground border-border' },
  'fair': { label: 'Fair', className: 'bg-warning/10 text-warning border-warning/20' },
  'poor': { label: 'Poor', className: 'bg-muted text-muted-foreground border-border' },
};

const statusConfig = {
  'pending': { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  'approved': { label: 'Approved', className: 'bg-success/10 text-success border-success/20' },
  'rejected': { label: 'Rejected', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  'sold': { label: 'Sold', className: 'bg-muted text-muted-foreground border-border' },
};

export const BookCard = ({ book, showStatus = false }: BookCardProps) => {
  const condition = conditionConfig[book.condition];
  const status = statusConfig[book.status];

  return (
    <Card className="group overflow-hidden bg-card border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in">
      <div className="aspect-[3/4] relative overflow-hidden bg-secondary/50">
        <img
          src={book.imageUrl || '/placeholder.svg'}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {showStatus && (
          <Badge
            variant="outline"
            className={`absolute top-3 right-3 ${status.className} backdrop-blur-sm`}
          >
            {status.label}
          </Badge>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-lg leading-tight line-clamp-1 text-foreground">
            {book.title}
          </h3>
          <p className="text-muted-foreground text-sm">by {book.author}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-xl text-primary">₹{book.price}</span>
          <Badge variant="outline" className={condition.className}>
            {condition.label}
          </Badge>
        </div>

        <Badge variant="secondary" className="text-xs font-medium">
          {book.category}
        </Badge>

        {book.status === 'approved' && (
          <Button asChild className="w-full mt-2 font-medium">
            <Link to={`/book/${book.id}`}>View Book</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
