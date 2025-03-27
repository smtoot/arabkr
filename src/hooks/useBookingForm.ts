
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  fetchLessonTypes, 
  fetchTeacherAvailability, 
  createBooking 
} from '@/services/api/bookingService';
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from 'react-router-dom';
import { addMinutes, format, parseISO, startOfWeek, endOfWeek, addDays, set } from 'date-fns';
import { ar } from 'date-fns/locale';

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

export interface LessonType {
  id: string;
  name: string;
  description: string;
}

export const useBookingForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { id: teacherId } = useParams();
  const navigate = useNavigate();
  
  const [lessonTypes, setLessonTypes] = useState<LessonType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(60); // minutes
  const [selectedLessonType, setSelectedLessonType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [teacherHourlyRate, setTeacherHourlyRate] = useState<number>(0);
  const [teacherName, setTeacherName] = useState<string>('');
  
  // Calculate booking cost
  const bookingCost = teacherHourlyRate * (selectedDuration / 60);
  
  // Load lesson types
  useEffect(() => {
    const loadLessonTypes = async () => {
      try {
        const types = await fetchLessonTypes();
        setLessonTypes(types);
        if (types.length > 0) {
          setSelectedLessonType(types[0].id);
        }
      } catch (error) {
        toast({
          title: "خطأ",
          description: "فشل في تحميل أنواع الدروس",
          variant: "destructive",
        });
      }
    };
    
    loadLessonTypes();
  }, [toast]);
  
  // Load teacher info
  useEffect(() => {
    const loadTeacherInfo = async () => {
      if (!teacherId) return;
      
      try {
        const { data, error } = await supabase
          .from('teachers')
          .select(`
            hourly_rate,
            profiles:id (
              first_name,
              last_name
            )
          `)
          .eq('id', teacherId)
          .single();
        
        if (error) throw error;
        
        setTeacherHourlyRate(data.hourly_rate);
        if (data.profiles) {
          setTeacherName(`${data.profiles.first_name} ${data.profiles.last_name}`);
        }
      } catch (error) {
        toast({
          title: "خطأ",
          description: "فشل في تحميل معلومات المعلم",
          variant: "destructive",
        });
      }
    };
    
    loadTeacherInfo();
  }, [teacherId, toast]);
  
  // Load available time slots when date changes
  useEffect(() => {
    const loadAvailableTimeSlots = async () => {
      if (!teacherId || !selectedDate) return;
      
      setLoading(true);
      try {
        // Get the start and end of the week containing the selected date
        const weekStart = startOfWeek(selectedDate);
        const weekEnd = endOfWeek(selectedDate);
        
        const { availability, existingBookings } = await fetchTeacherAvailability(
          teacherId,
          weekStart,
          weekEnd
        );
        
        // Process availability to get available time slots for the selected date
        const dayOfWeek = selectedDate.getDay();
        const dayAvailability = availability.filter(slot => slot.day_of_week === dayOfWeek);
        
        const slots: TimeSlot[] = [];
        
        // Create 30 min time slots from availability periods
        dayAvailability.forEach(availableSlot => {
          // Parse start and end times
          const [startHour, startMinute] = availableSlot.start_time.split(':').map(Number);
          const [endHour, endMinute] = availableSlot.end_time.split(':').map(Number);
          
          // Create a date object for the selected date with the start time
          let currentTime = set(selectedDate, { 
            hours: startHour, 
            minutes: startMinute, 
            seconds: 0 
          });
          
          // Create a date object for the selected date with the end time
          const endTime = set(selectedDate, { 
            hours: endHour, 
            minutes: endMinute, 
            seconds: 0 
          });
          
          // Create 30-minute slots
          while (currentTime < endTime) {
            const slotEndTime = addMinutes(currentTime, 30);
            
            // Check if slot conflicts with existing bookings
            const isConflicting = existingBookings.some(booking => {
              const bookingStart = parseISO(booking.start_time);
              const bookingEnd = parseISO(booking.end_time);
              
              return (
                (currentTime >= bookingStart && currentTime < bookingEnd) ||
                (slotEndTime > bookingStart && slotEndTime <= bookingEnd) ||
                (currentTime <= bookingStart && slotEndTime >= bookingEnd)
              );
            });
            
            slots.push({
              startTime: new Date(currentTime),
              endTime: new Date(slotEndTime),
              isAvailable: !isConflicting
            });
            
            currentTime = slotEndTime;
          }
        });
        
        setAvailableTimeSlots(slots);
      } catch (error) {
        toast({
          title: "خطأ",
          description: "فشل في تحميل المواعيد المتاحة",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadAvailableTimeSlots();
  }, [teacherId, selectedDate, toast]);
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!teacherId || !selectedTimeSlot || !selectedLessonType || !user) {
      toast({
        title: "خطأ",
        description: "يرجى إكمال جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      // Calculate the end time based on the selected duration
      const endTime = addMinutes(selectedTimeSlot.startTime, selectedDuration);
      
      // Create the booking
      const booking = await createBooking({
        teacher_id: teacherId,
        start_time: selectedTimeSlot.startTime.toISOString(),
        end_time: endTime.toISOString(),
        lesson_type: selectedLessonType,
        amount: bookingCost,
        notes: notes
      });
      
      toast({
        title: "تم إنشاء الحجز",
        description: "تم إنشاء الحجز بنجاح، يرجى إكمال عملية الدفع",
      });
      
      // Navigate to payment page
      navigate(`/booking/payment/${booking.id}`);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الحجز، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return {
    lessonTypes,
    selectedDate,
    setSelectedDate,
    availableTimeSlots,
    selectedTimeSlot,
    setSelectedTimeSlot,
    selectedDuration,
    setSelectedDuration,
    selectedLessonType,
    setSelectedLessonType,
    notes,
    setNotes,
    loading,
    handleSubmit,
    bookingCost,
    teacherName
  };
};
