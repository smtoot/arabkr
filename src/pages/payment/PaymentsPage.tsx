
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import { PaymentMethods } from '@/components/payments/PaymentMethods';
import { SubscriptionInfo } from '@/components/payments/SubscriptionInfo';
import { PaymentRecord, PaymentMethod, Subscription } from '@/types/payment';
import { getPaymentHistory, getPaymentMethods, getUserSubscription } from '@/services/api/payment';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '@/components/payments/Wallet';
import { supabase } from '@/integrations/supabase/client';

export default function PaymentsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [activeTab, setActiveTab] = useState('wallet');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch payment history
        const history = await getPaymentHistory(user.id);
        setPaymentHistory(history as PaymentRecord[]);
        
        // Fetch payment methods
        const methods = await getPaymentMethods(user.id);
        setPaymentMethods(methods as PaymentMethod[]);
        
        // Fetch subscription
        const sub = await getUserSubscription(user.id);
        setSubscription(sub as Subscription | null);
        
        // Fetch wallet balance
        const { data: wallet } = await supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', user.id)
          .single();
          
        if (wallet) {
          setWalletBalance(wallet.balance);
        }
      } catch (error) {
        console.error('Error fetching payment data:', error);
        toast.error('حدث خطأ أثناء جلب بيانات الدفع');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleRechargeWallet = () => {
    navigate('/payment/checkout', { state: { type: 'wallet_recharge' } });
  };

  const handleSubscribe = () => {
    navigate('/payment/checkout', { state: { type: 'subscription' } });
  };

  const handleAddPaymentMethod = () => {
    navigate('/payment/add-method');
  };

  if (!user) {
    return (
      <Layout>
        <div dir="rtl" className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle>يرجى تسجيل الدخول</CardTitle>
              <CardDescription>
                يجب عليك تسجيل الدخول للوصول إلى صفحة المدفوعات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/auth/login')}>
                تسجيل الدخول
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div dir="rtl" className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">المدفوعات والاشتراكات</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="wallet">المحفظة</TabsTrigger>
                <TabsTrigger value="history">سجل المدفوعات</TabsTrigger>
                <TabsTrigger value="methods">وسائل الدفع</TabsTrigger>
                <TabsTrigger value="subscription">الاشتراك</TabsTrigger>
              </TabsList>
              
              <TabsContent value="wallet" className="mt-6">
                <Wallet 
                  balance={walletBalance} 
                  currency="SAR" 
                  onRecharge={handleRechargeWallet} 
                  isLoading={loading}
                />
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <PaymentHistory 
                  payments={paymentHistory} 
                  isLoading={loading} 
                />
              </TabsContent>
              
              <TabsContent value="methods" className="mt-6">
                <PaymentMethods 
                  paymentMethods={paymentMethods} 
                  isLoading={loading}
                  onAddMethod={handleAddPaymentMethod}
                />
              </TabsContent>
              
              <TabsContent value="subscription" className="mt-6">
                <SubscriptionInfo 
                  subscription={subscription} 
                  isLoading={loading}
                  onSubscribe={handleSubscribe}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
                <CardDescription>
                  إدارة المدفوعات والاشتراكات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleRechargeWallet}
                >
                  شحن المحفظة
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleSubscribe}
                >
                  {subscription ? 'تغيير الاشتراك' : 'الاشتراك في باقة'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleAddPaymentMethod}
                >
                  إضافة وسيلة دفع
                </Button>
                <Separator />
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/student/dashboard')}
                >
                  العودة إلى لوحة التحكم
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
