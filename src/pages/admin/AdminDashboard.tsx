import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooks } from '@/hooks/useBooks';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BookStatus, OrderStatus } from '@/types';
import { 
  BookOpen, Package, Users, DollarSign, 
  Check, X, Clock, Truck 
} from 'lucide-react';
import { useEffect } from 'react';

const ADMIN_COMMISSION_RATE = 0.1; // 10%

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { books, updateBookStatus, getPendingBooks } = useBooks();
  const { orders, updateOrderStatus } = useOrders();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const pendingBooks = getPendingBooks();
  const approvedBooks = books.filter(b => b.status === 'approved');
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.deliveryCharge, 0);
  const totalCommission = deliveredOrders.reduce((sum, o) => sum + (o.bookPrice * ADMIN_COMMISSION_RATE), 0);

  const handleBookAction = (bookId: string, status: BookStatus) => {
    updateBookStatus(bookId, status);
    toast({ 
      title: `Book ${status === 'approved' ? 'approved' : 'rejected'}` 
    });
  };

  const handleOrderStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    toast({ title: 'Order status updated' });
  };

  const orderStatuses: OrderStatus[] = ['requested', 'approved', 'picked-up', 'delivered', 'cancelled'];

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage books, orders, and payouts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                <span className="text-sm text-muted-foreground">Pending Books</span>
              </div>
              <p className="text-2xl font-bold mt-2">{pendingBooks.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">Live Books</span>
              </div>
              <p className="text-2xl font-bold mt-2">{approvedBooks.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Total Orders</span>
              </div>
              <p className="text-2xl font-bold mt-2">{totalOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">Earnings</span>
              </div>
              <p className="text-2xl font-bold mt-2">₹{(totalRevenue + totalCommission).toFixed(0)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Books</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="books">All Books</TabsTrigger>
          </TabsList>

          {/* Pending Books */}
          <TabsContent value="pending" className="mt-6">
            {pendingBooks.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No pending books to review
              </p>
            ) : (
              <div className="space-y-4">
                {pendingBooks.map(book => (
                  <Card key={book.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={book.imageUrl || '/placeholder.svg'}
                          alt={book.title}
                          className="w-20 h-28 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-display font-semibold">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">by {book.author}</p>
                          <p className="text-sm text-muted-foreground">Seller: {book.sellerName}</p>
                          <p className="text-primary font-semibold mt-1">₹{book.price}</p>
                          <p className="text-xs text-muted-foreground">{book.category} • {book.condition}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleBookAction(book.id, 'approved')}
                            className="gap-1"
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleBookAction(book.id, 'rejected')}
                            className="gap-1"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders" className="mt-6">
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No orders yet
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <img
                          src={order.bookImage || '/placeholder.svg'}
                          alt={order.bookTitle}
                          className="w-20 h-28 object-cover rounded"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{order.bookTitle}</h3>
                              <p className="text-sm text-muted-foreground">
                                Order: {order.id.slice(-8)}
                              </p>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Buyer:</span> {order.buyerName}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Seller:</span> {order.sellerName}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Phone:</span> {order.phone}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Book:</span> ₹{order.bookPrice}
                            </div>
                          </div>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Delivery:</span> {order.deliveryAddress}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[140px]">
                          <p className="text-sm font-medium">Update Status</p>
                          <Select 
                            value={order.status} 
                            onValueChange={(v) => handleOrderStatusChange(order.id, v as OrderStatus)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {orderStatuses.map(status => (
                                <SelectItem key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="text-sm mt-2">
                            <p className="text-muted-foreground">Total:</p>
                            <p className="font-semibold">₹{order.bookPrice + order.deliveryCharge}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* All Books */}
          <TabsContent value="books" className="mt-6">
            {books.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No books in the system
              </p>
            ) : (
              <div className="space-y-4">
                {books.map(book => (
                  <Card key={book.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4 items-center">
                        <img
                          src={book.imageUrl || '/placeholder.svg'}
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {book.author} • {book.sellerName}
                          </p>
                          <p className="text-primary font-semibold">₹{book.price}</p>
                        </div>
                        <StatusBadge status={book.status} type="book" />
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

export default AdminDashboard;
