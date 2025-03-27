
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Verification() {
  return (
    <div className="flex h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">تحقق من بريدك الإلكتروني</CardTitle>
          <CardDescription>
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
          
          <Link to="/auth/login">
            <Button variant="outline" className="mt-4 w-full">
              العودة إلى تسجيل الدخول
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
