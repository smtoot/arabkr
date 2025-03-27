
import { SUBSCRIPTION_PLANS, Subscription } from '@/types/payment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { cancelSubscription } from '@/services/api/payment/subscriptionService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SubscriptionInfoProps {
  subscription: Subscription | null;
  isLoading: boolean;
  onSubscribe: () => void;
}

export function SubscriptionInfo({ subscription, isLoading, onSubscribe }: SubscriptionInfoProps) {
  const { user } = useAuth();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showPlans, setShowPlans] = useState(false);
  
  const handleCancel = async (subscriptionId: string) => {
    if (!user) return;
    
    try {
      setCancellingId(subscriptionId);
      await cancelSubscription(user.id, subscriptionId);
      // We would typically refetch subscription data here in a real app
      // For this demo, we'll assume the page will be refreshed
      toast.success('تم إلغاء الاشتراك بنجاح');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setCancellingId(null);
    }
  };
  
  const renderCurrentSubscription = () => {
    if (!subscription) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            ليس لديك اشتراك نشط حالياً
          </p>
          <Button onClick={() => setShowPlans(true)}>
            اشترك الآن
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{subscription.plan_name}</h3>
            <p className="text-sm text-muted-foreground">
              ينتهي في {formatDate(subscription.end_date)}
            </p>
          </div>
          <Badge className="ml-2">نشط</Badge>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex justify-between mb-2">
            <span>الاشتراك</span>
            <span dir="ltr">{subscription.price} {subscription.currency}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>تاريخ الاشتراك</span>
            <span>{formatDate(subscription.start_date)}</span>
          </div>
        </div>
        
        <div className="flex justify-between gap-4">
          <Button variant="outline" className="flex-1" onClick={() => setShowPlans(true)}>
            تغيير الباقة
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1"
            onClick={() => handleCancel(subscription.id)}
            disabled={cancellingId === subscription.id}
          >
            {cancellingId === subscription.id ? 'جار الإلغاء...' : 'إلغاء الاشتراك'}
          </Button>
        </div>
      </div>
    );
  };
  
  const renderSubscriptionPlans = () => {
    return (
      <Dialog open={showPlans} onOpenChange={setShowPlans}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>اختر باقة الاشتراك</DialogTitle>
            <DialogDescription>
              اختر الباقة المناسبة لاحتياجاتك التعليمية
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 md:grid-cols-3">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <Card key={plan.id} className={
                plan.id === 'standard' 
                  ? 'border-primary shadow-md' 
                  : ''
              }>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="block text-2xl font-bold mt-2 text-foreground">
                      {plan.price} {plan.currency}
                    </span>
                    <span className="text-xs">شهرياً</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-primary mt-0.5 ml-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.id === 'standard' ? 'default' : 'outline'}
                    onClick={() => {
                      setShowPlans(false);
                      onSubscribe();
                    }}
                  >
                    اختر هذه الباقة
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlans(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>الاشتراك</CardTitle>
          <CardDescription>
            إدارة اشتراكك والباقات المتاحة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            renderCurrentSubscription()
          )}
        </CardContent>
      </Card>
      {renderSubscriptionPlans()}
    </>
  );
}
