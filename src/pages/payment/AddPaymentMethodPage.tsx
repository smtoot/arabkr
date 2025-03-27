
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, CreditCard, Building, Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { addPaymentMethod } from '@/services/api/payment/paymentService';

export default function AddPaymentMethodPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentType, setPaymentType] = useState('card');
  
  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  
  // Bank account fields
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [iban, setIban] = useState('');
  
  // Wallet fields
  const [walletType, setWalletType] = useState('');
  const [walletId, setWalletId] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('يجب تسجيل الدخول لإضافة وسيلة دفع');
      return;
    }
    
    setProcessing(true);
    
    try {
      if (paymentType === 'card') {
        if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
          toast.error('يرجى إدخال جميع بيانات البطاقة');
          setProcessing(false);
          return;
        }
        
        const cardDetails = {
          cardName,
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiry: cardExpiry,
          cvc: cardCvc,
          brand: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard'
        };
        
        await addPaymentMethod(user.id, {
          type: 'card',
          details: cardDetails,
          is_default: isDefault
        });
      } else if (paymentType === 'bank') {
        if (!bankName || !accountName || !accountNumber || !iban) {
          toast.error('يرجى إدخال جميع بيانات الحساب البنكي');
          setProcessing(false);
          return;
        }
        
        const bankDetails = {
          bankName,
          accountName,
          accountNumber,
          iban
        };
        
        await addPaymentMethod(user.id, {
          type: 'bank',
          details: bankDetails,
          is_default: isDefault
        });
      } else if (paymentType === 'wallet') {
        if (!walletType || !walletId) {
          toast.error('يرجى إدخال جميع بيانات المحفظة الإلكترونية');
          setProcessing(false);
          return;
        }
        
        const walletDetails = {
          walletName: walletType,
          walletId
        };
        
        await addPaymentMethod(user.id, {
          type: 'wallet',
          details: walletDetails,
          is_default: isDefault
        });
      }
      
      toast.success('تمت إضافة وسيلة الدفع بنجاح');
      navigate('/payment');
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('حدث خطأ أثناء إضافة وسيلة الدفع');
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div dir="rtl" className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle>يرجى تسجيل الدخول</CardTitle>
              <CardDescription>
                يجب عليك تسجيل الدخول لإضافة وسيلة دفع
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
        <h1 className="mb-6 text-3xl font-bold">إضافة وسيلة دفع</h1>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>إضافة وسيلة دفع جديدة</CardTitle>
            <CardDescription>
              أضف وسيلة دفع جديدة لاستخدامها في المدفوعات المستقبلية
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <Tabs value={paymentType} onValueChange={setPaymentType}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    بطاقة ائتمان
                  </TabsTrigger>
                  <TabsTrigger value="bank" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    حساب بنكي
                  </TabsTrigger>
                  <TabsTrigger value="wallet" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    محفظة إلكترونية
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="card" className="space-y-4 mt-4">
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
                </TabsContent>
                
                <TabsContent value="bank" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">اسم البنك</Label>
                    <Input
                      id="bankName"
                      placeholder="اسم البنك"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountName">اسم صاحب الحساب</Label>
                    <Input
                      id="accountName"
                      placeholder="اسم صاحب الحساب"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">رقم الحساب</Label>
                    <Input
                      id="accountNumber"
                      placeholder="رقم الحساب"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="iban">رقم الآيبان (IBAN)</Label>
                    <Input
                      id="iban"
                      placeholder="SAxx xxxx xxxx xxxx xxxx xxxx"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="wallet" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="walletType">نوع المحفظة</Label>
                    <Input
                      id="walletType"
                      placeholder="مثال: Apple Pay, STC Pay"
                      value={walletType}
                      onChange={(e) => setWalletType(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="walletId">معرف المحفظة أو رقم الهاتف</Label>
                    <Input
                      id="walletId"
                      placeholder="معرف المحفظة أو رقم الهاتف"
                      value={walletId}
                      onChange={(e) => setWalletId(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox 
                  id="isDefault" 
                  checked={isDefault} 
                  onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                />
                <Label htmlFor="isDefault">استخدام كوسيلة دفع افتراضية</Label>
              </div>
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
                {processing ? 'جار المعالجة...' : 'إضافة وسيلة الدفع'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
