import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { BookGrid } from '@/components/books/BookGrid';
import { useBooks } from '@/hooks/useBooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Truck, CreditCard, ArrowRight, Package } from 'lucide-react';
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
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background">
        <div className="container py-12 md:py-24">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <Badge variant="secondary" className="mb-4 text-xs md:text-sm font-medium px-3 md:px-4 py-1 md:py-1.5">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              India's Trusted Book Marketplace
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 leading-[1.1] md:leading-tight">
              Buy & Sell Old Books{' '}
              <span className="text-primary italic">Easily</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Cash on Delivery • Trusted Delivery • Save Money
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Button size="lg" className="font-medium text-base px-8 h-12 w-full sm:w-auto" asChild>
                <a href="#books">
                  Browse Books
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="font-medium text-base px-8 h-12 w-full sm:w-auto shadow-sm" asChild>
                <Link to={user?.role === 'seller' ? '/seller/sell' : '/auth'}>Sell Your Book</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      </section>

      {/* How It Works */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-center mb-12 text-foreground">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: BookOpen,
                title: 'List Your Book',
                description: 'Seller lists book with details and images. We review and approve.',
              },
              {
                icon: Truck,
                title: 'We Pick & Deliver',
                description: 'We collect from seller and deliver safely to the buyer.',
              },
              {
                icon: CreditCard,
                title: 'Pay on Delivery',
                description: 'Buyer pays cash when book is delivered. Simple and secure.',
              },
            ].map((step, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-background border border-border/50 shadow-card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm font-medium text-primary mb-2">Step {index + 1}</div>
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section id="books" className="container pt-16 pb-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3 text-foreground">
            Featured Books
          </h2>
          <p className="text-muted-foreground">Discover quality second-hand books at great prices</p>
        </div>

        <div className="max-w-4xl mx-auto mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-card border-border/50 shadow-card"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 h-12">
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
        </div>
      </section>

      {/* Books Grid */}
      <section className="container pb-16">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading books...</p>
          </div>
        ) : filteredBooks.length > 0 ? (
          <BookGrid books={filteredBooks} />
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2 text-foreground">No Books Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to list a book!'}
            </p>
            <Button asChild>
              <Link to="/auth">Sell Your Book</Link>
            </Button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">
            Have Books to Sell?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Turn your old books into cash. List them on BookBazaar and we'll handle the rest.
          </p>
          <Button size="lg" variant="secondary" className="font-medium" asChild>
            <Link to="/auth">
              Start Selling Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
