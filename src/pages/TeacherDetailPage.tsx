
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Book, Calendar, MessageSquare, Video, Clock, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import ReviewsList from '@/components/teachers/ReviewsList';
import AvailabilityCalendar from '@/components/teachers/AvailabilityCalendar';
import { fetchTeacherById, fetchTeacherReviews, generateMockTeachers, generateMockReviews } from '@/services/api/teacherService';
import { Teacher, Review, TeacherSpecialty } from '@/types/teacher';

// Map specialties to Arabic
const specialtyLabels: Record<TeacherSpecialty, string> = {
  'conversation': 'محادثة',
  'grammar': 'قواعد',
  'vocabulary': 'مفردات',
  'reading': 'قراءة',
  'writing': 'كتابة',
  'business_korean': 'كورية الأعمال',
  'exam_preparation': 'تحضير الامتحانات'
};

const languageLabels: Record<string, string> = {
  '한국어': 'الكورية',
  'العربية': 'العربية',
  'English': 'الإنجليزية'
};

const TeacherDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  
  useEffect(() => {
    const loadTeacher = async () => {
      setLoading(true);
      try {
        // Use mock data for now
        // const data = await fetchTeacherById(id || '');
        const mockTeachers = generateMockTeachers(1);
        setTeacher(mockTeachers[0]);
      } catch (error) {
        console.error('Error loading teacher:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const loadReviews = async () => {
      setReviewsLoading(true);
      try {
        // Use mock data for now
        // const data = await fetchTeacherReviews(id || '');
        const mockReviewsData = generateMockReviews(id || '', 5);
        setReviews(mockReviewsData);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };
    
    if (id) {
      loadTeacher();
      loadReviews();
    }
  }, [id]);
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 space-y-6">
              <div className="flex gap-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="w-full lg:w-1/3">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!teacher) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">لم يتم العثور على المعلم</h1>
          <p className="mb-6">المعلم الذي تبحث عنه غير موجود أو غير متاح حاليًا.</p>
          <Link to="/teachers">
            <Button>العودة إلى قائمة المعلمين</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <Link to="/teachers" className="flex items-center gap-1 text-muted-foreground mb-6 hover:text-primary transition-colors" dir="rtl">
          <ArrowRight className="h-4 w-4" />
          <span>العودة إلى قائمة المعلمين</span>
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="w-full lg:w-2/3">
            {/* Teacher header */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8" dir="rtl">
              <Avatar className="h-24 w-24">
                <AvatarImage src={teacher.profile.avatar_url || ''} alt={`${teacher.profile.first_name} ${teacher.profile.last_name}`} />
                <AvatarFallback>{teacher.profile.first_name.charAt(0)}{teacher.profile.last_name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-3xl font-bold">
                  {teacher.profile.first_name} {teacher.profile.last_name}
                </h1>
                
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="font-medium ml-1">{teacher.avg_rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground">({teacher.total_reviews} تقييم)</span>
                  
                  {teacher.years_experience && (
                    <span className="text-muted-foreground">
                      <span className="mx-2">•</span>
                      خبرة {teacher.years_experience} سنوات
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {teacher.specialties && teacher.specialties.map((specialty, i) => (
                    <Badge key={i} className="bg-primary/10 text-primary hover:bg-primary/20">
                      {specialtyLabels[specialty] || specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full" dir="rtl">
              <TabsList className="w-full justify-start border-b bg-transparent p-0 mb-6">
                <TabsTrigger 
                  value="about" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
                >
                  نبذة عن المعلم
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
                >
                  التقييمات ({teacher.total_reviews})
                </TabsTrigger>
                <TabsTrigger 
                  value="availability" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
                >
                  المواعيد المتاحة
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-0">
                <div className="space-y-6">
                  {/* Bio */}
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold">السيرة الذاتية</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {teacher.profile.bio || 'لا توجد سيرة ذاتية متاحة.'}
                    </p>
                  </div>
                  
                  {/* Education */}
                  {teacher.education && (
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold">المؤهلات العلمية</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {teacher.education}
                      </p>
                    </div>
                  )}
                  
                  {/* Teaching Style */}
                  {teacher.teaching_style && (
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold">أسلوب التدريس</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {teacher.teaching_style}
                      </p>
                    </div>
                  )}
                  
                  {/* Languages */}
                  {teacher.languages_spoken && teacher.languages_spoken.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold">اللغات</h2>
                      <div className="flex flex-wrap gap-2">
                        {teacher.languages_spoken.map((language, i) => (
                          <Badge key={i} variant="outline">
                            {languageLabels[language] || language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-0">
                <ReviewsList reviews={reviews} isLoading={reviewsLoading} />
              </TabsContent>
              
              <TabsContent value="availability" className="mt-0">
                <AvailabilityCalendar teacherId={teacher.id} />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
            <Card className="sticky top-24">
              <CardContent className="p-6" dir="rtl">
                <div className="text-2xl font-bold text-primary mb-2">
                  {teacher.hourly_rate} ر.س
                  <span className="text-sm font-normal text-muted-foreground"> / ساعة</span>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-muted-foreground" />
                      <span>درس جديد</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-muted-foreground" />
                      <span>عبر الإنترنت</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>60 دقيقة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <span>العربية، الكورية</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 flex flex-col gap-3 border-t" dir="rtl">
                <Button className="w-full" size="lg">
                  حجز درس
                </Button>
                <Button variant="outline" className="w-full">
                  مراسلة المعلم
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDetailPage;
