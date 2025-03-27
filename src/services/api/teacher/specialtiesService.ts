
import { supabase } from "@/integrations/supabase/client";
import { TeacherSpecialty } from "@/types/teacher";

// Fetch teacher specialties
export async function fetchTeacherSpecialties(teacherId: string): Promise<TeacherSpecialty[]> {
  try {
    // Using a custom SQL query to work around type issues
    const { data, error } = await supabase
      .rpc('execute_sql', {
        query_text: `SELECT specialty FROM teacher_specialties WHERE teacher_id = '${teacherId}'`
      });
    
    if (error) {
      console.error('Error fetching teacher specialties:', error);
      throw error;
    }
    
    // Extract specialty values from the result and cast to TeacherSpecialty
    return (data || []).map((item: any) => item.specialty as TeacherSpecialty);
  } catch (error) {
    console.error('Error in fetchTeacherSpecialties:', error);
    throw error;
  }
}

// Add teacher specialty
export async function addTeacherSpecialty(teacherId: string, specialty: TeacherSpecialty): Promise<boolean> {
  try {
    // Using a custom SQL query to work around type issues
    const { error } = await supabase
      .rpc('execute_sql', {
        query_text: `INSERT INTO teacher_specialties (teacher_id, specialty) 
                    VALUES ('${teacherId}', '${specialty}')
                    ON CONFLICT (teacher_id, specialty) DO NOTHING`
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
    // Using a custom SQL query to work around type issues
    const { error } = await supabase
      .rpc('execute_sql', {
        query_text: `DELETE FROM teacher_specialties 
                    WHERE teacher_id = '${teacherId}' AND specialty = '${specialty}'`
      });
    
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
