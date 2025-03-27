
import { useEffect, useState } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { TeacherStatsCard } from './TeacherStatsCard';
import { EmptyStateCard } from './EmptyStateCard';
import { Video } from 'lucide-react';
import { fetchUpcomingLessons } from '@/services/api/teacherProfileService';

interface TeacherOverviewSectionProps {
  teacherId?: string;
}

export const TeacherOverviewSection = ({ teacherId }: TeacherOverviewSectionProps) => {
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
        <TeacherStatsCard
          title="الدروس القادمة"
          value={upcomingLessons.length || 0}
          description="جلسات مجدولة"
          icon={Calendar}
          isLoading={isLoading}
        />
        
        <TeacherStatsCard
          title="الطلاب"
          value={0}
          description="طلاب نشطين"
          icon={Users}
          isLoading={isLoading}
        />
        
        <TeacherStatsCard
          title="الساعات المكملة"
          value={0}
          description="ساعات تدريس"
          icon={Clock}
          isLoading={isLoading}
        />
      </div>
      
      <h3 className="text-xl font-semibold mt-8">الدروس القادمة</h3>
      {upcomingLessons.length === 0 ? (
        <EmptyStateCard 
          icon={Video}
          title="لا توجد دروس مجدولة قادمة"
          description="قم بتحديث جدولك بانتظام لزيادة فرصة حجز الطلاب للدروس معك"
        />
      ) : (
        <div className="space-y-4">
          {/* We'll render upcoming lessons here when we have data */}
          <EmptyStateCard 
            icon={Video}
            title="لا توجد دروس مجدولة قادمة"
            description="سيتم عرض الدروس القادمة هنا عندما يحجز الطلاب جلسات معك"
          />
        </div>
      )}
    </div>
  );
};
