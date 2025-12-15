import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { BookGrid } from '@/components/books/BookGrid';
import { useBooks } from '@/hooks/useBooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookPlus, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BOOK_CATEGORIES } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const { getApprovedBooks, isLoading } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const approvedBooks = getApprovedBooks();

  const filteredBooks = useMemo(() => {
    return approvedBooks.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [approvedBooks, searchQuery, selectedCategory]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-20">
        <div className="container text-center space-y-6">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Discover Your Next<br />
            <span className="text-primary">Great Read</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Buy and sell pre-loved books with ease. Cash on delivery, no hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="gap-2">
              <Link to={user?.role === 'buyer' ? '/' : '/auth?mode=signup&role=buyer'}>
                <ShoppingCart className="h-5 w-5" />
                Buy Books
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2">
              <Link to={user?.role === 'seller' ? '/seller/sell' : '/auth?mode=signup&role=seller'}>
                <BookPlus className="h-5 w-5" />
                Sell Books
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="container py-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {BOOK_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Books Grid */}
      <section className="container pb-12">
        <h2 className="font-display text-2xl font-semibold mb-6">
          Available Books
          <span className="text-muted-foreground text-base font-normal ml-2">
            ({filteredBooks.length})
          </span>
        </h2>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading books...</p>
          </div>
        ) : (
          <BookGrid 
            books={filteredBooks} 
            emptyMessage="No books available yet. Be the first to list one!"
          />
        )}
      </section>

      {/* COD Notice */}
      <section className="container pb-12">
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <h3 className="font-display text-xl font-semibold mb-2">Cash on Delivery Only</h3>
          <p className="text-muted-foreground">
            All orders are paid via Cash on Delivery. Pay when you receive your book!
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
