
import { useState } from 'react';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarDays, Clock, MessageSquare, Plus, ChevronRight } from 'lucide-react';

interface LessonType {
  id: string;
  start_time: string;
  end_time: string;
  lesson_type: string;
  status: string;
  teacher_id: string;
  teacher: {
    profiles: {
      first_name: string;
      last_name: string;
      avatar_url: string | null;
    };
  };
}

interface UpcomingLessonsSectionProps {
  lessons?: LessonType[];
  isLoading: boolean;
}

export const UpcomingLessonsSection = ({ lessons, isLoading }: UpcomingLessonsSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">الدروس القادمة</h2>
        <Button variant="ghost" className="text-primary" onClick={() => navigate('/student/lessons')}>
          عرض الكل <ChevronRight className="h-4 w-4 mr-1" />
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
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
        ) : lessons && lessons.length > 0 ? (
          lessons.slice(0, 3).map((lesson) => (
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
  );
};
