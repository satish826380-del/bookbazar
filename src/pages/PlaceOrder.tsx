import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useBooks } from '@/hooks/useBooks';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Truck, MapPin, Phone, Package, CheckCircle2 } from 'lucide-react';

const DELIVERY_CHARGE = 50;

const PlaceOrder = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getBookById, updateBookStatus } = useBooks();
  const { createOrder } = useOrders();
  const { toast } = useToast();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const book = bookId ? getBookById(bookId) : null;

  if (!user || user.role !== 'buyer') {
    navigate('/auth');
    return null;
  }

  if (!book || book.status !== 'approved') {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="font-display text-2xl mb-4">Book not available</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </Layout>
    );
  }

  const totalAmount = book.price + DELIVERY_CHARGE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliveryAddress.trim() || !phone.trim()) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      createOrder({
        bookId: book.id,
        bookTitle: book.title,
        bookImage: book.imageUrl,
        bookPrice: book.price,
        buyerId: user.id,
        buyerName: user.name,
        sellerId: book.sellerId,
        sellerName: book.sellerName,
        deliveryAddress,
        phone,
        deliveryCharge: DELIVERY_CHARGE,
      });

      updateBookStatus(book.id, 'sold');

      toast({ title: 'Order placed successfully!' });
      navigate('/buyer');
    } catch (error) {
      toast({ title: 'Failed to place order', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h1 className="font-display text-3xl font-bold mb-8 text-foreground">Place Your Order</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-3">
            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">Delivery Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your full address including landmark, city, state and pincode"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows={4}
                      required
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your 10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* COD Notice */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4 flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          You will pay ₹{totalAmount} in cash when the book is delivered to your address.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Button type="submit" size="lg" className="w-full h-12 font-medium" disabled={isSubmitting}>
                    {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="shadow-soft border-border/50 sticky top-24">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-20 h-28 rounded-lg overflow-hidden bg-secondary/50 flex-shrink-0">
                    <img
                      src={book.imageUrl || '/placeholder.svg'}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold line-clamp-2 text-foreground">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">{book.condition}</Badge>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Book Price</span>
                    <span className="text-foreground">₹{book.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Charge</span>
                    <span className="text-foreground">₹{DELIVERY_CHARGE}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">₹{totalAmount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-success text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Pay on delivery - No advance payment</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlaceOrder;
