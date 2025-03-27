
import React from 'react';
import { format } from 'date-fns';
import { arMA } from 'date-fns/locale';
import { Calendar, Clock, Check } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TimeSlot } from '@/hooks/useBookingForm';

interface BookingSummaryProps {
  teacherName: string;
  selectedDate?: Date;
  selectedTimeSlot: TimeSlot | null;
  selectedDuration: number;
  bookingCost: number;
  isFormComplete: boolean;
  onSubmit: () => void;
  loading: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  teacherName,
  selectedDate,
  selectedTimeSlot,
  selectedDuration,
  bookingCost,
  isFormComplete,
  onSubmit,
  loading
}) => {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>ملخص الحجز</CardTitle>
        <CardDescription>تفاصيل درسك المختار</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {teacherName && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">المعلم:</span>
            <span className="font-medium">{teacherName}</span>
          </div>
        )}
        
        {selectedDate && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">التاريخ:</span>
            <span className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: arMA })}
            </span>
          </div>
        )}
        
        {selectedTimeSlot && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">الوقت:</span>
            <span className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {format(selectedTimeSlot.startTime, 'h:mm a', { locale: arMA })}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">المدة:</span>
          <span className="font-medium">{selectedDuration} دقيقة</span>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between font-semibold">
            <span>الإجمالي:</span>
            <span>{bookingCost.toFixed(2)} ريال سعودي</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!isFormComplete || loading} 
          onClick={onSubmit}
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
              <span className="mr-2">جاري المعالجة...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              تأكيد الحجز والدفع
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingSummary;
