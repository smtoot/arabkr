
import { supabase } from "@/integrations/supabase/client";
import { TeacherSpecialty } from "@/types/teacher";

// Fetch teacher specialties
export async function fetchTeacherSpecialties(teacherId: string): Promise<TeacherSpecialty[]> {
  try {
    const { data, error } = await supabase
      .from('teacher_specialties')
      .select('specialty')
      .eq('teacher_id', teacherId);
    
    if (error) {
      console.error('Error fetching teacher specialties:', error);
      throw error;
    }
    
    return data.map(item => item.specialty as TeacherSpecialty);
  } catch (error) {
    console.error('Error in fetchTeacherSpecialties:', error);
    throw error;
  }
}

// Add teacher specialty
export async function addTeacherSpecialty(teacherId: string, specialty: TeacherSpecialty): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('teacher_specialties')
      .insert({
        teacher_id: teacherId,
        specialty: specialty
      });
    
    if (error) {
      console.error('Error adding teacher specialty:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addTeacherSpecialty:', error);
    throw error;
  }
}

// Remove teacher specialty
export async function removeTeacherSpecialty(teacherId: string, specialty: TeacherSpecialty): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('teacher_specialties')
      .delete()
      .eq('teacher_id', teacherId)
      .eq('specialty', specialty);
    
    if (error) {
      console.error('Error removing teacher specialty:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeTeacherSpecialty:', error);
    throw error;
  }
}
