import { useOrders } from '@/hooks/useOrders';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { OrderStatus } from '@/types';

const orderStatusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'requested', label: 'Pending' },
  { value: 'approved', label: 'Collected' },
  { value: 'picked-up', label: 'Picked Up' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'requested':
      return 'bg-amber-100 text-amber-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'picked-up':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useOrders();
  const { toast } = useToast();

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      toast({ title: 'Order status updated' });
    } catch (error) {
      toast({ title: 'Failed to update order', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Orders Management</h1>
        <p className="text-muted-foreground">Manage all COD orders</p>
      </div>

      {orders.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            No orders yet
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Buyer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Seller</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Delivery Address</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">COD Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const totalAmount = order.bookPrice + order.deliveryCharge;
                const statusLabel = orderStatusOptions.find(s => s.value === order.status)?.label || order.status;

                return (
                  <tr key={order.id} className="border-b border-border hover:bg-muted/30">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.bookImage || '/placeholder.svg'}
                          alt={order.bookTitle}
                          className="w-10 h-14 object-cover rounded bg-muted"
                        />
                        <div>
                          <p className="font-medium text-sm text-foreground">{order.bookTitle}</p>
                          <p className="text-xs text-muted-foreground">#{order.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-foreground">{order.buyerName}</p>
                      <p className="text-xs text-muted-foreground">{order.phone}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-foreground">{order.sellerName}</p>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <p className="text-sm text-muted-foreground max-w-xs truncate">
                        {order.deliveryAddress}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-foreground">₹{totalAmount}</p>
                      <p className="text-xs text-muted-foreground">
                        Book: ₹{order.bookPrice} + Del: ₹{order.deliveryCharge}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <Select
                        value={order.status}
                        onValueChange={(v) => handleStatusChange(order.id, v as OrderStatus)}
                      >
                        <SelectTrigger className={`w-32 h-8 text-xs font-medium ${getStatusColor(order.status)}`}>
                          <SelectValue>{statusLabel}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {orderStatusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
