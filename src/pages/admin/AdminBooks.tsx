import { useState } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BookStatus, BookCondition } from '@/types';
import { Check, X, IndianRupee, MapPin } from 'lucide-react';

const SELLER_PAYOUT_RATE = 0.6; // 60%
const ADMIN_MARGIN_RATE = 0.4; // 40%

const conditionLabels: Record<BookCondition, string> = {
  'new': 'New',
  'like-new': 'Like New',
  'good': 'Good',
  'fair': 'Fair',
  'poor': 'Poor',
};

const AdminBooks = () => {
  const { getPendingBooks, updateBookStatus, updateBookPrice } = useBooks();
  const { toast } = useToast();
  const pendingBooks = getPendingBooks();

  const [finalPrices, setFinalPrices] = useState<Record<string, string>>({});

  const getFinalPrice = (bookId: string, suggestedPrice: number): number => {
    const customPrice = finalPrices[bookId];
    return customPrice ? parseFloat(customPrice) : suggestedPrice;
  };

  const handlePriceChange = (bookId: string, value: string) => {
    setFinalPrices(prev => ({ ...prev, [bookId]: value }));
  };

  const handleAction = async (bookId: string, status: BookStatus, suggestedPrice: number) => {
    if (status === 'approved') {
      const finalPrice = getFinalPrice(bookId, suggestedPrice);
      if (finalPrice <= 0) {
        toast({ title: 'Please set a valid final price', variant: 'destructive' });
        return;
      }
      try {
        await updateBookPrice(bookId, finalPrice);
      } catch (error) {
        toast({ title: 'Failed to update price', variant: 'destructive' });
        return;
      }
    }
    try {
      await updateBookStatus(bookId, status);
      toast({ title: `Book ${status === 'approved' ? 'approved' : 'rejected'}` });
    } catch (error) {
      toast({ title: 'Failed to update status', variant: 'destructive' });
      return;
    }

    // Clear the price input
    setFinalPrices(prev => {
      const next = { ...prev };
      delete next[bookId];
      return next;
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Book Approvals</h1>
        <p className="text-muted-foreground">Review and approve pending book listings</p>
      </div>

      {pendingBooks.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            No pending books to review
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingBooks.map(book => {
            const suggestedPrice = book.price;
            const finalPrice = getFinalPrice(book.id, suggestedPrice);
            const sellerPayout = Math.round(finalPrice * SELLER_PAYOUT_RATE);
            const adminMargin = Math.round(finalPrice * ADMIN_MARGIN_RATE);

            return (
              <Card key={book.id} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Book Image */}
                    <img
                      src={book.imageUrl || '/placeholder.svg'}
                      alt={book.title}
                      className="w-24 h-32 object-cover rounded-md bg-muted"
                    />

                    {/* Book Info */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg text-foreground">{book.title}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Condition:</span>{' '}
                          <span className="font-medium">{conditionLabels[book.condition]}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Seller:</span>{' '}
                          <span className="font-medium">{book.sellerName}</span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-border/50">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Pickup Address:</span>{' '}
                          <span className="font-medium">{book.pickupAddress}</span>
                        </div>
                        {book.landmark && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Landmark:</span>{' '}
                            <span className="font-medium">{book.landmark}</span>
                          </div>
                        )}
                      </div>

                      {/* Prices */}
                      <div className="pt-2 grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-muted/50 rounded-md p-3">
                          <p className="text-muted-foreground text-xs">Auto-Suggested Price</p>
                          <p className="font-semibold text-foreground flex items-center">
                            <IndianRupee className="h-3 w-3" />{suggestedPrice}
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded-md p-3">
                          <p className="text-muted-foreground text-xs">Printed MRP</p>
                          <p className="font-semibold text-foreground">—</p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="w-full md:w-64 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Final Selling Price</Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min="1"
                            value={finalPrices[book.id] ?? suggestedPrice}
                            onChange={(e) => handlePriceChange(book.id, e.target.value)}
                            className="pl-9 h-10"
                            placeholder="Enter final price"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-green-50 rounded-md p-2 text-center">
                          <p className="text-xs text-muted-foreground">Seller Payout</p>
                          <p className="font-semibold text-green-700">₹{sellerPayout}</p>
                          <p className="text-xs text-muted-foreground">60%</p>
                        </div>
                        <div className="bg-blue-50 rounded-md p-2 text-center">
                          <p className="text-xs text-muted-foreground">Admin Margin</p>
                          <p className="font-semibold text-blue-700">₹{adminMargin}</p>
                          <p className="text-xs text-muted-foreground">40%</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAction(book.id, 'approved', suggestedPrice)}
                          className="flex-1 gap-1"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(book.id, 'rejected', suggestedPrice)}
                          className="flex-1 gap-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
