
import { supabase } from "@/integrations/supabase/client";

// Fetch teacher languages
export async function fetchTeacherLanguages(teacherId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('teacher_languages')
      .select('language')
      .eq('teacher_id', teacherId);
    
    if (error) {
      console.error('Error fetching teacher languages:', error);
      throw error;
    }
    
    return data.map(item => item.language);
  } catch (error) {
    console.error('Error in fetchTeacherLanguages:', error);
    throw error;
  }
}

// Add teacher language
export async function addTeacherLanguage(teacherId: string, language: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('teacher_languages')
      .insert({
        teacher_id: teacherId,
        language: language
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
    const { error } = await supabase
      .from('teacher_languages')
      .delete()
      .eq('teacher_id', teacherId)
      .eq('language', language);
    
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
