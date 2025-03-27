
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ar } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fetchTeacherAvailability } from '@/services/api/teacherService';
import { useAuth } from '@/contexts/AuthContext';

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  day: number;
  slots: TimeSlot[];
}

interface AvailabilityCalendarProps {
  teacherId: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ teacherId }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyAvailability, setWeeklyAvailability] = useState<DayAvailability[]>([]);

  useEffect(() => {
    const loadAvailability = async () => {
      setIsLoading(true);
      try {
        const availabilityData = await fetchTeacherAvailability(teacherId);
        
        if (availabilityData && Array.isArray(availabilityData)) {
          // Process weekly availability data
          const weekly: DayAvailability[] = [];
          const days: number[] = [];
          
          availabilityData.forEach((slot: any) => {
            const day = slot.day_of_week;
            if (!days.includes(day)) {
              days.push(day);
            }
            
            const existingDayIdx = weekly.findIndex(d => d.day === day);
            const timeSlot = { start: slot.start_time, end: slot.end_time };
            
            if (existingDayIdx >= 0) {
              weekly[existingDayIdx].slots.push(timeSlot);
            } else {
              weekly.push({ day, slots: [timeSlot] });
            }
          });
          
          setWeeklyAvailability(weekly);
          setAvailableDays(days);
        }
      } catch (error) {
        console.error('Error loading availability:', error);
        toast({
          title: "خطأ في تحميل جدول المعلم",
          description: "يرجى المحاولة مرة أخرى لاحقًا",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (teacherId) {
      loadAvailability();
    }
  }, [teacherId, toast]);
  
  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    // Find slots for the selected day of week
    const dayOfWeek = date.getDay();
    const dayAvailability = weeklyAvailability.find(d => d.day === dayOfWeek);
    
    if (dayAvailability) {
      setAvailableSlots(dayAvailability.slots);
    } else {
      setAvailableSlots([]);
    }
  };

  // Customize the calendar to show available days
  const isDayAvailable = (date: Date) => {
    return availableDays.includes(date.getDay());
  };

  const modifiers = {
    available: (date: Date) => isDayAvailable(date),
  };

  const modifiersClassNames = {
    available: 'bg-primary/10 font-bold text-primary',
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">اختر التاريخ</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleSelectDate}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  locale={ar}
                  className="rounded-md border"
                  disabled={{ before: new Date() }}
                />
                <div className="flex items-center justify-end gap-2 mt-2 text-sm">
                  <Badge variant="outline" className="bg-primary/10 text-primary">الأيام المتاحة</Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">الأوقات المتاحة</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              selectedDate ? (
                availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="py-2 justify-center hover:bg-primary hover:text-primary-foreground"
                        asChild
                      >
                        <a href={`/booking/${teacherId}?date=${selectedDate?.toISOString()}&time=${slot.start}`}>
                          {slot.start} - {slot.end}
                        </a>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد أوقات متاحة في هذا التاريخ
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  يرجى اختيار تاريخ لعرض الأوقات المتاحة
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
