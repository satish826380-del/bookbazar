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
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Buyer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Seller</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Delivery Address</th>
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
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <p className="text-sm text-muted-foreground max-w-xs truncate">
                          {order.deliveryAddress}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-foreground">₹{totalAmount}</p>
                        <p className="text-xs text-muted-foreground text-[10px]">
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

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {orders.map(order => {
              const totalAmount = order.bookPrice + order.deliveryCharge;
              const statusLabel = orderStatusOptions.find(s => s.value === order.status)?.label || order.status;

              return (
                <Card key={order.id} className="border-border/50 shadow-sm overflow-hidden">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={order.bookImage || '/placeholder.svg'}
                        alt={order.bookTitle}
                        className="w-16 h-20 object-cover rounded bg-muted"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground line-clamp-1">{order.bookTitle}</h3>
                        <p className="text-xs text-muted-foreground">ID: #{order.id.slice(-8)}</p>
                        <div className="mt-2 text-sm font-semibold text-primary">₹{totalAmount} (COD)</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm border-t border-border pt-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Buyer</p>
                        <p className="font-medium">{order.buyerName}</p>
                        <p className="text-xs text-muted-foreground">{order.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Seller</p>
                        <p className="font-medium">{order.sellerName}</p>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Address</p>
                      <p className="line-clamp-2">{order.deliveryAddress}</p>
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Order Status</span>
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
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
