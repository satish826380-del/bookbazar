import { Badge } from '@/components/ui/badge';
import { OrderStatus, BookStatus } from '@/types';

interface StatusBadgeProps {
  status: OrderStatus | BookStatus;
  type?: 'order' | 'book';
}

export const StatusBadge = ({ status, type = 'order' }: StatusBadgeProps) => {
  const getStyles = () => {
    switch (status) {
      case 'pending':
      case 'requested':
        return 'bg-warning/20 text-warning-foreground border-warning';
      case 'approved':
        return 'bg-success/20 text-success border-success';
      case 'rejected':
      case 'cancelled':
        return 'bg-destructive/20 text-destructive border-destructive';
      case 'picked-up':
        return 'bg-primary/20 text-primary border-primary';
      case 'delivered':
      case 'sold':
        return 'bg-secondary/20 text-secondary border-secondary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'picked-up': return 'Picked Up';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Badge variant="outline" className={getStyles()}>
      {getLabel()}
    </Badge>
  );
};
