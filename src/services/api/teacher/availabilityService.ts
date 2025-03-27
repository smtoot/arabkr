
import { supabase } from "@/integrations/supabase/client";

// Fetch teacher availability
export async function fetchTeacherAvailability(teacherId: string) {
  try {
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('teacher_id', teacherId);
    
    if (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
    
    return data || [];
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
