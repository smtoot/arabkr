
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to role-specific dashboard if profile is loaded
    if (profile) {
      if (profile.role === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else if (profile.role === 'teacher') {
        navigate('/teacher/dashboard', { replace: true });
      } else if (profile.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [profile, navigate]);

  // Show loading or fallback while redirecting
  return (
    <Layout>
      <div dir="rtl" className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">لوحة التحكم</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>جاري التحميل...</CardTitle>
              <CardDescription>
                جاري توجيهك إلى لوحة التحكم المناسبة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                يرجى الانتظار قليلًا...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
