import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, User, MapPin, CreditCard, Truck, Shield, BookOpen, Lock } from 'lucide-react';

const conditionConfig = {
  'new': { label: 'New', className: 'bg-success/10 text-success border-success/20' },
  'like-new': { label: 'Like New', className: 'bg-primary/10 text-primary border-primary/20' },
  'good': { label: 'Good', className: 'bg-secondary text-secondary-foreground border-border' },
  'fair': { label: 'Fair', className: 'bg-warning/10 text-warning border-warning/20' },
  'poor': { label: 'Poor', className: 'bg-muted text-muted-foreground border-border' },
};

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

  const condition = conditionConfig[book.condition];

  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Books
        </Button>

        <div className="grid lg:grid-cols-2 gap-10 animate-fade-in">
          {/* Book Image */}
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary/50 shadow-soft">
            <img
              src={book.imageUrl || '/placeholder.svg'}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Book Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">{book.category}</Badge>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground">by {book.author}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-display text-4xl font-bold text-primary">₹{book.price}</span>
              <Badge variant="outline" className={`text-sm ${condition.className}`}>
                {condition.label}
              </Badge>
            </div>

            <Card className="border-border/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Sold by: {book.sellerName}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Pickup: {book.pickupAddress}</span>
                </div>
              </CardContent>
            </Card>

            {/* Main Action Section */}
            <div className="pt-2">
              {user?.role === 'buyer' ? (
                <Button size="lg" className="w-full h-14 text-lg font-medium" asChild>
                  <Link to={`/order/${book.id}`}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Order This Book
                  </Link>
                </Button>
              ) : user ? (
                <Card className="bg-muted/50 border-border/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-muted-foreground text-sm font-medium">
                      {user.role === 'seller'
                        ? 'You are logged in as a Seller. Please use a Buyer account to place orders.'
                        : 'Admin accounts cannot place orders.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Button size="lg" className="w-full h-14 text-lg font-medium bg-primary hover:bg-primary/90" asChild>
                  <Link to="/auth?mode=signup&role=buyer">
                    <Lock className="mr-2 h-5 w-5" />
                    Login to Order
                  </Link>
                </Button>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Safe Delivery</p>
                  <p className="text-xs text-muted-foreground">Handled with care</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Verified Seller</p>
                  <p className="text-xs text-muted-foreground">Quality assured</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-center text-muted-foreground pb-4">
              Cash on Delivery (COD) Available • Pay only when you receive your book
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetails;
