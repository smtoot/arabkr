
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UpcomingLessonsSection } from '@/components/student-dashboard/UpcomingLessonsSection';
import { LearningGoalsSection } from '@/components/student-dashboard/LearningGoalsSection';
import { ProgressSection } from '@/components/student-dashboard/ProgressSection';
import { ReviewsSection } from '@/components/student-dashboard/ReviewsSection';
import { QuickActionsCard } from '@/components/student-dashboard/QuickActionsCard';
import { WalletCard } from '@/components/student-dashboard/WalletCard';
import { supabase } from '@/integrations/supabase/client';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [walletData, setWalletData] = useState<{ balance: number; currency: string } | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('wallets')
          .select('balance, currency')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching wallet data:', error);
        } else {
          setWalletData(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, [user]);

  return (
    <Layout>
      <div dir="rtl" className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">لوحة تحكم الطالب</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content - Left Column (2/3 width on medium screens and up) */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="upcoming">الدروس القادمة</TabsTrigger>
                <TabsTrigger value="progress">تقدمي</TabsTrigger>
                <TabsTrigger value="goals">أهدافي</TabsTrigger>
                <TabsTrigger value="reviews">تقييماتي</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-6">
                <UpcomingLessonsSection isLoading={lessonsLoading} />
              </TabsContent>
              
              <TabsContent value="progress" className="mt-6">
                <ProgressSection />
              </TabsContent>
              
              <TabsContent value="goals" className="mt-6">
                <LearningGoalsSection />
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <ReviewsSection isLoading={reviewsLoading} />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar - Right Column (1/3 width on medium screens and up) */}
          <div className="space-y-6">
            <QuickActionsCard />
            
            <WalletCard 
              walletData={walletData} 
              isLoading={isLoading} 
            />
            
            <Card>
              <CardHeader>
                <CardTitle>الدروس الشائعة</CardTitle>
                <CardDescription>
                  أكثر الدروس طلباً هذا الأسبوع
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">محادثة للمبتدئين</span>
                    <span className="text-sm text-muted-foreground">٤.٩ ★</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">قواعد اللغة الأساسية</span>
                    <span className="text-sm text-muted-foreground">٤.٨ ★</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">مفردات الحياة اليومية</span>
                    <span className="text-sm text-muted-foreground">٤.٧ ★</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" onClick={() => navigate('/teachers')}>
                  استكشاف المزيد من الدروس
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
