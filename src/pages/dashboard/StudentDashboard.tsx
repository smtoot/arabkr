
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getUserWalletBalance } from '@/services/api/bookingService';
import { fetchUpcomingLessons } from '@/services/api/student/lessonService';
import { fetchStudentReviews } from '@/services/api/student/reviewsService';
import Layout from '@/components/Layout';
import { CalendarDays, Wallet, GraduationCap, MessageSquare, Video, Plus, ChevronRight, Star, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [progressValue, setProgressValue] = useState(0);
  
  // Fetch wallet balance
  const { 
    data: walletData, 
    isLoading: walletLoading 
  } = useQuery({
    queryKey: ['walletBalance', user?.id],
    queryFn: () => user?.id ? getUserWalletBalance(user.id) : null,
    enabled: !!user?.id,
  });
  
  // Fetch upcoming lessons
  const { 
    data: upcomingLessons, 
    isLoading: lessonsLoading 
  } = useQuery({
    queryKey: ['upcomingLessons', user?.id],
    queryFn: () => user?.id ? fetchUpcomingLessons(user.id) : [],
    enabled: !!user?.id,
  });
  
  // Fetch reviews
  const { 
    data: reviews, 
    isLoading: reviewsLoading 
  } = useQuery({
    queryKey: ['studentReviews', user?.id],
    queryFn: () => user?.id ? fetchStudentReviews(user.id) : [],
    enabled: !!user?.id,
  });
  
  // Simulate progress increase for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => setProgressValue(30), 500);
    return () => clearTimeout(timer);
  }, []);

  // Learning goals (would typically come from an API)
  const learningGoals = [
    { id: 1, title: "إتقان المحادثة الأساسية", progress: 45 },
    { id: 2, title: "تعلم 500 كلمة شائعة", progress: 60 },
    { id: 3, title: "إتقان النطق الصحيح", progress: 25 },
  ];

  return (
    <Layout>
      <div dir="rtl" className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">لوحة تحكم الطالب</h1>
        
        {/* Welcome and Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Welcome Card */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                مرحبًا، {profile?.first_name || 'الطالب'}
              </CardTitle>
              <CardDescription>
                رحلتك في تعلم اللغة الكورية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">التقدم الكلي</p>
                  <Progress value={progressValue} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">
                    أتممت {progressValue}% من خطة التعلم الخاصة بك
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/student/learning-plan')}>
                عرض خطة التعلم الكاملة
              </Button>
            </CardFooter>
          </Card>

          {/* Wallet Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-6 w-6 text-primary" />
                الرصيد
              </CardTitle>
              <CardDescription>رصيد محفظتك الحالي</CardDescription>
            </CardHeader>
            <CardContent>
              {walletLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-3xl font-bold">
                  {walletData?.balance.toFixed(2) || 0} 
                  <span className="text-lg font-normal text-muted-foreground mr-1">
                    {walletData?.currency || 'ر.س'}
                  </span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/wallet')}>
                شحن الرصيد
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
              <CardDescription>أدوات مساعدة للتعلم</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start" onClick={() => navigate('/teachers')}>
                <Video className="mr-2 h-4 w-4" />
                حجز درس جديد
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/messages')}>
                <MessageSquare className="mr-2 h-4 w-4" />
                الرسائل
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/student/resources')}>
                <GraduationCap className="mr-2 h-4 w-4" />
                مصادر التعلم
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Learning Goals Section */}
        <h2 className="text-xl font-semibold mb-4">أهداف التعلم</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {learningGoals.map((goal) => (
            <Card key={goal.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={goal.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {goal.progress}% مكتمل
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Upcoming Lessons Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">الدروس القادمة</h2>
            <Button variant="ghost" className="text-primary" onClick={() => navigate('/student/lessons')}>
              عرض الكل <ChevronRight className="h-4 w-4 mr-1" />
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lessonsLoading ? (
              Array(3).fill(0).map((_, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : upcomingLessons && upcomingLessons.length > 0 ? (
              upcomingLessons.slice(0, 3).map((lesson) => (
                <Card key={lesson.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <CalendarDays className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">
                          {format(new Date(lesson.start_time), 'EEEE d MMMM', { locale: ar })}
                        </span>
                      </div>
                      <Badge variant="outline" className="h-6">
                        {lesson.lesson_type}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {format(new Date(lesson.start_time), 'h:mm a', { locale: ar })}
                      </span>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button size="sm" onClick={() => navigate(`/lesson/${lesson.id}`)}>
                        الانضمام للدرس
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/messages/${lesson.teacher_id}`)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="md:col-span-2 lg:col-span-3 bg-muted rounded-lg p-6 text-center">
                <p className="text-muted-foreground mb-3">لا توجد دروس قادمة</p>
                <Button onClick={() => navigate('/teachers')}>
                  <Plus className="h-4 w-4 mr-2" />
                  حجز درس جديد
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Latest Reviews Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">آخر التقييمات</h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviewsLoading ? (
              Array(2).fill(0).map((_, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : reviews && reviews.length > 0 ? (
              reviews.slice(0, 3).map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground mr-1">
                        ({review.rating}/5)
                      </span>
                    </div>
                    <p className="text-sm mb-2">{review.comment || 'لا يوجد تعليق'}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(review.created_at), 'PPP', { locale: ar })}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="md:col-span-2 lg:col-span-3 bg-muted rounded-lg p-6 text-center">
                <p className="text-muted-foreground">لا توجد تقييمات حتى الآن</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
