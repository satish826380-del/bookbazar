import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, User, MapPin, Phone } from 'lucide-react';

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookById } = useBooks();
  const { user } = useAuth();

  const book = id ? getBookById(id) : null;

  if (!book) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="font-display text-2xl mb-4">Book not found</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </Layout>
    );
  }

  const conditionColors = {
    'new': 'bg-success text-success-foreground',
    'like-new': 'bg-secondary text-secondary-foreground',
    'good': 'bg-primary text-primary-foreground',
    'fair': 'bg-warning text-warning-foreground',
    'poor': 'bg-muted text-muted-foreground',
  };

  return (
    <Layout>
      <div className="container py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Book Image */}
          <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
            <img
              src={book.imageUrl || '/placeholder.svg'}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Book Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">{book.category}</Badge>
              <h1 className="font-display text-3xl md:text-4xl font-bold">{book.title}</h1>
              <p className="text-xl text-muted-foreground mt-2">by {book.author}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">₹{book.price}</span>
              <Badge className={conditionColors[book.condition]}>{book.condition}</Badge>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Sold by: {book.sellerName}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Pickup: {book.pickupAddress}</span>
                </div>
              </CardContent>
            </Card>

            {/* COD Notice */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="font-medium text-primary">💵 Cash on Delivery</p>
              <p className="text-sm text-muted-foreground mt-1">
                Pay when you receive your book. Delivery charges will be added at checkout.
              </p>
            </div>

            {/* Action Buttons */}
            {user?.role === 'buyer' ? (
              <Button size="lg" className="w-full gap-2" asChild>
                <Link to={`/order/${book.id}`}>
                  <ShoppingCart className="h-5 w-5" />
                  Order This Book
                </Link>
              </Button>
            ) : user ? (
              <p className="text-center text-muted-foreground">
                {user.role === 'seller' 
                  ? 'Switch to a buyer account to order books'
                  : 'Admin accounts cannot place orders'}
              </p>
            ) : (
              <Button size="lg" className="w-full" asChild>
                <Link to="/auth?mode=signup&role=buyer">
                  Sign up as Buyer to Order
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetails;
