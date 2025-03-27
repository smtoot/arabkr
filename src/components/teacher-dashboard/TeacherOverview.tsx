
import { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  MessageSquare,
  Video
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchUpcomingLessons } from '@/services/api/teacherProfileService';

interface TeacherOverviewProps {
  teacherId?: string;
}

export default function TeacherOverview({ teacherId }: TeacherOverviewProps) {
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUpcomingLessons = async () => {
      if (!teacherId) return;
      
      try {
        setIsLoading(true);
        const lessons = await fetchUpcomingLessons(teacherId);
        setUpcomingLessons(lessons);
      } catch (error) {
        console.error('Error loading upcoming lessons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUpcomingLessons();
  }, [teacherId]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">نظرة عامة</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">الدروس القادمة</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingLessons.length || 0}</div>
            <p className="text-muted-foreground">جلسات مجدولة</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">الطلاب</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-muted-foreground">طلاب نشطين</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">الساعات المكملة</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-muted-foreground">ساعات تدريس</p>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-xl font-semibold mt-8">الدروس القادمة</h3>
      {upcomingLessons.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-center">لا توجد دروس مجدولة قادمة</p>
            <p className="text-muted-foreground text-center">
              قم بتحديث جدولك بانتظام لزيادة فرصة حجز الطلاب للدروس معك
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* We'll render upcoming lessons here when we have data */}
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">
                سيتم عرض الدروس القادمة هنا عندما يحجز الطلاب جلسات معك
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
