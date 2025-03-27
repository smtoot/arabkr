
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { arMA } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { processBookingPayment, getUserWalletBalance } from '@/services/api/bookingService';
import Layout from '@/components/Layout';
import {
  CreditCard,
  Wallet,
  Calendar,
  Clock,
  Check,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

const BookingPaymentPage: React.FC = () => {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<{
    balance: number;
    currency: string;
  } | null>(null);
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId || !user) return;
      
      try {
        // Fetch booking details
        const { data: booking, error } = await supabase
          .from('bookings')
          .select(`
            *,
            teacher:teacher_id (
              profiles:id (
                first_name,
                last_name,
                avatar_url
              )
            )
          `)
          .eq('id', bookingId)
          .eq('student_id', user.id)
          .single();
        
        if (error) throw error;
        if (!booking) throw new Error('Booking not found');
        
        setBookingDetails(booking);
        setTeacher(booking.teacher);
        
        // Fetch wallet balance
        const wallet = await getUserWalletBalance(user.id);
        setWalletBalance(wallet);
      } catch (error) {
        console.error(error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل تفاصيل الحجز",
          variant: "destructive",
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId, user, navigate, toast]);
  
  const handlePayWithWallet = async () => {
    if (!bookingId || !bookingDetails) return;
    
    if (!walletBalance || walletBalance.balance < bookingDetails.amount) {
      toast({
        title: "رصيد غير كافي",
        description: "يرجى شحن محفظتك أولاً",
        variant: "destructive",
      });
      return;
    }
    
    setProcessing(true);
    try {
      await processBookingPayment(bookingId, bookingDetails.amount);
      
      toast({
        title: "تم الدفع بنجاح",
        description: "تم تأكيد الحجز وخصم المبلغ من محفظتك",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast({
        title: "خطأ في الدفع",
        description: "حدث خطأ أثناء معالجة الدفع، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };
  
  // Handle loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </Layout>
    );
  }
  
  // Handle case where booking is not found
  if (!bookingDetails || !teacher) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>
              لم يتم العثور على تفاصيل الحجز. يرجى التحقق من الرابط أو المحاولة مرة أخرى.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة إلى لوحة التحكم
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const bookingAmount = bookingDetails.amount;
  const hasEnoughBalance = walletBalance && walletBalance.balance >= bookingAmount;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <h1 className="text-3xl font-bold mb-2 text-center">إتمام الدفع</h1>
        <p className="text-muted-foreground mb-8 text-center">اختر طريقة الدفع لتأكيد حجز الدرس</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>طرق الدفع</CardTitle>
                <CardDescription>اختر طريقة الدفع المفضلة لديك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className={`border rounded-lg p-4 ${hasEnoughBalance ? 'cursor-pointer hover:border-primary' : 'opacity-50 cursor-not-allowed'}`}
                  onClick={hasEnoughBalance ? handlePayWithWallet : undefined}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Wallet className="h-6 w-6 ml-3 text-primary" />
                      <div>
                        <h3 className="font-medium">الدفع من المحفظة</h3>
                        <p className="text-sm text-muted-foreground">
                          رصيدك الحالي: {walletBalance?.balance.toFixed(2)} {walletBalance?.currency}
                        </p>
                      </div>
                    </div>
                    <div>
                      {hasEnoughBalance ? (
                        <Button size="sm" variant="outline">
                          <Check className="h-4 w-4 ml-2" />
                          اختر
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          رصيد غير كافي
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 opacity-50 cursor-not-allowed">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CreditCard className="h-6 w-6 ml-3 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">بطاقة الائتمان</h3>
                        <p className="text-sm text-muted-foreground">
                          الدفع باستخدام بطاقة الائتمان أو مدى (قريباً)
                        </p>
                      </div>
                    </div>
                    <div>
                      <Button size="sm" variant="outline" disabled>
                        غير متوفر حالياً
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>ملاحظة هامة</AlertTitle>
              <AlertDescription>
                في الوقت الحالي، الطريقة الوحيدة المتاحة للدفع هي باستخدام رصيد المحفظة. إذا كان رصيدك غير كافٍ، يرجى شحن المحفظة من صفحة المحفظة في لوحة التحكم.
              </AlertDescription>
            </Alert>
          </div>
          
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>ملخص الحجز</CardTitle>
                <CardDescription>تفاصيل درسك المختار</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {teacher && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">المعلم:</span>
                    <span className="font-medium">
                      {teacher.profiles.first_name} {teacher.profiles.last_name}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">التاريخ:</span>
                  <span className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(parseISO(bookingDetails.start_time), 'EEEE, d MMMM yyyy', { locale: arMA })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الوقت:</span>
                  <span className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {format(parseISO(bookingDetails.start_time), 'h:mm a', { locale: arMA })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المدة:</span>
                  <span className="font-medium">
                    {(new Date(bookingDetails.end_time).getTime() - new Date(bookingDetails.start_time).getTime()) / (1000 * 60)} دقيقة
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between font-semibold">
                    <span>الإجمالي:</span>
                    <span>{bookingDetails.amount.toFixed(2)} ريال سعودي</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  disabled={!hasEnoughBalance || processing} 
                  onClick={handlePayWithWallet}
                >
                  {processing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      <span className="mr-2">جاري المعالجة...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      تأكيد الدفع
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPaymentPage;
