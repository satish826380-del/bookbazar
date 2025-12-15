import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooks } from '@/hooks/useBooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BOOK_CATEGORIES, BOOK_CONDITIONS, BookCondition } from '@/types';
import { ArrowLeft, Upload } from 'lucide-react';
import { useEffect } from 'react';

const SellBook = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBook } = useBooks();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<BookCondition | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'seller') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !category || !price || !condition || !pickupAddress || !phone) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      addBook({
        sellerId: user.id,
        sellerName: user.name,
        title,
        author,
        category,
        price: parseFloat(price),
        condition,
        imageUrl: imageUrl || '/placeholder.svg',
        pickupAddress,
        phone,
      });

      toast({ 
        title: 'Book listed successfully!',
        description: 'Your book is pending admin approval.'
      });
      navigate('/seller');
    } catch (error) {
      toast({ title: 'Failed to list book', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/seller')} 
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">List Your Book</CardTitle>
            <CardDescription>
              Fill in the details below. Your book will be visible after admin approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Book Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Book Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter book title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {BOOK_CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Condition *</Label>
                    <Select value={condition} onValueChange={(v) => setCondition(v as BookCondition)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {BOOK_CONDITIONS.map(cond => (
                          <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price in rupees"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Book Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/book-image.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste a URL to your book's image, or leave empty for placeholder
                  </p>
                </div>
              </div>

              {/* Pickup Details */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-semibold">Pickup Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="pickupAddress">Pickup Address *</Label>
                  <Textarea
                    id="pickupAddress"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Enter full address for book pickup"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SellBook;
