
import { supabase } from "@/integrations/supabase/client";
import { Teacher, TeacherSpecialty } from "@/types/teacher";
import { addTeacherLanguage, removeTeacherLanguage } from "./languagesService";
import { addTeacherSpecialty, removeTeacherSpecialty } from "./specialtiesService";

// Update teacher profile with specialties and languages
export async function updateTeacherProfileComplete(
  teacherId: string, 
  profileData: Partial<Teacher>,
  newSpecialties?: TeacherSpecialty[],
  removedSpecialties?: TeacherSpecialty[],
  newLanguages?: string[],
  removedLanguages?: string[]
) {
  try {
    // Start by updating the teacher profile
    const teacherUpdate = {
      hourly_rate: profileData.hourly_rate,
      education: profileData.education,
      teaching_style: profileData.teaching_style,
      years_experience: profileData.years_experience,
      introduction_video_url: profileData.introduction_video_url
    };
    
    const { error: teacherError } = await supabase
      .from('teachers')
      .update(teacherUpdate)
      .eq('id', teacherId);
    
    if (teacherError) {
      console.error('Error updating teacher profile:', teacherError);
      throw teacherError;
    }
    
    // Update profiles table if profile data was included
    if (profileData.profile) {
      const profileUpdate = {
        first_name: profileData.profile.first_name,
        last_name: profileData.profile.last_name,
        bio: profileData.profile.bio,
        native_language: profileData.profile.native_language
      };
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', teacherId);
      
      if (profileError) {
        console.error('Error updating user profile:', profileError);
        throw profileError;
      }
    }
    
    // Update specialties if provided
    if (newSpecialties && newSpecialties.length > 0) {
      for (const specialty of newSpecialties) {
        await addTeacherSpecialty(teacherId, specialty);
      }
    }
    
    if (removedSpecialties && removedSpecialties.length > 0) {
      for (const specialty of removedSpecialties) {
        await removeTeacherSpecialty(teacherId, specialty);
      }
    }
    
    // Update languages if provided
    if (newLanguages && newLanguages.length > 0) {
      for (const language of newLanguages) {
        await addTeacherLanguage(teacherId, language);
      }
    }
    
    if (removedLanguages && removedLanguages.length > 0) {
      for (const language of removedLanguages) {
        await removeTeacherLanguage(teacherId, language);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateTeacherProfileComplete:', error);
    throw error;
  }
}
