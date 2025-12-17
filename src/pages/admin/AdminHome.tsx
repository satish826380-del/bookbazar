import { useBooks } from '@/hooks/useBooks';
import { useOrders } from '@/hooks/useOrders';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Clock, Package, IndianRupee } from 'lucide-react';

const ADMIN_MARGIN_RATE = 0.4; // 40%

const AdminHome = () => {
  const { books, getPendingBooks } = useBooks();
  const { orders } = useOrders();

  const pendingBooks = getPendingBooks();
  const totalBooks = books.length;
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  
  const totalEarnings = deliveredOrders.reduce((sum, o) => {
    return sum + o.deliveryCharge + (o.bookPrice * ADMIN_MARGIN_RATE);
  }, 0);

  const stats = [
    {
      label: 'Total Books Listed',
      value: totalBooks,
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Pending Approvals',
      value: pendingBooks.length,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Active Orders',
      value: activeOrders.length,
      icon: Package,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Earnings',
      value: `₹${totalEarnings.toFixed(0)}`,
      icon: IndianRupee,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your marketplace</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
