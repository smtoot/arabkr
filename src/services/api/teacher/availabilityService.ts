
import { supabase } from "@/integrations/supabase/client";

// Fetch teacher availability
export async function fetchTeacherAvailability(teacherId: string, startDate?: Date, endDate?: Date) {
  try {
    let query = supabase
      .from('availability')
      .select('*')
      .eq('teacher_id', teacherId);
      
    if (startDate && endDate) {
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('teacher_id', teacherId)
        .gte('start_time', startDateStr)
        .lte('start_time', endDateStr)
        .in('status', ['confirmed', 'pending']);
      
      if (bookingsError) {
        console.error('Error fetching teacher bookings:', bookingsError);
        throw bookingsError;
      }
      
      const { data: availabilityData, error: availabilityError } = await query;
      
      if (availabilityError) {
        console.error('Error fetching availability:', availabilityError);
        throw availabilityError;
      }
      
      return { 
        availability: availabilityData || [], 
        existingBookings: bookingsData || [] 
      };
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchTeacherAvailability:', error);
    throw error;
  }
}

// Add new availability slot
export async function addAvailabilitySlot(teacherId: string, slotData: any) {
  try {
    const { error } = await supabase
      .from('availability')
      .insert({
        teacher_id: teacherId,
        day_of_week: slotData.day_of_week,
        start_time: slotData.start_time,
        end_time: slotData.end_time,
        is_recurring: slotData.is_recurring
      });
    
    if (error) {
      console.error('Error adding availability slot:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addAvailabilitySlot:', error);
    throw error;
  }
}

// Delete availability slot
export async function deleteAvailabilitySlot(slotId: string) {
  try {
    const { error } = await supabase
      .from('availability')
      .delete()
      .eq('id', slotId);
    
    if (error) {
      console.error('Error deleting availability slot:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteAvailabilitySlot:', error);
    throw error;
  }
}
