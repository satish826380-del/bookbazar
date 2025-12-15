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
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';

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
      <div className="container max-w-2xl py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h1 className="font-display text-3xl font-bold mb-8">Place Order</h1>

        <div className="grid gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <img
                  src={book.imageUrl || '/placeholder.svg'}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-display font-semibold">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                  <p className="text-primary font-semibold mt-2">₹{book.price}</p>
                </div>
              </div>
              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Book Price</span>
                  <span>₹{book.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Charge</span>
                  <span>₹{DELIVERY_CHARGE}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">₹{totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full delivery address..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>

                {/* Payment Method */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-medium">Payment Method</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    💵 <strong>Cash on Delivery</strong> - Pay ₹{totalAmount} when you receive your book
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Placing Order...' : `Confirm Order - ₹${totalAmount}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PlaceOrder;
