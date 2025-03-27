
import { supabase } from "@/integrations/supabase/client";

// Fetch teacher students
export async function fetchTeacherStudents(teacherId: string) {
  try {
    // Get all students who have had at least one booking with this teacher
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        student_id,
        profiles:student_id (
          first_name,
          last_name,
          avatar_url,
          email
        )
      `)
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching teacher students:', error);
      throw error;
    }
    
    // Remove duplicates (students who have had multiple lessons)
    const uniqueStudents = data.filter((obj, index, self) => 
      index === self.findIndex((o) => o.student_id === obj.student_id)
    );
    
    return uniqueStudents || [];
  } catch (error) {
    console.error('Error in fetchTeacherStudents:', error);
    throw error;
  }
}
