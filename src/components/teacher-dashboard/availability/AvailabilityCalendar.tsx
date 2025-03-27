
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AvailabilityCalendarProps {
  date: Date;
  onDateChange: (date: Date | undefined) => void;
}

export const AvailabilityCalendar = ({ date, onDateChange }: AvailabilityCalendarProps) => {
  return (
    <Card className="md:col-span-5">
      <CardHeader>
        <CardTitle>التقويم</CardTitle>
        <CardDescription>اختر يومًا لعرض جدولك</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && onDateChange(date)}
          className="mx-auto border rounded-md p-3"
        />
      </CardContent>
    </Card>
  );
};
