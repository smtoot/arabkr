
import React from 'react';
import { format } from 'date-fns';
import { arMA } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimeSlot } from '@/hooks/useBookingForm';

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  onSelectTimeSlot: (slot: TimeSlot) => void;
  loading: boolean;
  selectedDate?: Date;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  timeSlots,
  selectedTimeSlot,
  onSelectTimeSlot,
  loading,
  selectedDate
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-muted-foreground">جاري تحميل المواعيد المتاحة...</p>
      </div>
    );
  }

  if (!selectedDate) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">يرجى تحديد تاريخ أولاً</p>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">لا توجد مواعيد متاحة في هذا اليوم</p>
        <p className="text-sm text-muted-foreground mt-2">يرجى اختيار يوم آخر</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {timeSlots.map((slot, index) => (
        <Button
          key={index}
          variant={selectedTimeSlot === slot ? "default" : "outline"}
          className={`flex flex-col h-auto py-3 ${!slot.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!slot.isAvailable}
          onClick={() => slot.isAvailable && onSelectTimeSlot(slot)}
        >
          <Clock className="h-4 w-4 mb-1" />
          <span className="text-sm">
            {format(slot.startTime, 'h:mm a', { locale: arMA })}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default TimeSlotPicker;
