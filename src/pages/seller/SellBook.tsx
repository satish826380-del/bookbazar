import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooks } from '@/hooks/useBooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BOOK_CONDITIONS, BookCondition } from '@/types';
import { ArrowLeft, Upload, X, IndianRupee } from 'lucide-react';

const SellBook = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBook } = useBooks();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [printedMRP, setPrintedMRP] = useState('');
  const [condition, setCondition] = useState<BookCondition | ''>('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate suggested price based on condition and MRP
  const getSuggestedPrice = (): number => {
    if (!printedMRP || !condition) return 0;
    const mrp = parseFloat(printedMRP);
    if (isNaN(mrp)) return 0;
    
    const discountRates: Record<BookCondition, number> = {
      'new': 0.70,
      'like-new': 0.60,
      'good': 0.50,
      'fair': 0.40,
      'poor': 0.30,
    };
    
    return Math.round(mrp * discountRates[condition]);
  };

  const suggestedPrice = getSuggestedPrice();

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'seller') return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 2) {
      toast({ title: 'Maximum 2 images allowed', variant: 'destructive' });
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !printedMRP || !condition) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    if (images.length === 0) {
      toast({ title: 'Please upload at least one image', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      addBook({
        sellerId: user.id,
        sellerName: user.name,
        title,
        author: '',
        category: 'Other',
        price: suggestedPrice,
        condition,
        imageUrl: images[0],
        pickupAddress: '',
        phone: user.phone || '',
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
      <div className="container max-w-lg py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/seller')} 
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="shadow-soft">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">Sell Your Book</CardTitle>
            <CardDescription>
              Fill in the details below to list your book
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Book Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Book Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter book title"
                  className="h-12"
                  required
                />
              </div>

              {/* Printed MRP */}
              <div className="space-y-2">
                <Label htmlFor="mrp">Printed MRP (₹) *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mrp"
                    type="number"
                    min="1"
                    value={printedMRP}
                    onChange={(e) => setPrintedMRP(e.target.value)}
                    placeholder="Enter printed MRP"
                    className="h-12 pl-10"
                    required
                  />
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <Label>Book Condition *</Label>
                <Select value={condition} onValueChange={(v) => setCondition(v as BookCondition)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOK_CONDITIONS.map(cond => (
                      <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Book Images * (Max 2)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border bg-muted">
                      <img src={img} alt={`Book ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {images.length < 2 && (
                    <label className="aspect-[3/4] rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Auto Suggested Price */}
              <div className="space-y-2">
                <Label>Suggested Price</Label>
                <div className="h-12 px-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center">
                  <IndianRupee className="h-4 w-4 text-primary mr-1" />
                  <span className="text-lg font-semibold text-primary">
                    {suggestedPrice > 0 ? suggestedPrice : '—'}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">(Auto-calculated)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Price is calculated based on MRP and book condition
                </p>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12 text-base font-semibold" 
                disabled={isSubmitting || suggestedPrice === 0}
              >
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
