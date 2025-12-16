import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, User, MapPin, CreditCard, Truck, Shield, BookOpen } from 'lucide-react';

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

            {/* COD Badge */}
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Cash on Delivery Available</p>
                  <p className="text-sm text-muted-foreground">Pay when you receive your book</p>
                </div>
              </CardContent>
            </Card>

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

            {/* Action Buttons */}
            {user?.role === 'buyer' ? (
              <Button size="lg" className="w-full h-14 text-lg font-medium" asChild>
                <Link to={`/order/${book.id}`}>
                  <BookOpen className="mr-2 h-5 w-5" />
                  Order This Book
                </Link>
              </Button>
            ) : user ? (
              <p className="text-center text-muted-foreground py-4">
                {user.role === 'seller' 
                  ? 'Switch to a buyer account to order books'
                  : 'Admin accounts cannot place orders'}
              </p>
            ) : (
              <Button size="lg" className="w-full h-14 text-lg font-medium" asChild>
                <Link to="/auth?mode=signup&role=buyer">
                  Login to Order
                </Link>
              </Button>
            )}

            <p className="text-sm text-center text-muted-foreground">
              You will pay ₹{book.price} + delivery charges on delivery
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetails;
