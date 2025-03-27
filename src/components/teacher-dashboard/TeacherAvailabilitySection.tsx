
import { useState } from 'react';
import { useTeacherAvailability } from '@/hooks/useTeacherAvailability';
import { AddAvailabilityDialog } from './availability/AddAvailabilityDialog';
import { AvailabilityCalendar } from './availability/AvailabilityCalendar';
import { WeeklyAvailabilityTable } from './availability/WeeklyAvailabilityTable';
import { ScheduledLessons } from './availability/ScheduledLessons';

interface TeacherAvailabilitySectionProps {
  teacherId?: string;
}

export const TeacherAvailabilitySection = ({ teacherId }: TeacherAvailabilitySectionProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const { availability, isLoading, addSlot, deleteSlot } = useTeacherAvailability(teacherId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الجدول</h2>
        <AddAvailabilityDialog onAddSlot={addSlot} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-12">
        <AvailabilityCalendar 
          date={date} 
          onDateChange={(newDate) => newDate && setDate(newDate)} 
        />
        
        <WeeklyAvailabilityTable 
          availability={availability} 
          onDeleteSlot={deleteSlot} 
        />
      </div>
      
      <ScheduledLessons />
    </div>
  );
};
