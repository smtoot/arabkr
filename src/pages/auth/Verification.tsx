
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Verification() {
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
      });

      if (error) {
        toast({
          title: "فشل إعادة الإرسال",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "تم إعادة الإرسال",
          description: "تم إرسال رابط التحقق مرة أخرى إلى بريدك الإلكتروني",
        });
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء إعادة إرسال البريد الإلكتروني",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">تحقق من بريدك الإلكتروني</CardTitle>
          <CardDescription className="text-muted-foreground">
            لقد أرسلنا بريدًا إلكترونيًا للتحقق إلى عنوان بريدك الإلكتروني.
            يرجى النقر على الرابط في البريد الإلكتروني لتفعيل حسابك.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="mx-auto my-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          
          <p className="text-sm text-muted-foreground">
            لم تستلم البريد الإلكتروني؟ تحقق من مجلد البريد غير المرغوب فيه أو
          </p>
          
          <Button 
            variant="outline" 
            className="w-full mt-1" 
            onClick={handleResendEmail}
            disabled={isResending}
          >
            {isResending ? "جارٍ إعادة الإرسال..." : "إعادة إرسال البريد الإلكتروني"}
          </Button>
          
          <Link to="/auth/login">
            <Button variant="default" className="mt-4 w-full">
              العودة إلى تسجيل الدخول
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
