
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SUBSCRIPTION_PLANS, PaymentMethod } from '@/types/payment';
import { createPayment, getPaymentMethods } from '@/services/api/payment';
import { Loader2, CreditCard, Check } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

export default function CheckoutPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentType, setPaymentType] = useState<'wallet_recharge' | 'subscription'>('wallet_recharge');
  const [amount, setAmount] = useState<number>(100);
  const [selectedPlan, setSelectedPlan] = useState<string>('standard');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  useEffect(() => {
    // Get payment type from location state
    const state = location.state as { type: 'wallet_recharge' | 'subscription' } | null;
    if (state?.type) {
      setPaymentType(state.type);
    }
  }, [location.state]);

  useEffect(() => {
    if (!user) return;
    
    const fetchPaymentMethods = async () => {
      setLoading(true);
      try {
        const methods = await getPaymentMethods(user.id);
        setPaymentMethods(methods as PaymentMethod[]);
        
        // Select default payment method if available
        const defaultMethod = methods.find(m => m.is_default);
        if (defaultMethod) {
          setSelectedPaymentMethod(defaultMethod.id);
        } else if (methods.length > 0) {
          setSelectedPaymentMethod(methods[0].id);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentMethods();
  }, [user]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces every 4 digits
    const value = e.target.value.replace(/\s/g, '');
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format expiry date as MM/YY
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      setCardExpiry(value);
    } else {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    }
  };

  const getCurrentPlan = () => {
    return SUBSCRIPTION_PLANS.find(plan => plan.id === selectedPlan);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('يجب تسجيل الدخول لإتمام عملية الدفع');
      return;
    }
    
    if (!selectedPaymentMethod && !showAddCard) {
      toast.error('يرجى اختيار وسيلة دفع أو إضافة بطاقة جديدة');
      return;
    }
    
    if (showAddCard) {
      if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
        toast.error('يرجى إدخال جميع بيانات البطاقة');
        return;
      }
    }
    
    setProcessing(true);
    
    try {
      let paymentMethodId = selectedPaymentMethod;
      
      // In a real app, we would integrate with a payment processor like Stripe
      // For the demo, we'll mock a new payment method if adding a card
      if (showAddCard) {
        // Mock creating a new payment method
        const cardDetails = {
          cardName,
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiry: cardExpiry,
          cvc: cardCvc,
          brand: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard'
        };
        
        const { data } = await supabase
          .from('payment_methods')
          .insert({
            user_id: user.id,
            type: 'card',
            details: cardDetails,
            is_default: paymentMethods.length === 0
          })
          .select('*')
          .single();
          
        paymentMethodId = data.id;
      }
      
      if (paymentType === 'wallet_recharge') {
        // Process wallet recharge
        const payment = await createPayment(user.id, {
          amount,
          currency: 'SAR',
          payment_type: 'wallet_recharge',
          payment_method_id: paymentMethodId || undefined,
          metadata: {
            description: 'شحن المحفظة'
          }
        });
        
        setPaymentResult(payment);
        setShowSuccess(true);
      } else if (paymentType === 'subscription') {
        // Process subscription payment
        const plan = getCurrentPlan();
        if (!plan) {
          toast.error('يرجى اختيار باقة صالحة');
          return;
        }
        
        // Calculate end date (30 days from now)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.duration_days);
        
        const payment = await createPayment(user.id, {
          amount: plan.price,
          currency: 'SAR',
          payment_type: 'subscription',
          payment_method_id: paymentMethodId || undefined,
          metadata: {
            plan_id: plan.id,
            plan_name: plan.name,
            end_date: endDate.toISOString()
          }
        });
        
        setPaymentResult(payment);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('حدث خطأ أثناء معالجة الدفع');
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    if (paymentType === 'wallet_recharge') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">مبلغ الشحن (ريال سعودي)</Label>
            <div className="flex">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min={10}
                className="rounded-l-none"
                dir="ltr"
              />
              <div className="flex items-center justify-center px-3 border border-r-0 rounded-r-md bg-muted">
                SAR
              </div>
            </div>
          </div>
          
          <RadioGroup className="grid grid-cols-3 gap-2">
            {[50, 100, 200, 500, 1000, 2000].map((value) => (
              <div key={value}>
                <RadioGroupItem
                  value={value.toString()}
                  id={`amount-${value}`}
                  className="sr-only"
                  checked={amount === value}
                  onClick={() => setAmount(value)}
                />
                <Label
                  htmlFor={`amount-${value}`}
                  className={`flex items-center justify-center p-2 border rounded-md cursor-pointer ${
                    amount === value ? 'border-primary bg-primary/10 text-primary' : ''
                  }`}
                >
                  {value} ر.س
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    } else if (paymentType === 'subscription') {
      return (
        <div className="space-y-4">
          <Label>اختر الباقة</Label>
          <RadioGroup 
            value={selectedPlan} 
            onValueChange={setSelectedPlan}
            className="grid gap-4"
          >
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div key={plan.id} className="relative">
                <RadioGroupItem
                  value={plan.id}
                  id={`plan-${plan.id}`}
                  className="sr-only peer"
                />
                <Label
                  htmlFor={`plan-${plan.id}`}
                  className="flex flex-col p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 hover:bg-muted transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{plan.name}</span>
                      <p className="text-sm text-muted-foreground">
                        {plan.duration_days} يوم
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg">{plan.price} ر.س</span>
                      <p className="text-xs text-muted-foreground">شهرياً</p>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <ul className="grid gap-1 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Label>
                {selectedPlan === plan.id && (
                  <Check className="absolute top-3 right-3 h-5 w-5 text-primary" />
                )}
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    }
    
    return null;
  };

  const renderPaymentMethods = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>وسيلة الدفع</Label>
          <Button 
            variant="link" 
            onClick={() => setShowAddCard(!showAddCard)}
            className="text-sm p-0 h-auto"
          >
            {showAddCard ? 'استخدام بطاقة محفوظة' : 'إضافة بطاقة جديدة'}
          </Button>
        </div>
        
        {!showAddCard ? (
          paymentMethods.length > 0 ? (
            <RadioGroup 
              value={selectedPaymentMethod || ''}
              onValueChange={setSelectedPaymentMethod}
              className="space-y-2"
            >
              {paymentMethods.map((method) => (
                <div key={method.id} className="relative">
                  <RadioGroupItem
                    value={method.id}
                    id={`method-${method.id}`}
                    className="sr-only peer"
                  />
                  <Label
                    htmlFor={`method-${method.id}`}
                    className="flex items-center p-3 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 hover:bg-muted transition-colors"
                  >
                    <CreditCard className="ml-3 h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {method.type === 'card' ? `بطاقة **** ${method.details.cardNumber?.slice(-4) || '****'}` : 'وسيلة دفع'}
                      </p>
                      {method.is_default && (
                        <p className="text-xs text-muted-foreground">افتراضي</p>
                      )}
                    </div>
                    {selectedPaymentMethod === method.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="text-center py-4 border rounded-md bg-muted">
              <p className="text-muted-foreground">لا توجد وسائل دفع محفوظة</p>
              <Button 
                variant="link" 
                onClick={() => setShowAddCard(true)}
                className="text-sm p-0 h-auto mt-2"
              >
                إضافة بطاقة جديدة
              </Button>
            </div>
          )
        ) : (
          <div className="space-y-4 border rounded-md p-4 bg-muted/30">
            <div className="space-y-2">
              <Label htmlFor="cardName">الاسم على البطاقة</Label>
              <Input
                id="cardName"
                placeholder="الاسم على البطاقة"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">رقم البطاقة</Label>
              <Input
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                dir="ltr"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">تاريخ الانتهاء</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  maxLength={5}
                  dir="ltr"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvc">رمز الأمان</Label>
                <Input
                  id="cvc"
                  placeholder="CVC"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  maxLength={3}
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOrderSummary = () => {
    if (paymentType === 'wallet_recharge') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>مبلغ الشحن</span>
            <span>{amount} ر.س</span>
          </div>
          <div className="flex justify-between">
            <span>الرسوم</span>
            <span>0.00 ر.س</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>الإجمالي</span>
            <span>{amount} ر.س</span>
          </div>
        </div>
      );
    } else if (paymentType === 'subscription') {
      const plan = getCurrentPlan();
      if (!plan) return null;
      
      return (
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>{plan.name}</span>
            <span>{plan.price} ر.س</span>
          </div>
          <div className="flex justify-between">
            <span>المدة</span>
            <span>{plan.duration_days} يوم</span>
          </div>
          <div className="flex justify-between">
            <span>الرسوم</span>
            <span>0.00 ر.س</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>الإجمالي</span>
            <span>{plan.price} ر.س</span>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderSuccessScreen = () => {
    if (!paymentResult) return null;
    
    const isSuccessful = paymentResult.status === 'completed';
    
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className={isSuccessful ? 'text-green-600' : 'text-destructive'}>
            {isSuccessful ? 'تمت عملية الدفع بنجاح' : 'فشلت عملية الدفع'}
          </CardTitle>
          <CardDescription>
            {isSuccessful 
              ? 'تم تسجيل معاملة الدفع بنجاح'
              : 'حدث خطأ أثناء معالجة الدفع، يرجى المحاولة مرة أخرى'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">نوع المعاملة</span>
              <span>
                {paymentResult.payment_type === 'wallet_recharge' 
                  ? 'شحن المحفظة' 
                  : 'اشتراك'
                }
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">المبلغ</span>
              <span>{paymentResult.amount} {paymentResult.currency}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">الحالة</span>
              <span className={isSuccessful ? 'text-green-600' : 'text-destructive'}>
                {isSuccessful ? 'مكتمل' : 'فشل'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">التاريخ</span>
              <span>{new Date(paymentResult.created_at).toLocaleDateString('ar-SA')}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <Button 
            className="w-full" 
            onClick={() => navigate('/payment')}
          >
            العودة إلى صفحة المدفوعات
          </Button>
          
          {!isSuccessful && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowSuccess(false)}
            >
              إعادة المحاولة
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  if (!user) {
    return (
      <Layout>
        <div dir="rtl" className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle>يرجى تسجيل الدخول</CardTitle>
              <CardDescription>
                يجب عليك تسجيل الدخول للوصول إلى صفحة الدفع
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
        <h1 className="mb-6 text-3xl font-bold">
          {showSuccess 
            ? 'نتيجة الدفع' 
            : paymentType === 'wallet_recharge' 
              ? 'شحن المحفظة' 
              : 'الاشتراك'
          }
        </h1>
        
        {showSuccess ? (
          renderSuccessScreen()
        ) : (
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {paymentType === 'wallet_recharge' ? 'شحن المحفظة' : 'اختر الباقة'}
                  </CardTitle>
                  <CardDescription>
                    {paymentType === 'wallet_recharge' 
                      ? 'أدخل المبلغ الذي تريد إضافته إلى محفظتك' 
                      : 'اختر باقة الاشتراك المناسبة لك'
                    }
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    {/* Payment form (amount or subscription plan) */}
                    {renderPaymentForm()}
                    
                    {/* Payment methods selection */}
                    {renderPaymentMethods()}
                  </CardContent>
                  
                  <CardFooter className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate('/payment')}
                    >
                      إلغاء
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={processing}
                    >
                      {processing && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                      {processing ? 'جار المعالجة...' : 'إتمام الدفع'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
            
            <div className="md:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderOrderSummary()}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
