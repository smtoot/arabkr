
import { supabase } from "@/integrations/supabase/client";

// Fetch upcoming lessons for teacher
export async function fetchUpcomingLessons(teacherId: string) {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        start_time,
        end_time,
        lesson_type,
        status,
        student_id,
        profiles:student_id (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('teacher_id', teacherId)
      .eq('status', 'confirmed')
      .gte('start_time', now)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching upcoming lessons:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchUpcomingLessons:', error);
    throw error;
  }
}
