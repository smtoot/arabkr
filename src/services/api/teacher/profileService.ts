
import { supabase } from "@/integrations/supabase/client";
import { Teacher } from "@/types/teacher";

// Fetch teacher profile with all details
export async function fetchTeacherProfile(teacherId: string) {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        id,
        hourly_rate,
        education,
        teaching_style,
        years_experience,
        introduction_video_url,
        is_approved,
        profiles (
          first_name,
          last_name,
          avatar_url,
          bio,
          native_language
        )
      `)
      .eq('id', teacherId)
      .single();

    if (error) {
      console.error('Error fetching teacher profile:', error);
      throw error;
    }

    const teacher: Teacher = {
      id: data.id,
      profile: data.profiles,
      hourly_rate: data.hourly_rate,
      education: data.education,
      teaching_style: data.teaching_style,
      years_experience: data.years_experience,
      introduction_video_url: data.introduction_video_url,
      is_approved: data.is_approved,
      specialties: [], // Will be populated once schema is updated
      languages_spoken: [], // Will be populated once schema is updated
      avg_rating: 0, // Will be populated once schema is updated
      total_reviews: 0 // Will be populated once schema is updated
    };

    return teacher;
  } catch (error) {
    console.error('Error in fetchTeacherProfile:', error);
    throw error;
  }
}

// Update teacher profile
export async function updateTeacherProfile(teacherId: string, profileData: Partial<Teacher>) {
  try {
    // Update teacher table
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
    
    return true;
  } catch (error) {
    console.error('Error in updateTeacherProfile:', error);
    throw error;
  }
}

// Upload teacher profile picture
export async function uploadProfilePicture(teacherId: string, file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `teacher-avatars/${teacherId}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      throw uploadError;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', teacherId);
    
    if (updateError) {
      console.error('Error updating profile with new avatar:', updateError);
      throw updateError;
    }
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    throw error;
  }
}
