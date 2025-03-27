
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';

export default function StudentDashboard() {
  const { profile } = useAuth();

  return (
    <Layout>
      <div dir="rtl" className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">لوحة تحكم الطالب</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>مرحبًا، {profile?.first_name || 'الطالب'}</CardTitle>
              <CardDescription>
                طالب اللغة الكورية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                يمكنك حجز الدروس والتواصل مع المعلمين من هنا.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الدروس القادمة</CardTitle>
              <CardDescription>
                لا توجد دروس قادمة حاليًا
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                قم بحجز درس جديد للبدء في تعلم اللغة الكورية.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الرصيد</CardTitle>
              <CardDescription>
                0 ريال سعودي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                قم بشحن رصيدك لحجز المزيد من الدروس.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
