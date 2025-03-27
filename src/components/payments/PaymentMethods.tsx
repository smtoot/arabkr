
import { PaymentMethod } from '@/types/payment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CreditCard, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { deletePaymentMethod, setDefaultPaymentMethod } from '@/services/api/payment/paymentMethodsService';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  onAddMethod: () => void;
}

export function PaymentMethods({ paymentMethods, isLoading, onAddMethod }: PaymentMethodsProps) {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  
  const handleDelete = async (methodId: string) => {
    if (!user) return;
    
    try {
      setDeleting(methodId);
      await deletePaymentMethod(user.id, methodId);
      // We would typically refetch payment methods here in a real app
      // For this demo, we'll assume the page will be refreshed
    } catch (error) {
      console.error('Error deleting payment method:', error);
    } finally {
      setDeleting(null);
    }
  };
  
  const handleSetDefault = async (methodId: string) => {
    if (!user) return;
    
    try {
      setUpdating(methodId);
      await setDefaultPaymentMethod(user.id, methodId);
      // We would typically refetch payment methods here in a real app
      // For this demo, we'll assume the page will be refreshed
    } catch (error) {
      console.error('Error setting default payment method:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    // In a real app, we would have different icons for different payment methods
    return <CreditCard className="h-6 w-6" />;
  };

  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        const lastFour = method.details.cardNumber?.slice(-4) || '****';
        return `بطاقة ${method.details.brand || ''} **** ${lastFour}`;
      case 'bank':
        return `حساب بنكي ${method.details.bankName || ''}`;
      case 'wallet':
        return `محفظة إلكترونية ${method.details.walletName || ''}`;
      default:
        return 'وسيلة دفع';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>وسائل الدفع</CardTitle>
        <CardDescription>
          إدارة وسائل الدفع الخاصة بك
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            لم تقم بإضافة أي وسائل دفع حتى الآن
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div 
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {getPaymentMethodIcon(method.type)}
                  <div>
                    <p className="font-medium">{getPaymentMethodName(method)}</p>
                    <p className="text-sm text-muted-foreground">
                      تم الإضافة: {new Date(method.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  {method.is_default && (
                    <Badge variant="outline" className="mr-2">افتراضي</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  {!method.is_default && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      disabled={updating === method.id}
                    >
                      {updating === method.id ? 'جار التحديث...' : 'تعيين كافتراضي'}
                    </Button>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف وسيلة الدفع</AlertDialogTitle>
                        <AlertDialogDescription>
                          هل أنت متأكد من أنك تريد حذف وسيلة الدفع هذه؟ لا يمكن التراجع عن هذا الإجراء.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(method.id)}
                          disabled={deleting === method.id}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleting === method.id ? 'جار الحذف...' : 'حذف'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={onAddMethod} className="w-full">
          إضافة وسيلة دفع جديدة
        </Button>
      </CardFooter>
    </Card>
  );
}
