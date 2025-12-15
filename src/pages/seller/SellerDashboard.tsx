import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooks } from '@/hooks/useBooks';
import { useOrders } from '@/hooks/useOrders';
import { BookGrid } from '@/components/books/BookGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BookPlus, Package, DollarSign, Clock } from 'lucide-react';
import { useEffect } from 'react';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getBooksBySeller } = useBooks();
  const { getOrdersBySeller } = useOrders();

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'seller') return null;

  const myBooks = getBooksBySeller(user.id);
  const myOrders = getOrdersBySeller(user.id);

  const pendingBooks = myBooks.filter(b => b.status === 'pending').length;
  const approvedBooks = myBooks.filter(b => b.status === 'approved').length;
  const soldBooks = myBooks.filter(b => b.status === 'sold').length;
  const totalEarnings = myOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.bookPrice, 0);

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/seller/sell">
              <BookPlus className="h-4 w-4" />
              List New Book
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <p className="text-2xl font-bold mt-2">{pendingBooks}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">Approved</span>
              </div>
              <p className="text-2xl font-bold mt-2">{approvedBooks}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Sold</span>
              </div>
              <p className="text-2xl font-bold mt-2">{soldBooks}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">Earnings</span>
              </div>
              <p className="text-2xl font-bold mt-2">₹{totalEarnings}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="books">
          <TabsList>
            <TabsTrigger value="books">My Books</TabsTrigger>
            <TabsTrigger value="orders">Sales</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="mt-6">
            <BookGrid 
              books={myBooks} 
              showStatus 
              emptyMessage="You haven't listed any books yet."
            />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            {myOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No sales yet
              </p>
            ) : (
              <div className="space-y-4">
                {myOrders.map(order => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={order.bookImage || '/placeholder.svg'}
                          alt={order.bookTitle}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{order.bookTitle}</h3>
                              <p className="text-sm text-muted-foreground">
                                Buyer: {order.buyerName}
                              </p>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="text-primary font-semibold mt-2">₹{order.bookPrice}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SellerDashboard;
