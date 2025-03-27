
import { PaymentRecord } from '@/types/payment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface PaymentHistoryProps {
  payments: PaymentRecord[];
  isLoading: boolean;
}

export function PaymentHistory({ payments, isLoading }: PaymentHistoryProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">مكتمل</Badge>;
      case 'pending':
        return <Badge variant="outline">قيد المعالجة</Badge>;
      case 'failed':
        return <Badge variant="destructive">فشل</Badge>;
      case 'refunded':
        return <Badge variant="secondary">مسترجع</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentTypeText = (type: string) => {
    switch (type) {
      case 'wallet_recharge':
        return 'شحن محفظة';
      case 'lesson_payment':
        return 'دفع درس';
      case 'subscription':
        return 'اشتراك';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>سجل المدفوعات</CardTitle>
        <CardDescription>
          جميع معاملاتك المالية السابقة
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            لا يوجد سجل للمدفوعات حتى الآن
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاريخ</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {formatDate(payment.created_at)}
                  </TableCell>
                  <TableCell>{getPaymentTypeText(payment.payment_type)}</TableCell>
                  <TableCell dir="ltr" className="text-right">
                    {payment.amount.toFixed(2)} {payment.currency}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
