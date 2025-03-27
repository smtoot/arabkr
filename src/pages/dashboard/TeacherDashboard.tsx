
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';

export default function TeacherDashboard() {
  const { profile } = useAuth();

  return (
    <Layout>
      <div dir="rtl" className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">لوحة تحكم المعلم</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>مرحبًا، {profile?.first_name || 'المعلم'}</CardTitle>
              <CardDescription>
                معلم اللغة الكورية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                يمكنك إدارة جدولك والتواصل مع الطلاب من هنا.
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
                قم بتحديد جدولك لاستقبال حجوزات جديدة.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الأرباح</CardTitle>
              <CardDescription>
                0 ريال سعودي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                الأرباح المتوفرة من الدروس المكتملة.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
