
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewAvailabilitySlot } from '@/hooks/useTeacherAvailability';

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

interface AddAvailabilityDialogProps {
  onAddSlot: (slot: NewAvailabilitySlot) => Promise<boolean>;
}

export const AddAvailabilityDialog = ({ onAddSlot }: AddAvailabilityDialogProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSlot, setNewSlot] = useState<NewAvailabilitySlot>({
    day_of_week: 0,
    start_time: "09:00",
    end_time: "10:00",
    is_recurring: true
  });

  const handleAddSlot = async () => {
    const success = await onAddSlot(newSlot);
    if (success) {
      setShowAddDialog(false);
      // Reset form
      setNewSlot({
        day_of_week: 0,
        start_time: "09:00",
        end_time: "10:00",
        is_recurring: true
      });
    }
  };

  return (
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
  );
};
