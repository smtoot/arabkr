
import { supabase } from "@/integrations/supabase/client";

// Fetch upcoming lessons for student
export async function fetchUpcomingLessons(studentId: string) {
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
        teacher_id,
        teacher:teacher_id (
          profiles:id (
            first_name,
            last_name,
            avatar_url
          )
        )
      `)
      .eq('student_id', studentId)
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

// Fetch past lessons for student
export async function fetchPastLessons(studentId: string) {
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
        teacher_id,
        teacher:teacher_id (
          profiles:id (
            first_name,
            last_name,
            avatar_url
          )
        )
      `)
      .eq('student_id', studentId)
      .eq('status', 'completed')
      .lt('end_time', now)
      .order('start_time', { ascending: false });
    
    if (error) {
      console.error('Error fetching past lessons:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchPastLessons:', error);
    throw error;
  }
}
