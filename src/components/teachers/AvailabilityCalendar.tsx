
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ar } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Temporary mock data for teacher availability
const mockAvailableDays = [1, 2, 4, 5]; // 0 = Sunday, 1 = Monday, etc.
const mockAvailableTimeSlots = [
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '13:00', end: '14:00' },
  { start: '14:00', end: '15:00' },
  { start: '18:00', end: '19:00' },
];

interface AvailabilityCalendarProps {
  teacherId: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ teacherId }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState(mockAvailableTimeSlots);

  // This will be replaced with real data fetching
  const isDayAvailable = (day: Date) => {
    return mockAvailableDays.includes(day.getDay());
  };

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    // In real implementation, fetch available time slots for the selected date
    // For now, we'll just show mock data
    const isAvailable = date ? isDayAvailable(date) : false;
    setAvailableSlots(isAvailable ? mockAvailableTimeSlots : []);
  };

  // Customize the calendar to show available days
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">الأوقات المتاحة</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="py-2 justify-center cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    >
                      {slot.start} - {slot.end}
                    </Badge>
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
