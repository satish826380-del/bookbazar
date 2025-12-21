import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ShoppingCart, Package, Truck, MapPin, Phone } from 'lucide-react';
import { useEffect } from 'react';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { getOrdersByBuyer } = useOrders();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'buyer')) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return null;
  if (!user || user.role !== 'buyer') return null;

  const myOrders = getOrdersByBuyer(user.id);

  const activeOrders = myOrders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const completedOrders = myOrders.filter(o => o.status === 'delivered');

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/">
              <ShoppingCart className="h-4 w-4" />
              Browse Books
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Active Orders</span>
              </div>
              <p className="text-2xl font-bold mt-2">{activeOrders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">Delivered</span>
              </div>
              <p className="text-2xl font-bold mt-2">{completedOrders.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        {myOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-display text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring books and place your first order!
            </p>
            <Button asChild>
              <Link to="/">Browse Books</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map(order => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <img
                      src={order.bookImage || '/placeholder.svg'}
                      alt={order.bookTitle}
                      className="w-full sm:w-32 h-40 sm:h-auto object-cover"
                    />
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-display font-semibold text-lg">{order.bookTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            Order ID: {order.id.slice(-8)}
                          </p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-muted-foreground">{order.deliveryAddress}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{order.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">Total (COD)</p>
                          <p className="font-semibold text-primary">
                            ₹{order.bookPrice + order.deliveryCharge}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Ordered: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BuyerDashboard;
