
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ScheduledLessons = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>الدروس المجدولة</CardTitle>
        <CardDescription>جميع الدروس المجدولة القادمة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 border rounded-md">
          <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">لا توجد دروس مجدولة</p>
          <p className="text-muted-foreground">
            ستظهر الدروس هنا عندما يقوم الطلاب بحجز مواعيد معك
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
