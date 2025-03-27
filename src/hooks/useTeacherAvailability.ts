
import { useState, useEffect } from 'react';
import { 
  fetchTeacherAvailability, 
  addAvailabilitySlot,
  deleteAvailabilitySlot 
} from '@/services/api/teacher/availabilityService';

export interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
}

export interface NewAvailabilitySlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
}

export const useTeacherAvailability = (teacherId?: string) => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadAvailability = async () => {
    if (!teacherId) return;
    
    try {
      setIsLoading(true);
      const data = await fetchTeacherAvailability(teacherId);
      
      // Handle the different possible return types
      if (Array.isArray(data)) {
        setAvailability(data as AvailabilitySlot[]);
      } else if (data && 'availability' in data) {
        // If data contains availability and existingBookings properties
        setAvailability(data.availability as AvailabilitySlot[]);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSlot = async (newSlot: NewAvailabilitySlot) => {
    if (!teacherId) return false;
    
    try {
      await addAvailabilitySlot(teacherId, newSlot);
      await loadAvailability();
      return true;
    } catch (error) {
      console.error('Error adding availability slot:', error);
      return false;
    }
  };

  const deleteSlot = async (slotId: string) => {
    if (!teacherId) return false;
    
    try {
      await deleteAvailabilitySlot(slotId);
      await loadAvailability();
      return true;
    } catch (error) {
      console.error('Error deleting availability slot:', error);
      return false;
    }
  };

  useEffect(() => {
    loadAvailability();
  }, [teacherId]);

  return {
    availability,
    isLoading,
    addSlot,
    deleteSlot
  };
};
