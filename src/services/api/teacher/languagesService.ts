
import { supabase } from "@/integrations/supabase/client";

// Fetch teacher languages
export async function fetchTeacherLanguages(teacherId: string): Promise<string[]> {
  try {
    // Using a custom SQL query to work around type issues
    const { data, error } = await supabase
      .rpc('execute_sql', {
        query_text: `SELECT language FROM teacher_languages WHERE teacher_id = '${teacherId}'`
      });
    
    if (error) {
      console.error('Error fetching teacher languages:', error);
      throw error;
    }
    
    // Extract language values from the result
    return (data || []).map((item: any) => item.language);
  } catch (error) {
    console.error('Error in fetchTeacherLanguages:', error);
    throw error;
  }
}

// Add teacher language
export async function addTeacherLanguage(teacherId: string, language: string): Promise<boolean> {
  try {
    // Using a custom SQL query to work around type issues
    const { error } = await supabase
      .rpc('execute_sql', {
        query_text: `INSERT INTO teacher_languages (teacher_id, language) 
                    VALUES ('${teacherId}', '${language}')
                    ON CONFLICT (teacher_id, language) DO NOTHING`
      });
    
    if (error) {
      console.error('Error adding teacher language:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addTeacherLanguage:', error);
    throw error;
  }
}

// Remove teacher language
export async function removeTeacherLanguage(teacherId: string, language: string): Promise<boolean> {
  try {
    // Using a custom SQL query to work around type issues
    const { error } = await supabase
      .rpc('execute_sql', {
        query_text: `DELETE FROM teacher_languages 
                    WHERE teacher_id = '${teacherId}' AND language = '${language}'`
      });
    
    if (error) {
      console.error('Error removing teacher language:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeTeacherLanguage:', error);
    throw error;
  }
}
