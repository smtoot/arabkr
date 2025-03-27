
import { Clock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AvailabilitySlot } from '@/hooks/useTeacherAvailability';

// Days of the week in Arabic
const daysOfWeek = [
  { id: 0, name: "الأحد" },
  { id: 1, name: "الإثنين" },
  { id: 2, name: "الثلاثاء" },
  { id: 3, name: "الأربعاء" },
  { id: 4, name: "الخميس" },
  { id: 5, name: "الجمعة" },
  { id: 6, name: "السبت" }
];

interface WeeklyAvailabilityTableProps {
  availability: AvailabilitySlot[];
  onDeleteSlot: (slotId: string) => Promise<boolean>;
}

export const WeeklyAvailabilityTable = ({ 
  availability, 
  onDeleteSlot 
}: WeeklyAvailabilityTableProps) => {
  return (
    <Card className="md:col-span-7">
      <CardHeader>
        <CardTitle>أوقات الإتاحة الأسبوعية</CardTitle>
        <CardDescription>الأوقات التي حددتها للدروس كل أسبوع</CardDescription>
      </CardHeader>
      <CardContent>
        {availability.length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">لم تقم بإضافة أي مواعيد بعد</p>
            <p className="text-muted-foreground mb-4">
              أضف مواعيد متاحة ليتمكن الطلاب من حجز دروس معك
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اليوم</TableHead>
                  <TableHead>من</TableHead>
                  <TableHead>إلى</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availability.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>{daysOfWeek[slot.day_of_week].name}</TableCell>
                    <TableCell>{slot.start_time}</TableCell>
                    <TableCell>{slot.end_time}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDeleteSlot(slot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
