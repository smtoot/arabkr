import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  fetchTeacherAvailability, 
  addAvailabilitySlot,
  deleteAvailabilitySlot 
} from '@/services/api/teacherProfileService';

interface TeacherAvailabilityProps {
  teacherId?: string;
}

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

export default function TeacherAvailability({ teacherId }: TeacherAvailabilityProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [availability, setAvailability] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New slot form state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day_of_week: 0,
    start_time: "09:00",
    end_time: "10:00",
    is_recurring: true
  });

  useEffect(() => {
    const loadAvailability = async () => {
      if (!teacherId) return;
      
      try {
        setIsLoading(true);
        const data = await fetchTeacherAvailability(teacherId);
        setAvailability(data || []);
      } catch (error) {
        console.error('Error loading availability:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailability();
  }, [teacherId]);

  const handleAddSlot = async () => {
    if (!teacherId) return;
    
    try {
      await addAvailabilitySlot(teacherId, newSlot);
      // Refresh availability data
      const data = await fetchTeacherAvailability(teacherId);
      setAvailability(data || []);
      setShowAddDialog(false);
      
      // Reset form
      setNewSlot({
        day_of_week: 0,
        start_time: "09:00",
        end_time: "10:00",
        is_recurring: true
      });
    } catch (error) {
      console.error('Error adding availability slot:', error);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!teacherId) return;
    
    try {
      await deleteAvailabilitySlot(slotId);
      // Refresh availability data
      const data = await fetchTeacherAvailability(teacherId);
      setAvailability(data || []);
    } catch (error) {
      console.error('Error deleting availability slot:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الجدول</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> إضافة موعد جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة موعد جديد للجدول</DialogTitle>
              <DialogDescription>
                حدد اليوم والوقت الذي ستكون متاحًا فيه لإعطاء الدروس.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="day" className="text-right col-span-1">اليوم:</label>
                <div className="col-span-3">
                  <Select 
                    value={newSlot.day_of_week.toString()} 
                    onValueChange={(value) => setNewSlot({...newSlot, day_of_week: parseInt(value)})}
                  >
                    <SelectTrigger id="day">
                      <SelectValue placeholder="اختر يومًا" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day.id} value={day.id.toString()}>
                          {day.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="start-time" className="text-right col-span-1">وقت البدء:</label>
                <input
                  id="start-time"
                  type="time"
                  value={newSlot.start_time}
                  onChange={(e) => setNewSlot({...newSlot, start_time: e.target.value})}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="end-time" className="text-right col-span-1">وقت الانتهاء:</label>
                <input
                  id="end-time"
                  type="time"
                  value={newSlot.end_time}
                  onChange={(e) => setNewSlot({...newSlot, end_time: e.target.value})}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddSlot}>إضافة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>التقويم</CardTitle>
            <CardDescription>اختر يومًا لعرض جدولك</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="mx-auto border rounded-md p-3"
            />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-7">
          <CardHeader>
            <CardTitle>أوقات الإتاحة الأسبوعية</CardTitle>
            <CardDescription>الأوقات التي حددتها ل��دروس كل أسبوع</CardDescription>
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
                            onClick={() => handleDeleteSlot(slot.id)}
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
      </div>
      
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
    </div>
  );
}
